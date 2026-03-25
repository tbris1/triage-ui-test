from typing import Any, Dict, List, Optional
import yaml
import json
import os

# load YAML file as dictionary
def load_yaml(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

# Theme -> route to paths 
topic_to_paths = {
    # Core identifiers / admin
    "PERSONAL_DETAILS": [
        "patient.personal_details.name",
        "patient.personal_details.id",
        "patient.personal_details.age",
        "patient.personal_details.dob",
        "patient.personal_details.weight",
    ],
    "NURSE_DETAILS": [
        "patient.current_nurse"
    ],
    "ESCALATION_STATUS": [
        "patient.escalation_status",
    ],
    "LOCATION": [
        "patient.location.ward",
        "patient.location.bed",
    ],

    # Presenting problem / context
    "ADMISSION": [
        "patient.admission.reason",
        "patient.admission.day",
    ],
    "BACKGROUND_PMH": [
        "patient.background.pmh",
        "patient.background.family_history",
    ],

    # Medications & fluids
    "ALLERGIES": [
        "patient.medications.allergies",
    ],
    "MEDS_REGULAR": [
        "patient.medications.regular_medications",
    ],
    "MEDS_NEW": [
        "patient.medications.new_medications",
    ],
    "MEDS_PRN": [
        "patient.medications.as_required_PRN",
    ],
    "IV_FLUIDS": [
        "patient.medications.iv_fluids",
    ],

    # Observations / nursing data
    "OBSERVATIONS": [
        "patient.nursing_observations.obs_history",
    ],
    "FLUID_BALANCE": [
        "patient.nursing_observations.fluid_balance",
    ],
    "STOOL": [
        "patient.nursing_observations.stool",
    ],

    # Symptoms / current story
    "SYMPTOMS": [
        "patient.symptoms_reported",
    ],
    "CONFUSION": [
        "patient.symptoms_reported.confusion",
    ],
    "BOWELS": [
        "patient.symptoms_reported.bowels",
        "patient.nursing_observations.stool",
    ],
    "URINE_OUTPUT": [
        "patient.symptoms_reported.urine_output",
        "patient.nursing_observations.fluid_balance",
    ],

    # Investigations
    "RECENT_BLOODS": [
        "patient.recent_blood_tests",
    ],

    # Nurse scope / tasking constraints
    "NURSE_PERMITTED_TASKS": [
        "patient.nurse_permitted_tasks",
    ],
    "NURSE_CAN_DO": [
        "patient.nurse_permitted_tasks",  # interpret permitted==true downstream
    ],
    "NURSE_CANNOT_DO": [
        "patient.nurse_permitted_tasks",  # interpret permitted==false + reason downstream
    ],
}


# Router system prompt for classifying questions
router_system_prompt = f"""You are a routing classifier for a simulated ward nurse. 

You will be given:
1) A doctor's free-text question.
2) A list of allowed TOPICS and the YAML schema.

Your task:
- Choose the best TOPIC or TOPICS.
- Provide YAML path(s) that contain the information needed to answer.
- If the question is ambiguous, return a short clarifying_question instead.

Return ONLY valid JSON with keys: 
topic, yaml_paths, clarifying_question

Example output format:
{{
  "topic": ["OBS_TREND"],
  "yaml_paths": ["patient.nursing_observations.obs_history"],
  "clarifying_question": null
}}

TOPICS:
PERSONAL_DETAILS, NURSE_DETAILS, ESCALATION_STATUS, LOCATION, ADMISSION, PMH, MEDS_REGULAR, MEDS_NEW, ALLERGIES, OBSERVATIONS, FLUID_BALANCE, STOOL, RECENT_BLOODS, SYMPTOMS, NURSE_PERMITTED_TASKS, NURSE_CAN_DO, NURSE_CANNOT_DO

TOPIC_TO_PATHS = {topic_to_paths}
Rules:
- Do not answer the doctor.
- Do not invent fields.
- Prefer the smallest number of yaml_paths.
"""

def get_by_paths(data: Dict[str, Any], paths: List[str]) -> Dict[str, Any]:
    result = {}
    for path in paths:
        keys = path.split('.')
        sub_data = data
        for key in keys:
            sub_data = sub_data.get(key, {})
        result[path] = sub_data
    return result

def router_classify_question(client, question: str) -> dict:
    response = client.responses.create(
       model="gpt-5-mini",
       instructions=router_system_prompt, 
       input=question
       )
    return json.loads(response.output_text)

nurse_system_prompt = """You are a ward nurse speaking to an on-call doctor.
You are requesting a review of a patient under your care.
You must answer the doctor's follow-up questions using the provided PATIENT_DATA payload.
You must answer briefly and you may not know certain details.
Do not offer to carry out additional tasks unless asked directly.
Only provide answers to the specific question or questions asked.
If clarifying_question is provided, consider asking a follow-up question before answering.


Keep replies brief, friendly, and realistic.
DO NOT just list data - engage in a conversational manner.
"""

def nurse_turn(client, yaml_path: str, doctor_question: str, initial_nurse_bleep_request: str = None, conversation_history: List[Dict] = None) -> str:
    """
    Handle a nurse's response to a doctor's question.

    Args:
        client: OpenAI client instance
        yaml_path: Path to the patient YAML file (e.g., "Richard_Crowther")
        doctor_question: The doctor's question
        initial_nurse_bleep_request: The initial request from the nurse (optional, will use from YAML if not provided)
        conversation_history: Full prior conversation as list of {role, content} dicts

    Returns:
        The nurse's response as a string
    """
    # Load patient data from YAML file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    yaml_file_path = os.path.join(script_dir, "patient_data", f"{yaml_path}.yaml")
    patient_data = load_yaml(yaml_file_path)

    # Get initial_nurse_bleep_request from YAML if not provided
    if initial_nurse_bleep_request is None:
        initial_nurse_bleep_request = patient_data.get('patient', {}).get('initial_nurse_bleep_request', '')

    # Classify the question to get relevant data paths
    classified = router_classify_question(client, doctor_question)
    yaml_paths = classified.get("yaml_paths", [])
    clarifying_question = classified.get("clarifying_question", [])

    new_nurse_data = get_by_paths(patient_data, yaml_paths)
    new_nurse_data_str = json.dumps(new_nurse_data, indent=2)

    print("Nurse data provided to LLM:")
    print(new_nurse_data_str)

    # Build multi-turn input
    input_messages = []

    # 1. Opening context: nurse's initial bleep
    if initial_nurse_bleep_request:
        input_messages.append({"role": "assistant", "content": initial_nurse_bleep_request})

    # 2. Prior conversation turns (exclude system messages and the last user message)
    if conversation_history:
        prior = [m for m in conversation_history if m.get("role") != "system"]
        # Drop the last user message — it's doctor_question, handled below
        if prior and prior[-1].get("role") == "user":
            prior = prior[:-1]
        input_messages.extend({"role": m["role"], "content": m["content"]} for m in prior)

    # 3. Current question + patient data
    input_messages.append({
        "role": "user",
        "content": f"""DOCTOR_RESPONSE:
{doctor_question}

CLARIFYING_QUESTION:
{clarifying_question}

PATIENT_DATA:
{new_nurse_data_str}"""
    })

    response = client.responses.create(
        model="gpt-5-mini",
        instructions=nurse_system_prompt,
        input=input_messages
    )
    return response.output_text
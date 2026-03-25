import { Scenario } from './types';

export const scenarios: Scenario[] = [
  {
    id: 'urine-output',
    patient_name: 'Richard Crowther',
    yaml_path: 'Richard_Crowther',
    title: 'Reduced Urine Output',
    description: 'A nurse calls about a patient with reduced urine output',
    initialPrompt: `Hi doctor, please could you review one of my patients, Richard Crowther? He has become more confused this evening and his urine output is very low.`,
    correctTriage: 'urgent',
    learningPoints: [
      'New confusion alone increases a NEWS2 score by 3',
      'Reduced urine output alone can meet the criteria for an AKI',
      'Consider ward investigations to investigate redued UO - e.g. bladder scan / fluid balance chart',
      'This requires immediate evaluation'
    ]
  },
  {
    id: 'dka',
    patient_name: 'Millie Edwards',
    yaml_path: 'Millie_Edwards',
    title: 'Drowsy',
    description: 'A nurse calls about a drowsy patient she is worried about',
    initialPrompt: `Hi doctor, please could you urgently review Millie Edwards in ED Obs bed 4? She’s very drowsy and seems short of breath. She looks really unwell to be honest.`,
    correctTriage: 'emergency',
    learningPoints: [
      'To be confirmed...'
    ]
  },
  {
    id: 'urti',
    patient_name: 'Fiona Johnson',
    yaml_path: 'Fiona_Johnson',
    title: 'Cough',
    description: 'A nurse calls about a patient with a new cough',
    initialPrompt: `Hi doctor, sorry to bother you — could you review Fiona Johnson in bed 12 when you get a chance? She’s developed a new cough today. Obs are okay but I'd like a medical review.`,
    correctTriage: 'non-urgent',
    learningPoints: [
      'Classic viral URTI symptoms',
      'Be aware that PEs often present with fever and cough',
      'Would a D-dimer help in this case, or would it just cause more confusion?',
      'Can be managed with supportive care and follow-up if worsening',
      'A concerned nurse is always worth a review, but this patient is not acutely unwell'
    ]
  },
  {
    id: 'abdominal-pain',
    title: 'Abdominal Pain',
    description: 'A nurse calls about a patient with abdominal pain',
    initialPrompt: `You are a nurse calling about a patient with abdominal pain. The patient is a 32-year-old female with right lower quadrant pain that started yesterday. Pain is now 7/10, worse with movement. She has nausea and one episode of vomiting. Last menstrual period was 3 weeks ago. Vital signs: BP 128/82, HR 92, RR 18, Temp 38.2°C. Stay in character as the nurse.`,
    correctTriage: 'urgent',
    learningPoints: [
      'RLQ pain with fever suggests appendicitis',
      'Needs evaluation within hours, not days',
      'Must rule out ectopic pregnancy in woman of childbearing age',
      'Not immediately life-threatening but requires timely assessment'
    ]
  },
  {
    id: 'fall',
    title: 'Fall with Hip Pain',
    description: 'A nurse calls about an elderly patient who fell',
    initialPrompt: `You are a nurse calling about an elderly patient. The patient is an 82-year-old female who fell at home 4 hours ago. She has pain in her right hip and cannot bear weight. She didn't hit her head and didn't lose consciousness. She's alert and oriented. Vital signs stable: BP 135/78, HR 76, RR 16. She lives alone and is currently lying on a couch. Stay in character as the nurse.`,
    correctTriage: 'urgent',
    learningPoints: [
      'Inability to bear weight after fall suggests fracture',
      'Elderly patients are high risk for hip fractures',
      'Needs imaging and evaluation same day',
      'Not immediately life-threatening but requires prompt care'
    ]
  }
];

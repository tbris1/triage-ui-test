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
    id: 'hypotension',
    patient_name: 'Ronald O\'Brien',
    yaml_path: 'Ronald_OBrien',
    title: 'Low BP',
    description: 'A nurse calls about a patient with low BP',
    initialPrompt: "Hi doctor, please could you review one of my patients, Ronald O'Brien? His blood pressure is really quite low on the last obs round.",
    correctTriage: 'urgent',
    learningPoints: [
      'To be confirmed...'
    ]
  },
  {
    id: 'fall',
    title: 'Fall',
    patient_name: 'Ibrahim Patel',
    yaml_path: 'Ibrahim_Patel',
    description: 'A nurse calls about an elderly patient who fell',
    initialPrompt:  'Hi doctor, please could you review Mr Patel, hospital number IP654321? He had an unwitnessed fall about 20 minutes ago. We've helped him back into bed but he'll need a falls review.',
    correctTriage: 'urgent',
    learningPoints: [
      'Unwitnessed fall in an elerly patient on clopidogrel and possible new neurological deficit',
      'Which elements of a falls review could you initiate before seeing a patient?'
    ]
  }
];

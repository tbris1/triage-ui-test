# Medical Triage Training Application

A web application for medical students to practice triaging nurse requests using AI-powered conversations.

## Features

- **Multiple Scenarios**: Practice with various medical and surgical cases
- **Interactive Chat**: Converse with an AI nurse to gather patient information
- **Triage Decision System (TBC)**: Submit your triage assessment with reasoning
- **Instant Feedback (TBC)**: Get immediate feedback on your decisions with learning points
- **Session History (TBC)**: Review past sessions and conversations

## Architecture

- **Frontend**: React + TypeScript + Vite + Bootstrap
- **Backend**: Flask + OpenAI API
- **Storage**: LocalStorage for session history

## Setup Instructions (for local hosting - plan to deploy online)

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your OpenAI API key
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=your_actual_key_here

# Run the Flask server
python app.py
```

The backend will run on http://localhost:5000

### 2. Frontend Setup

In a new terminal:

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:5173 (or the next available port)

## Usage

1. **Select a Scenario**: Choose from the available medical scenarios
2. **Chat with the Nurse**: Ask questions to gather patient information

3. **Make Your Decision**: Submit your triage level (Emergency/Urgent/Non-Urgent) with reasoning
4. **Review Feedback**: Learn from the correct answer and key learning points
5. **View History**: Access past sessions from the Session History button

(NB: 3-5 may be removed for initial pilot sessions as they might introduce more complexity than needed at this point)

## Triage Levels

- **Emergency**: Life-threatening, needs immediate attention
- **Urgent**: Serious but stable, needs attention within hours
- **Non-Urgent**: Can wait for routine appointment

## Customization

### Adding New Scenarios

Edit [src/scenarios.ts](src/scenarios.ts) to add new medical cases:

```typescript
{
  id: 'unique-id',
  patient_name: 'Firstname Surname',
  yaml_path: 'Firstname_Surname',
  title: 'Scenario Title',
  description: 'Brief description',
  initialPrompt: 'System prompt for the AI nurse... (also needs to be added to yaml file)',
  correctTriage: 'emergency' | 'urgent' | 'non-urgent',
  learningPoints: ['Point 1', 'Point 2', ...]
}
```

## Project Structure (may be revised)

```
triage-ui-test/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── .env               # API keys (create this)
├── src/
│   ├── components/        # React components
│   │   ├── ScenarioSelector.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── TriagePanel.tsx
│   │   ├── FeedbackModal.tsx
│   │   ├── SessionHistory.tsx
│   │   └── SessionReview.tsx
│   ├── services/
│   │   └── api.ts         # API client
│   ├── scenarios.ts       # Medical scenarios
│   ├── types.ts          # TypeScript types
│   └── App.tsx           # Main app component
└── README.md
```


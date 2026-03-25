# Triage Training Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add your actual API key
```

3. Run the server:
```bash
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

### POST /api/chat
Send chat messages and get AI responses.

Request body:
```json
{
  "messages": [
    {"role": "system", "content": "You are a nurse..."},
    {"role": "user", "content": "What are the patient's vital signs?"}
  ]
}
```

Response:
```json
{
  "response": "The patient's blood pressure is..."
}
```

### GET /api/health
Health check endpoint.

## Integrating Your Existing Code

Replace the OpenAI call in `app.py` (line 29-35) with your existing Python code. The endpoint expects to receive an array of messages and should return the AI's response as a string.

# Asfaan Portfolio

React/Vite portfolio integrated with the Python portfolio chatbot in `ChatBot/ChatBot/app.py`.

## Run locally

Install frontend dependencies:

```bash
npm install
```

Install chatbot dependencies:

```bash
py -m pip install -r ChatBot/ChatBot/requirements.txt
```

Start the Python chatbot API:

```bash
npm run chatbot
```

In a second terminal, start the portfolio:

```bash
npm run dev
```

Open `http://localhost:8080`. The portfolio chat sends messages to the Python API at `/api/chat`; if the API is not running, it falls back to the built-in TypeScript responses.

## Optional Groq LLM

The chatbot can optionally use Groq from the Python backend. Keep keys out of React code.

PowerShell:

```powershell
$env:GROQ_API_KEY="your_groq_key"
$env:GROQ_MODEL="openai/gpt-oss-20b"
npm run chatbot
```

Flow:

```text
React chat -> Python Flask API -> local portfolio retrieval -> Groq -> local answer
```

If Groq is not configured, rate-limited, or fails, the Python API returns the local chatbot answer. If the Python API is not running at all, the frontend falls back to its built-in responses.

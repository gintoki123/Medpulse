<div align="center">

<img src="assets/medipulse-icon.png" alt="MediPulse logo" width="96" />

# MediPulse 2.0

**An AI healthcare companion in the browser, with voice interaction**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![LLM API](https://img.shields.io/badge/LLM-OpenRouter_API-6E56CF?style=flat-square)
![Status](https://img.shields.io/badge/status-graduation_project-0A7E8C?style=flat-square)

</div>

---

## Overview

MediPulse answers health questions in plain language, explains symptoms, and bundles everyday wellness tools in one clean interface. It talks back to the user with text-to-speech, supports more than one language, and keeps all personal data in the browser (no backend, no database).

Built as a graduation project for the **Software Engineering Department, Near East University**.

## Features

| Area | What it does |
|---|---|
| **AI health chat** | Health Q&A through a large language model, with built-in medical disclaimers |
| **Voice** | Speak your question (speech recognition) and hear the answer (text-to-speech) |
| **Symptom checker** | Pick symptoms, get possible conditions and next-step recommendations |
| **First aid** | Step-by-step guides: CPR, choking, burns, fractures, stroke, heart attack, and more |
| **Trackers** | Water intake, sleep, mood, habits, vital signs, pain, medication |
| **Calculators & tools** | BMI, nutrition, drug interaction info, medical terms, exercise, meditation, breathing |
| **Export** | Save a conversation as a PDF |
| **Personalization** | Dark mode, font size, sound toggle, multi-language interface |
| **Privacy** | Chat history and settings are stored only in the browser's local storage |

## Tech stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6+)
- **AI:** OpenRouter chat-completions API (OpenAI-compatible)
- **Browser APIs:** Web Speech (recognition + synthesis), Local Storage

## Getting started

```bash
git clone https://github.com/gintoki123/Medpulse.git
cd Medpulse
```

**1. Add your API key** (the app needs it for the chat):

```bash
cp js/config.example.js js/config.js
```

Open `js/config.js` and paste your own key from [openrouter.ai/keys](https://openrouter.ai/keys).
`js/config.js` is git-ignored, so the key stays on your machine.

**2. Run a local server** (needed for the API calls):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The VS Code *Live Server* extension works too.

## Project structure

```
Medpulse/
├── index.html                # App shell and all tool modals
├── css/style.css             # Styles, light and dark themes
├── js/
│   ├── script.js             # Chat logic, tools and API calls
│   ├── api_optimizations.js  # Prompt tuning (concise mode, formatting)
│   ├── text_to_speech.js     # Voice output
│   ├── pdf_export.js         # Export chat to PDF
│   ├── language_support.js   # Interface translations
│   └── config.example.js     # API key template (copy to config.js)
└── assets/                   # Icons
```

## Disclaimer

MediPulse provides general health information for educational purposes only. It is **not** a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified healthcare provider.

## Author

**Bilal Boulaalam** · [GitHub](https://github.com/gintoki123)

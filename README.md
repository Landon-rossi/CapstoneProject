# 🌌 Solar Wind AI Prediction System

**Capstone Project — January 2025**  
**Advisor:** Dr. Henry Han  
**Team Members:**  
• Brad Buckingham  
• Kyle Hoang  
• Grayson Odajima  
• Landon Rossi  
• Zhongbo Sun

**Team Goal:** To educate the public and empower researchers with AI tools for understanding solar wind types and their effects on Earth.

---

## 🚀 Overview

This project represents a collaborative, interdisciplinary effort to bridge space weather research with artificial intelligence and educational outreach. In addition to its public-facing web tools, it reflects a research-informed approach grounded in solar wind classification techniques and machine learning modeling. The overall design also emphasizes modularity and extensibility for potential future applications, including real-time forecasting and classroom integration.


Solar winds can cause major disruptions to Earth's communication systems, satellite operations, and power infrastructure. This web app serves a dual purpose:

1. **Public Education:** Teach users about solar wind phenomena through an engaging, interactive frontend.
2. **Research Tool:** Let users run our AI model to predict and classify solar wind types using real-world data.

---

## 🛠️ Developer and Architecture Notes

### 🧱 Project Setup
To run the frontend locally:
```bash
cd frontend
npm install
npm run dev
```
To run the backend locally:
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
This launches the development server at `http://localhost:3000` with hot reload support.

### 🗂️ File Structure Overview
```plaintext
frontend/
├── app/
│   ├── page.tsx                 # Home Page
│   ├── learn-more/              # Educational content
│   ├── minigame/                # Game interface
│   ├── components/              # Shared React components
│   ├── models/                  # Python model logic (stub)
│   └── pages/contact/           # Team contact page
├── public/                      # Static assets and team images
├── styles/                      # Global stylesheets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Project dependencies
```
```plaintext
backend/
├── .venv/                        # Python virtual environment
├── app.py                        # Gradio interface and model api
├── minmaxtrainset.csv            # Min/Max model data
├── model_runner.py               # Min/Max and Power Transformer Models
├── pwrtrantrainset.csv           # Power Transformer model data
├── requirements.txt              # Python dependencies
└── SO_ML_2022Jan_to_2023Apr.csv  # Solar Wind data
```
The project is structured around distinct functional domains—education, AI interaction, and simulation—each implemented as a self-contained module. This modular architecture supports easy future upgrades, including integration with real-time APIs and more advanced AI pipelines.

For model behavior, a Python virtual environment backend runs the model.

Development followed a version-controlled, milestone-based schedule. Each sprint introduced key functionality such as the layout, game logic, and model interface, enabling iterative refinement and consistent feature delivery.

Our team coordinated development using Git-based version control and a milestone-driven sprint schedule. Key phases included frontend structure setup, minigame integration, mock model behavior, and interactive content creation.



---

## 🌍 Features

### 🏠 Home Page
- **Hero Section:** Introduces the project mission.
- **Call to Action:** Buttons to explore learning resources and test the AI model.
- **Visual Appeal:** Smooth gradient background and responsive design with TailwindCSS.

### 📚 Learn More Page
- **Purpose:** Educate users on key concepts related to solar wind.
- **Subsections:**
  - **Solar Wind Explained:** What solar winds are and their origin.
  - **Solar Wind Effects:** How they impact Earth's systems.
  - **AI + Space Weather:** How machine learning is used to forecast solar wind regimes.
- Uses markdown-style content and internal navigation for structured learning.

### 🤖 Try Model Page (`SolarWindAI.tsx`)
- Allows users to interact with a **dummy AI model interface**.
- Prompts users to input solar wind parameters (to be connected to backend model later).
- Displays predicted type: *Fast*, *Slow*, or *CME/Transient*.

### 🎮 Minigame Page
- **Goal:** Engage the public (especially students) through an educational game.
- **Game Flow:**
  - User completes levels of a wave-based minigame where each level reveals dialogue about solar wind.
  - Dialogue must be completed before continuing to the next wave.
- **Components:**
  - `Game.tsx`: Game logic
  - `GameRender.tsx`: Canvas rendering system
  - `ScientistDialogue.tsx`: Narratives and learning dialogue between levels
- **Educational Purpose:** Reinforce learning in a fun, gamified environment.

### 📨 Contact Page
- Displays profiles of all team members with photos, roles, emails, and contribution descriptions.
- Serves as an introduction to the development team for professors, users, and collaborators.


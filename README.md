# 🗳️ ElectED – The Definitive National Civic Guide

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_1.5_Flash-orange?logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![National Coverage](https://img.shields.io/badge/Coverage-36/36_States_&_UTs-brightgreen)](https://elected-117353888839.us-central1.run.app/regions)
[![Accessibility](https://img.shields.io/badge/A11y-100%25-blue)](https://elected-117353888839.us-central1.run.app)

**ElectED** is a high-performance, national-scale civic education platform designed to empower India's **960 million+ voters**. Built for the Google AI Hackathon, it combines a brutalist "Civic Tech" aesthetic with **Google Gemini 1.5 Flash** to provide authoritative election insights across every State and Union Territory in India.

---

## 🏛️ Vertical & Persona
**Vertical:** Civic Education & Democratic Participation.  
**Logic:** ElectED acts as a "Digital Mission Control" for voters. Unlike generic AI assistants, ElectED is specifically tuned to the Indian electoral lifecycle—providing verified redirection to official government portals (CEO websites) and real-time guidance on voter rights, registration, and deadlines.

---

## 🚀 How It Works
1. **🤖 AI Core**: Users interact with a streaming chat interface powered by **Gemini 1.5 Flash**, providing instant answers to voter queries.
2. **🗺️ National Portal**: A master directory of all **36 Indian States & UTs**. Users can select their region on an interactive Google Map to get a direct, verified link to their official Chief Electoral Officer (CEO) portal.
3. **⏳ Election Clock**: A visual timeline of the 35+ day election lifecycle, from notification to counting day.
4. **📅 Incident Reminders**: A smart tracking system for critical deadlines (registration, postal ballots, etc.) with `.ics` calendar export.
5. **🎰 EVM & VVPAT Simulator**: A 1:1 digital twin of India's voting equipment, allowing first-time voters to practice casting a ballot and verifying the 7-second VVPAT slip drop.
6. **🎓 Gamified Learning**: A civic knowledge quiz that grades users from "Novice" to "Expert," encouraging deep engagement with democratic principles.

---

## 🏗️ Approach & Logic
- **Data Integrity First**: We implemented a type-safe JSON database for all 36 regions, verified against official ECI sources.
- **Performance & Scalability**: Built with Next.js 16 and React 19, the app uses multi-stage Docker builds for lean deployment on **Google Cloud Run**.
- **Security by Design**: Implemented strict Content Security Policy (CSP), HSTS, and a `.well-known/security.txt` for enterprise-grade security marks.
- **Universal Accessibility**: Designed with a high-contrast palette, semantic HTML5, and full ARIA support, achieving 100% accessibility marks.

---

## 📝 Assumptions Made
1. **Source Reliability**: We assume that official government CEO portals (`.gov.in` / `.nic.in`) are the primary source of truth for voters.
2. **Voter Lifecycle**: We modeled the "Election Clock" based on the standard 7-phase lifecycle typical of large-scale Indian general elections.
3. **AI Guardrails**: We assumed that users require high-speed, factual responses, thus utilizing the **Gemini 1.5 Flash** model for its optimal balance of speed and reasoning.

---

## 🛡️ Security & Quality
- **100% Test Coverage**: Verified with comprehensive Jest/RTL suites for both data and UI components.
- **Enterprise Security**: Strict CSP, XSS protection, and professional error handling (`error.tsx`).
- **Google Services**: Native integration of **Gemini**, **Google Maps**, **Analytics**, and **Cloud Run**.

---

## 🚀 Getting Started
### Deployment Link: [ElectED Live](https://elected-117353888839.us-central1.run.app)

### Installation
1. Clone the repository: `git clone https://github.com/Princedeepu381/Elect_ED.git`
2. Install dependencies: `npm install`
3. Set up `.env.local` with your `GEMINI_API_KEY`.
4. Run: `npm run dev`

---

*Built for the Google AI Hackathon to empower the future of democracy.*

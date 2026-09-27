# Haq Charkha (حق چرخہ / حق څرخ) 🎡

> **Empowering Home-Based Artisans and Craftswomen Across Khyber Pakhtunkhwa with Transparent, Fair-Wage Calculations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built for](https://img.shields.io/badge/Built%20for-Imaginathon%202026-blue)](https://www.banao.pk/imaginathon/)
[![Location](https://img.shields.io/badge/Focus%20Region-Mingora%20%26%20KP-green)](#)

---

## 📌 Overview

**Haq Charkha** is an offline-first, audio-guided digital tool engineered to eliminate middleman exploitation of female home-based artisans in Mingora, Swat, and across Khyber Pakhtunkhwa. 

Due to literacy barriers and opaque market practices, artisans often receive arbitrary piece-rate wages that fall below living standards. **Haq Charkha** standardizes price calculations by factoring in material costs, daily labor duration, and stitch complexity—converting them into visual currency breakdowns and clear regional audio guidance in **Urdu** and **Pashto**.

---

## ✨ Key Features

* 🧮 **Fair-Wage Calculation Engine:** Input raw material ownership (silk, cotton, customer-provided), total days worked, and stitch complexity (e.g., *Phulkari*, heavy embroidery, fine bridal work) to generate an equitable price recommendation.
* 🎙️ **Voice & Audio Assistant (Pashto & Urdu):** Fully accessible spoken feedback designed for low-literacy users to navigate the app and understand wage breakdowns without reading text.
* 💵 **Visual Currency Counter (`تصویری موڈ`):** Displays exact physical banknote breakdowns (State Bank of Pakistan notes) to help non-literate artisans independently verify payouts when negotiating with buyers/middlemen.
* ⚡ **Offline-First & Localized Design:** Designed for low-bandwidth environments with cultural UI cues, regional terminology, and rapid local rendering.

---

## 🛠️ Tech Stack

* **Frontend Framework:** [React](https://react.dev/) / [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling & Icons:** [Tailwind CSS](https://tailwindcss.com/) & Lucide Icons
* **AI & Audio Integration:** Google Gemini API / Web Speech Capabilities
* **Target Environment:** Web & Mobile Responsive UI

---

## 🚀 Getting Started Locally

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` or `yarn`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AimenSaeed/HaqCharkha.git](https://github.com/AimenSaeed/HaqCharkha.git)
   cd HaqCharkha
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory and add your API key:

Code snippet
VITE_GEMINI_API_KEY=your_gemini_api_key_here
Start the development server:

Bash
npm run dev
Open http://localhost:5173 (or the port specified in your console) to view the app.

📂 Project Structure
Plaintext
HaqCharkha/
├── src/
│   ├── components/     # UI modules (Calculator, Visual Cash Mode, Audio Guide)
│   ├── assets/         # Audio clips, visual banknote assets, and icons
│   ├── utils/          # Rate calculation algorithms & speech synthesis helpers
│   ├── App.tsx         # Main application view
│   └── main.tsx        # Application entry point
├── metadata.json       # Application metadata
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
⚖️ Social Impact & Goal
Economic Justice: Guarantees transparent piece-rate wage calculation, shifting pricing power back to home-based craftswomen.

Inclusion: Bridges digital and financial literacy gaps through localized audio navigation in Pashto and Urdu alongside visual currency helpers.

Community Driven: Focused on real-world economic conditions in Swat, Islampur, and broader KP handicraft clusters.

📄 License
Distributed under the MIT License. See LICENSE for details.

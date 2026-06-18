# ContextAI ⚡

> **ContextAI is an AI messaging assistant that lets you translate, fact-check, and decode slang in real-time, right inside your chat interface for smarter, boundary-free communication.**

---

## 💡 Inspiration

Modern digital communication is faster than ever, but it is also filled with barriers. From language divides and generational Gen-Z slangs to fake news and grammatical slips, conversations can easily lead to misunderstandings. 

People constantly switch between their chat apps, translation tools, web search engines, and grammar checkers just to send a clear message. We wanted to eliminate this friction by building an all-in-one, context-aware companion that sits right inside the chat window.

---

## 🚀 What It Does

ContextAI is an AI-powered communication layer that integrates Google Gemini directly into messaging. Key features include:

*   **⚡ Direct Message Actions:** Single-click any message to instantly:
    *   **🌐 Translate:** Translate to/from Hindustani (Hinglish), Hindi, Marathi, Spanish, French, German, or English.
    *   **✅ Fact-Check:** Instantly verify claims in real-time to combat misinformation.
    *   **💡 Explain:** Get quick explanations for complex concepts or topics.
*   **🔍 Slang Decoder:** Unpacks modern internet and Gen-Z slang on the fly, showing meaning, cultural context, and intensity levels.
*   **🖱️ Smart Selection Toolbar:** Highlight any text inside a message to trigger on-demand translations or definitions.
*   **🤖 Writing Assistant:** Refines draft messages before sending (options to fix grammar, change tone to formal, shorten, or translate directly).

---

## 🛠️ How We Built It

ContextAI is designed with a lightweight, secure architecture:

```
┌────────────────────────────────────────────────────────┐
│                      FRONTEND                          │
│  [JSP / HTML5] ──► [CSS3 Glassmorphism] ──► [JS UX]    │
└───────────────────────────┬────────────────────────────┘
                            │ (JSON Fetch API)
                            ▼
┌────────────────────────────────────────────────────────┐
│                      BACKEND                           │
│  [Java Servlets (Jakarta EE)] ◄──► [GeminiUtil API]    │
└───────────────────────────┬────────────────────────────┘
                            │ (Secure Env Creds)
                            ▼
┌────────────────────────────────────────────────────────┐
│                     AI ENGINE                          │
│               [Google Gemini 2.5 Flash]                │
└────────────────────────────────────────────────────────┘
```

*   **Backend:** Developed using **Java (Jakarta EE / Servlets)** to process API requests and handle business logic.
*   **Frontend:** Built with **Vanilla HTML/JSP, CSS (featuring a modern, glassmorphism design system)**, and **JavaScript** for responsive click behaviors, selection handlers, and state management.
*   **AI Engine:** Powered by the **Google Gemini API** (using the `gemini-2.5-flash` model for high-speed, low-latency contextual processing).
*   **Configuration:** Configured secure, environment-variable-based credential loading (`System.getenv("GEMINI_API_KEY")`) to ensure API keys are never leaked in source control.

---

## 🚧 Challenges We Ran Into

*   **Structured Outputs:** Getting consistent JSON responses from the AI for features like the Slang Decoder. We solved this by drafting highly strict system prompts and implementing client-side JSON parsing sanitizers.
*   **Multi-lingual Dialects:** Handling regional dialects like *Hinglish* (Hindi + English) naturally without producing robotic, literal translations. We resolved this through iterative prompt engineering to make the AI output conversationally natural phrases.
*   **Linguistic File Locks:** Encountered OS-level file locking issues during development while recompiling servlet files, which we solved by setting up a clean build-and-run pipeline.

---

## 🎉 Accomplishments That We're Proud Of

*   **Aesthetic & Seamless UI:** Created a vibrant, premium dark-mode interface with glassmorphism effects and smooth micro-interactions that feels alive.
*   **Intuitive UX:** Successfully replaced slow long-press mechanics with lightning-fast single-click action popups and dynamic text-selection toolbars.
*   **Secure Architecture:** Fully decoupled the API keys using standard environment-based injection.

---

## 📚 What We Learned

*   **Mode-Aware Prompt Engineering:** How to design prompt instructions for an LLM to switch fluidly between translation, sentiment analysis, fact-checking, and slang decoding.
*   **Context Management:** Managing state and histories in client-side applications to pass relevant conversational context to API request bodies.

---

## 🔮 What's Next for Context-AI

*   **Browser/App Extension:** Porting ContextAI into a Chrome Extension to overlay it seamlessly on popular web apps like WhatsApp Web, Slack, and Discord.
*   **Style Adaptability (Voice-to-Text):** Allowing users to speak or write a paragraph and training the AI model dynamically to match their exact vocabulary and phrasing style.
*   **Offline Fallback:** Integrating lighter, local models (like WebGPU-based LLMs) to run basic translations and grammar checks offline when an internet connection is unavailable.
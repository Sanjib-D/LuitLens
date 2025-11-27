# LuitLens 📸

**LuitLens** is a modern, lightweight image analysis tool. It **uses advanced AI technology** to identify objects, analyze scenes, and provide detailed descriptions of any uploaded image in real-time.

Featuring a dynamic **Theme Engine**, users can instantly switch between cultural, professional, and trendy visual styles.

##  Live Demo - 
[Click Here to Launch LuitLens](https://sanjib-d.github.io/LuitLens/)

---

## ✨ Key Features

* **Multi-Theme Interface:** 5 distinct visual styles (Cultural, Cyberpunk, Trendy, Dark, Professional).
* **Smart Recognition:** Identifies complex objects and scenes with high accuracy.
* **Multi-Language Support:** Instantly translate analysis results between **English**, **Hindi**, and **Assamese**.
* **Instant Analysis:** No login required—drag, drop, and get insights immediately.
* **Lightweight:** Built with **Vanilla JavaScript** and **Tailwind CSS**—no heavy frameworks.

## 🎨 Available Themes

* **Red River** (Default)
* **Neon Glitch**
* **Gen Z Pop**
* **Muga Night**
* **Classic**

---

## 🛠️ Technology Stack

This project was built using the following technologies:

| Category | Tech Used |
| :--- | :--- |
| **Frontend Language** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Styling Framework** | Tailwind CSS (Utility-first) |
| **AI Model** | Google Gemini API (Gemini 1.5 Flash) |
| **Backend / Serverless** | Cloudflare Workers |
| **Icons** | Lucide Icons |
| **Hosting** | GitHub Pages |

---

## 📂 Project Structure
```
LuitLens/
  │
  ├── index.html      # Main user interface and layout 
  ├── style.css       # Custom CSS variables for themes and animations 
  ├── script.js       # Core logic for UI handling and API calls 
  ├── worker.js       # Cloudflare Worker code (Backend proxy for Gemini API) 
  └── README.md       # Project documentation
```
----

## ℹ️ Note from the Author

### Cultural Context
While LuitLens functions as a general-purpose image recognizer, this specific deployment is effectively **biased towards Assamese Culture**. The system prompt has been fine-tuned to prioritize the detection of regional elements (such as *Japi*, *Gamosa*, *Bihu*, and local wildlife) when present in an image.

---

### Author
**Sanjib Das**  
GitHub: [@Sanjib-D](https://github.com/Sanjib-D)

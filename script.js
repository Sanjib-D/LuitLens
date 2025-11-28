// --- CONFIGURATION ---
const WORKER_URL = "https://vision-ai-backend.learn-sanjib.workers.dev/";

// --- STATE & DOM ---
let currentImageBase64 = null;
let analysisResults = {};
let currentLanguage = "English";

const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const previewContainer = document.getElementById('image-preview-container');
const previewImage = document.getElementById('image-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const identifyBtn = document.getElementById('identify-btn');
const errorDiv = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const uploadView = document.getElementById('upload-view');
const loadingView = document.getElementById('loading-view');
const resultsView = document.getElementById('results-view');
const resultImage = document.getElementById('result-image');
const resultTitle = document.getElementById('result-title');
const resultBody = document.getElementById('result-body');
const currentLangLabel = document.getElementById('current-lang-label');
const themeSelect = document.getElementById('theme-select');

lucide.createIcons();

// --- THEME LOGIC ---
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('luitlens-theme', themeName);
    if (themeSelect) themeSelect.value = themeName;
}

// Load saved theme on startup - DEFAULT is 'river'
const savedTheme = localStorage.getItem('luitlens-theme') || 'river';
setTheme(savedTheme);

// --- EVENT LISTENERS ---
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-[var(--primary)]', 'bg-[var(--bg-main)]');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-[var(--primary)]', 'bg-[var(--bg-main)]');
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-[var(--primary)]', 'bg-[var(--bg-main)]');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
    else showError("Please drop a valid image file.");
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) processFile(file);
}

function processFile(file) {
    showError(null);
    const reader = new FileReader();
    reader.onload = function (e) {
        currentImageBase64 = e.target.result.split(',')[1];
        previewImage.src = e.target.result;
        uploadPlaceholder.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        dropZone.classList.add('border-[var(--primary)]', 'bg-[var(--bg-main)]');

        identifyBtn.disabled = false;
        identifyBtn.classList.remove('bg-[var(--bg-main)]', 'text-[var(--text-sub)]', 'cursor-not-allowed');
        identifyBtn.classList.add('btn-active');
    }
    reader.readAsDataURL(file);
}

// --- MAIN LOGIC ---
async function identifyImage() {
    if (!currentImageBase64) return;

    if (WORKER_URL.includes("YOUR_CLOUDFLARE")) {
        showError("Setup Error: Backend URL not configured.");
        return;
    }

    uploadView.classList.add('hidden');
    loadingView.classList.remove('hidden');

   // --- UPDATED PROMPT LOGIC ---
    const prompt = `Analyze this image and determine if it is related to Assamese culture (Assam, India).

    LOGIC FLOW:
    1. CHECK: Does the image contain specific Assamese elements (e.g.,Assamese people, Assamese Celebrity, Zubeen Garg, Gamosa, Japi, Mekhela Sador, Xorai, Bihu dance, Assam Tea Gardens, One-horned Rhino, Brahmaputra, assam)?
    
    2. IF YES (Assamese Elements Detected):
       - Identify the object clearly.
       - Explain its cultural significance in depth.
    
    3. IF NO (No Assamese Elements Detected):
       - Describe the image normally and accurately.
       - CRITICAL: Do NOT mention Assamese culture, or the fact that the image lacks these elements. Just describe what you see naturally.

    OUTPUT FORMAT:
    Return a STRICT JSON object with keys "English", "Hindi", and "Assamese".
    Each key must contain: { "title": "Short Title", "body": "Detailed description" }
    Do not use markdown. Return only JSON string.`;

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: "image/png", data: currentImageBase64 } }
                    ]
                }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            analysisResults = JSON.parse(text);
            showResults();
        } else {
            throw new Error("No description generated.");
        }

    } catch (err) {
        console.error(err);
        loadingView.classList.add('hidden');
        uploadView.classList.remove('hidden');
        showError(err.message || "Failed to identify image.");
    }
}

function showResults() {
    loadingView.classList.add('hidden');
    resultsView.classList.remove('hidden');
    resultImage.src = previewImage.src;
    renderText();
}

function renderText() {
    const data = analysisResults[currentLanguage];
    if (data) {
        resultTitle.innerText = data.title;
        resultBody.innerText = data.body;
        currentLangLabel.innerText = currentLanguage;
    }
}

function switchLanguage(lang) {
    currentLanguage = lang;
    ['English', 'Hindi', 'Assamese'].forEach(l => {
        const btn = document.getElementById(`btn-${l}`);
        if (l === lang) {
            btn.classList.add('btn-active');
            btn.classList.remove('text-[var(--text-sub)]');
        } else {
            btn.classList.remove('btn-active');
            btn.classList.add('text-[var(--text-sub)]');
        }
    });
    if (Object.keys(analysisResults).length > 0) renderText();
}

function resetApp() {
    currentImageBase64 = null;
    analysisResults = {};
    fileInput.value = '';
    uploadPlaceholder.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    previewImage.src = '';

    identifyBtn.disabled = true;
    identifyBtn.classList.remove('btn-active');
    identifyBtn.classList.add('bg-[var(--bg-main)]', 'text-[var(--text-sub)]', 'cursor-not-allowed');

    resultsView.classList.add('hidden');
    loadingView.classList.add('hidden');
    uploadView.classList.remove('hidden');
    showError(null);
}

function showError(msg) {
    if (msg) {
        errorDiv.classList.remove('hidden');
        errorText.innerText = msg;
    } else {
        errorDiv.classList.add('hidden');
    }

}



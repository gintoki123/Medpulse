// MediPulse - Text-to-Speech Functionality

// --- Global Variables ---
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isSpeaking = false;
let isPaused = false;
let voiceOptions = [];
let selectedVoice = null;

// --- TTS Core Functions ---
function initializeTextToSpeech() {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
        console.error("This browser does not support text-to-speech.");
        return false;
    }
    
    // Load available voices
    loadVoices();
    
    // Some browsers (like Chrome) load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Set default preference if not already set
    if (localStorage.getItem("medipulse_tts_enabled") === null) {
        localStorage.setItem("medipulse_tts_enabled", "true");
    }
    
    // Add TTS settings to settings modal
    addTTSSettings();
    
    // Add TTS controls to chat interface
    addTTSControls();
    
    console.log("Text-to-speech functionality initialized");
    return true;
}

function loadVoices() {
    voiceOptions = speechSynthesis.getVoices();
    
    // Set default voice (prefer English voices)
    if (voiceOptions.length > 0) {
        // Try to find an English voice
        const englishVoice = voiceOptions.find(voice => 
            voice.lang.startsWith('en-') && !voice.name.includes('Google')
        ) || voiceOptions.find(voice => 
            voice.lang.startsWith('en-')
        );
        
        selectedVoice = englishVoice || voiceOptions[0];
        
        // Save selected voice name to localStorage
        localStorage.setItem("medipulse_tts_voice", selectedVoice.name);
    }
    
    // Update voice selection dropdown if it exists
    const voiceSelect = document.getElementById("tts-voice-select");
    if (voiceSelect) {
        populateVoiceList(voiceSelect);
    }
}

function populateVoiceList(selectElement) {
    // Clear existing options
    selectElement.innerHTML = "";
    
    // Add available voices
    voiceOptions.forEach((voice, index) => {
        const option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute("data-voice-index", index);
        
        // Set selected voice
        if (voice.name === localStorage.getItem("medipulse_tts_voice")) {
            option.selected = true;
            selectedVoice = voice;
        }
        
        selectElement.appendChild(option);
    });
}

function speakText(text) {
    // Check if TTS is enabled
    if (localStorage.getItem("medipulse_tts_enabled") !== "true") {
        return;
    }
    
    // Cancel any ongoing speech
    stopSpeaking();
    
    // Clean up text for speaking (remove HTML tags and normalize whitespace)
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set voice if available
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Set other properties
    utterance.rate = parseFloat(localStorage.getItem("medipulse_tts_rate") || "1");
    utterance.pitch = parseFloat(localStorage.getItem("medipulse_tts_pitch") || "1");
    utterance.volume = parseFloat(localStorage.getItem("medipulse_tts_volume") || "1");
    
    // Set event handlers
    utterance.onstart = () => {
        isSpeaking = true;
        isPaused = false;
        updateTTSControlState();
    };
    
    utterance.onend = () => {
        isSpeaking = false;
        isPaused = false;
        currentUtterance = null;
        updateTTSControlState();
    };
    
    utterance.onerror = (event) => {
        console.error("TTS Error:", event);
        isSpeaking = false;
        isPaused = false;
        currentUtterance = null;
        updateTTSControlState();
    };
    
    // Store reference to current utterance
    currentUtterance = utterance;
    
    // Start speaking
    speechSynthesis.speak(utterance);
    
    // Update controls
    updateTTSControlState();
}

function pauseSpeaking() {
    if (isSpeaking && !isPaused) {
        speechSynthesis.pause();
        isPaused = true;
        updateTTSControlState();
    }
}

function resumeSpeaking() {
    if (isSpeaking && isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        updateTTSControlState();
    }
}

function stopSpeaking() {
    speechSynthesis.cancel();
    isSpeaking = false;
    isPaused = false;
    currentUtterance = null;
    updateTTSControlState();
}

// --- UI Integration ---
function addTTSControls() {
    // Create TTS control container
    const ttsControls = document.createElement("div");
    ttsControls.id = "tts-controls";
    ttsControls.className = "tts-controls";
    ttsControls.innerHTML = `
        <button id="tts-play" title="Play" class="tts-btn">
            <i class="fas fa-play"></i>
        </button>
        <button id="tts-pause" title="Pause" class="tts-btn" disabled>
            <i class="fas fa-pause"></i>
        </button>
        <button id="tts-stop" title="Stop" class="tts-btn" disabled>
            <i class="fas fa-stop"></i>
        </button>
    `;
    
    // Add to chat container
    const chatContainer = document.querySelector(".chat-container");
    const inputArea = document.querySelector(".input-area");
    chatContainer.insertBefore(ttsControls, inputArea);
    
    // Add event listeners
    document.getElementById("tts-play").addEventListener("click", () => {
        // If paused, resume
        if (isSpeaking && isPaused) {
            resumeSpeaking();
        } 
        // If not speaking, speak the last message
        else if (!isSpeaking) {
            const lastMessage = chatHistory.filter(msg => msg.sender === "MediPulse").pop();
            if (lastMessage) {
                speakText(lastMessage.message);
            }
        }
        playSound("click");
    });
    
    document.getElementById("tts-pause").addEventListener("click", () => {
        pauseSpeaking();
        playSound("click");
    });
    
    document.getElementById("tts-stop").addEventListener("click", () => {
        stopSpeaking();
        playSound("click");
    });
    
    // Add CSS for TTS controls
    const style = document.createElement("style");
    style.textContent = `
        .tts-controls {
            display: flex;
            justify-content: center;
            margin: 10px 0;
            gap: 10px;
        }
        
        .tts-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .tts-btn:hover {
            background: var(--primary-color-dark);
        }
        
        .tts-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .dark-mode .tts-btn:disabled {
            background: #555;
        }
    `;
    document.head.appendChild(style);
}

function updateTTSControlState() {
    const playBtn = document.getElementById("tts-play");
    const pauseBtn = document.getElementById("tts-pause");
    const stopBtn = document.getElementById("tts-stop");
    
    if (!playBtn || !pauseBtn || !stopBtn) return;
    
    if (isSpeaking) {
        if (isPaused) {
            playBtn.disabled = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            pauseBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
        }
    } else {
        playBtn.disabled = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    }
}

function addTTSSettings() {
    // Add to settings modal
    const settingsContent = document.querySelector("#settings-modal .modal-content");
    
    const ttsSettingsDiv = document.createElement("div");
    ttsSettingsDiv.className = "settings-group";
    ttsSettingsDiv.innerHTML = `
        <h3>Text-to-Speech</h3>
        <div class="toggle-container">
            <label class="toggle">
                <input type="checkbox" id="tts-enabled-toggle">
                <span class="toggle-slider"></span>
            </label>
            <span>Enable voice readout</span>
        </div>
        
        <div class="form-group">
            <label for="tts-voice-select">Voice</label>
            <select id="tts-voice-select" class="form-select"></select>
        </div>
        
        <div class="form-group">
            <label for="tts-rate">Speed</label>
            <div class="range-container">
                <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1">
                <span id="tts-rate-value">1.0</span>
            </div>
        </div>
        
        <div class="form-group">
            <label for="tts-pitch">Pitch</label>
            <div class="range-container">
                <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1">
                <span id="tts-pitch-value">1.0</span>
            </div>
        </div>
        
        <div class="form-group">
            <label for="tts-volume">Volume</label>
            <div class="range-container">
                <input type="range" id="tts-volume" min="0" max="1" step="0.1" value="1">
                <span id="tts-volume-value">1.0</span>
            </div>
        </div>
        
        <button id="tts-test" class="secondary-btn">Test Voice</button>
    `;
    
    // Insert before the last button
    const lastButton = settingsContent.querySelector(".form-submit");
    settingsContent.insertBefore(ttsSettingsDiv, lastButton);
    
    // Initialize voice selection dropdown
    const voiceSelect = document.getElementById("tts-voice-select");
    populateVoiceList(voiceSelect);
    
    // Initialize toggle state
    const ttsToggle = document.getElementById("tts-enabled-toggle");
    ttsToggle.checked = localStorage.getItem("medipulse_tts_enabled") === "true";
    
    // Initialize slider values
    document.getElementById("tts-rate").value = localStorage.getItem("medipulse_tts_rate") || "1";
    document.getElementById("tts-rate-value").textContent = localStorage.getItem("medipulse_tts_rate") || "1.0";
    
    document.getElementById("tts-pitch").value = localStorage.getItem("medipulse_tts_pitch") || "1";
    document.getElementById("tts-pitch-value").textContent = localStorage.getItem("medipulse_tts_pitch") || "1.0";
    
    document.getElementById("tts-volume").value = localStorage.getItem("medipulse_tts_volume") || "1";
    document.getElementById("tts-volume-value").textContent = localStorage.getItem("medipulse_tts_volume") || "1.0";
    
    // Add event listeners
    ttsToggle.addEventListener("change", (e) => {
        localStorage.setItem("medipulse_tts_enabled", e.target.checked);
        playSound("click");
    });
    
    voiceSelect.addEventListener("change", (e) => {
        const selectedIndex = e.target.options[e.target.selectedIndex].getAttribute("data-voice-index");
        selectedVoice = voiceOptions[selectedIndex];
        localStorage.setItem("medipulse_tts_voice", selectedVoice.name);
        playSound("click");
    });
    
    document.getElementById("tts-rate").addEventListener("input", (e) => {
        const value = e.target.value;
        document.getElementById("tts-rate-value").textContent = value;
        localStorage.setItem("medipulse_tts_rate", value);
    });
    
    document.getElementById("tts-pitch").addEventListener("input", (e) => {
        const value = e.target.value;
        document.getElementById("tts-pitch-value").textContent = value;
        localStorage.setItem("medipulse_tts_pitch", value);
    });
    
    document.getElementById("tts-volume").addEventListener("input", (e) => {
        const value = e.target.value;
        document.getElementById("tts-volume-value").textContent = value;
        localStorage.setItem("medipulse_tts_volume", value);
    });
    
    document.getElementById("tts-test").addEventListener("click", () => {
        speakText("This is a test of the MediPulse text-to-speech system. You can adjust the voice, speed, pitch, and volume in settings.");
        playSound("click");
    });
    
    // Add CSS for TTS settings
    const style = document.createElement("style");
    style.textContent = `
        .range-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .range-container input[type="range"] {
            flex: 1;
        }
        
        .range-container span {
            min-width: 30px;
            text-align: right;
        }
        
        .secondary-btn {
            background: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.2s ease;
        }
        
        .secondary-btn:hover {
            background: var(--secondary-color-dark);
        }
    `;
    document.head.appendChild(style);
}

// --- Integration with Chat System ---
// Modify the addMessageToChat function to include TTS
function enhanceMessageWithTTS(originalFunction) {
    return function(sender, message, className) {
        // Call the original function
        originalFunction(sender, message, className);
        
        // If the message is from MediPulse and TTS is enabled, speak it
        if (sender === "MediPulse" && localStorage.getItem("medipulse_tts_enabled") === "true") {
            speakText(message);
        }
    };
}

// Initialize TTS when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializeTextToSpeech();
    
    // Enhance the addMessageToChat function with TTS capability
    if (window.addMessageToChat) {
        const originalAddMessageToChat = window.addMessageToChat;
        window.addMessageToChat = enhanceMessageWithTTS(originalAddMessageToChat);
    }
    
    // Also enhance the addEnhancedMessageToChat function if it exists
    if (window.addEnhancedMessageToChat) {
        const originalAddEnhancedMessageToChat = window.addEnhancedMessageToChat;
        window.addEnhancedMessageToChat = enhanceMessageWithTTS(originalAddEnhancedMessageToChat);
    }
});

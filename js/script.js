// MediPulse - Advanced Healthcare Companion
// Main JavaScript file

// --- Global Variables ---
let chatHistory = [];
let soundEnabled = true;
let darkMode = false;
let userSettings = {
    fontSize: 100,
    waterGoal: 2500,
    waterIntake: 0,
    medicationReminders: [],
    vitalSigns: [],
    sleepData: [],
    moodData: [],
    workoutPlan: {}
};

// --- DOM Elements ---
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const menuButton = document.getElementById("menu-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const toolsPanel = document.getElementById("tools-panel");
const soundToggle = document.getElementById("sound-toggle");
const themeToggle = document.getElementById("theme-toggle");
const voiceControl = document.getElementById("voice-control");

// --- API Configuration ---
const API_KEY = (window.MEDIPULSE_CONFIG && window.MEDIPULSE_CONFIG.apiKey) || ""; // set in js/config.js (see README)
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    loadChatHistory();
    loadUserSettings();
    initializeEventListeners();
    displayWelcomeMessage();
});

// --- Event Listeners ---
function initializeEventListeners() {
    // Chat input
    sendButton.addEventListener("click", handleUserInput);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleUserInput();
    });

    // Menu and tools
    menuButton.addEventListener("click", toggleDropdownMenu);
    document.getElementById("toggle-tools").addEventListener("click", toggleToolsPanel);
    document.getElementById("open-dashboard").addEventListener("click", openDashboard);
    document.getElementById("open-settings").addEventListener("click", openModal.bind(null, "settings-modal"));
    document.getElementById("clear-history").addEventListener("click", clearChatHistory);
    document.getElementById("about-app").addEventListener("click", openModal.bind(null, "about-modal"));

    // Theme and sound
    soundToggle.addEventListener("click", toggleSound);
    themeToggle.addEventListener("click", toggleTheme);
    document.getElementById("dark-mode-toggle").addEventListener("change", toggleTheme);

    // Voice control
    voiceControl.addEventListener("click", startVoiceRecognition);

    // Tool buttons
    document.querySelectorAll(".tool-button").forEach(button => {
        button.addEventListener("click", () => {
            const tool = button.getAttribute("data-tool");
            handleToolSelection(tool);
        });
    });

    // Close modals
    document.querySelectorAll(".close-modal").forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            closeBtn.closest(".modal").style.display = "none";
        });
    });

    // BMI Calculator
    document.getElementById("calculate-bmi").addEventListener("click", calculateBMI);

    // Water Tracker
    document.querySelectorAll(".water-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const amount = parseInt(btn.getAttribute("data-amount"));
            updateWaterIntake(amount);
        });
    });
    document.getElementById("update-water-goal").addEventListener("click", updateWaterGoal);

    // Health Tips
    document.getElementById("new-tip").addEventListener("click", getRandomHealthTip);
    document.querySelectorAll(".tip-category-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tip-category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            getRandomHealthTip(btn.getAttribute("data-category"));
        });
    });

    // First Aid
    document.querySelectorAll(".first-aid-card").forEach(card => {
        card.addEventListener("click", () => {
            const aidType = card.getAttribute("data-aid");
            showFirstAidInstructions(aidType);
        });
    });
    document.getElementById("back-to-firstaid").addEventListener("click", () => {
        document.getElementById("firstaid-details").style.display = "none";
        document.querySelectorAll(".tab-content").forEach(tab => {
            if (tab.id.startsWith("firstaid-") && tab.classList.contains("active")) {
                tab.style.display = "block";
            }
        });
    });
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            activateTab(tabId, btn);
        });
    });

    // Symptom Checker
    document.querySelectorAll(".symptom-item").forEach(item => {
        item.addEventListener("click", () => {
            addSymptom(item.getAttribute("data-symptom"));
        });
    });
    document.getElementById("check-symptoms").addEventListener("click", checkSymptoms);

    // Meditation
    document.getElementById("start-meditation").addEventListener("click", startMeditation);
    document.getElementById("pause-meditation").addEventListener("click", pauseMeditation);
    document.getElementById("reset-meditation").addEventListener("click", resetMeditation);
    document.getElementById("meditation-type").addEventListener("change", updateMeditationInstructions);

    // Settings
    document.getElementById("increase-font").addEventListener("click", () => adjustFontSize(5));
    document.getElementById("decrease-font").addEventListener("click", () => adjustFontSize(-5));
    document.getElementById("clear-all-data").addEventListener("click", clearAllData);
    document.getElementById("sound-effects-toggle").addEventListener("change", (e) => {
        soundEnabled = e.target.checked;
        saveUserSettings();
    });
    document.getElementById("save-history-toggle").addEventListener("change", (e) => {
        if (!e.target.checked) {
            if (confirm("This will delete your current chat history. Continue?")) {
                clearChatHistory();
            } else {
                e.target.checked = true;
            }
        }
        saveUserSettings();
    });

    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#menu-button") && !e.target.closest("#dropdown-menu")) {
            dropdownMenu.classList.remove("show");
        }
    });
}

// --- Chat Functions ---
function handleUserInput() {
    const message = userInput.value.trim();
    if (message === "") return;

    // Display user message
    addMessageToChat("You", message, "you-message");
    userInput.value = "";

    // Check for commands
    if (handleCommands(message)) return;

    // Show typing indicator
    showTypingIndicator();

    // Send to API
    sendToAPI(message);
}

function handleCommands(message) {
    const lowerMessage = message.toLowerCase();
    
    // Tool commands
    if (lowerMessage.includes("calculate bmi") || lowerMessage === "bmi") {
        openModal("bmi-modal");
        addMessageToChat("MediPulse", "I've opened the BMI calculator for you.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage.includes("water") && (lowerMessage.includes("track") || lowerMessage.includes("reminder"))) {
        openModal("water-modal");
        addMessageToChat("MediPulse", "Here's your water intake tracker.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage.includes("health tip") || lowerMessage === "tip") {
        openModal("healthtip-modal");
        getRandomHealthTip();
        addMessageToChat("MediPulse", "Here's a health tip for you.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage.includes("first aid")) {
        openModal("firstaid-modal");
        addMessageToChat("MediPulse", "I've opened the first aid instructions.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage.includes("symptom") && (lowerMessage.includes("check") || lowerMessage.includes("analyzer"))) {
        openModal("symptoms-modal");
        addMessageToChat("MediPulse", "I've opened the symptom checker for you.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage.includes("meditate") || lowerMessage.includes("meditation")) {
        openModal("meditation-modal");
        addMessageToChat("MediPulse", "I've opened the meditation guide for you.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage === "clear history" || lowerMessage === "clear chat") {
        clearChatHistory();
        addMessageToChat("MediPulse", "I've cleared our chat history.", "lifeline-message");
        return true;
    }
    
    if (lowerMessage === "help" || lowerMessage === "commands") {
        showHelpMessage();
        return true;
    }
    
    if (lowerMessage.includes("dashboard")) {
        openDashboard();
        addMessageToChat("MediPulse", "Opening your health dashboard.", "lifeline-message");
        return true;
    }
    
    return false;
}

function sendToAPI(message) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
    };
    
    const data = {
        model: "openrouter/auto", // Use a general model for OpenRouter
        messages: [
            {
                role: "system",
                content: "You are MediPulse, an advanced AI healthcare assistant. Respond to the following health-related query with accurate, helpful information. Always include a medical disclaimer at the end of your responses."
            },
            {
                role: "user",
                content: message
            }
        ],
        temperature: 0.7,
        max_tokens: 1024,
    };

    fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        hideTypingIndicator();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const responseText = data.choices[0].message.content;
            addMessageToChat("MediPulse", responseText, "lifeline-message");
            playSound("message");
        } else {
            throw new Error("Unexpected API response format or empty response");
        }
    })
    .catch(error => {
        hideTypingIndicator();
        addMessageToChat("MediPulse", `Sorry, there was an error: ${error.message}. Please try again or contact support if the issue persists.`, "lifeline-message");
        console.error("API Error:", error);
    });
}

function addMessageToChat(sender, message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    
    const senderSpan = document.createElement("strong");
    senderSpan.textContent = sender + ": ";
    
    const messageSpan = document.createElement("span");
    messageSpan.innerHTML = message;
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(messageSpan);
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Save to chat history
    chatHistory.push({ sender, message, className });
    saveChatHistory();
}

function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message lifeline-message";
    typingDiv.id = "typing-indicator";
    
    const senderSpan = document.createElement("strong");
    senderSpan.textContent = "MediPulse: ";
    
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(senderSpan);
    typingDiv.appendChild(typingIndicator);
    
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function displayWelcomeMessage() {
    const welcomeMessage = "Welcome to MediPulse 2.0! Your enhanced AI health companion. How can I assist you today? Explore tools via the menu or ask me anything.";
    addMessageToChat("MediPulse", welcomeMessage, "lifeline-message");
}

function showHelpMessage() {
    const helpMessage = `
        <h3>MediPulse Commands & Features</h3>
        <p>Here are some things you can do:</p>
        <ul>
            <li><strong>Ask health questions</strong> - "What are symptoms of the flu?"</li>
            <li><strong>BMI Calculator</strong> - "Calculate BMI"</li>
            <li><strong>Water Tracker</strong> - "Water reminder"</li>
            <li><strong>Health Tips</strong> - "Give me a health tip"</li>
            <li><strong>First Aid</strong> - "Show first aid instructions"</li>
            <li><strong>Symptom Checker</strong> - "Check my symptoms"</li>
            <li><strong>Meditation</strong> - "Open meditation guide"</li>
            <li><strong>Dashboard</strong> - "Open dashboard"</li>
            <li><strong>Clear Chat</strong> - "Clear history"</li>
        </ul>
        <p>You can also access all tools through the menu button in the top right.</p>
    `;
    addMessageToChat("MediPulse", helpMessage, "lifeline-message");
}

// --- UI Functions ---
function toggleDropdownMenu() {
    dropdownMenu.classList.toggle("show");
    playSound("click");
}

function toggleToolsPanel() {
    if (toolsPanel.style.display === "flex") {
        toolsPanel.style.display = "none";
    } else {
        toolsPanel.style.display = "flex";
    }
    dropdownMenu.classList.remove("show");
    playSound("click");
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    document.getElementById("sound-effects-toggle").checked = soundEnabled;
    playSound("click");
    saveUserSettings();
}

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
    themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    document.getElementById("dark-mode-toggle").checked = darkMode;
    playSound("click");
    saveUserSettings();
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
    dropdownMenu.classList.remove("show");
    playSound("open");
}

function handleToolSelection(tool) {
    switch (tool) {
        case "bmi":
            openModal("bmi-modal");
            break;
        case "water":
            openModal("water-modal");
            updateWaterDisplay();
            break;
        case "healthtip":
            openModal("healthtip-modal");
            getRandomHealthTip();
            break;
        case "firstaid":
            openModal("firstaid-modal");
            break;
        case "symptoms":
            openModal("symptoms-modal");
            break;
        case "meditation":
            openModal("meditation-modal");
            updateMeditationInstructions();
            break;
        // Add more tools as needed
        default:
            addMessageToChat("MediPulse", `The ${tool} tool is coming soon!`, "lifeline-message");
    }
    playSound("click");
}

function activateTab(tabId, button) {
    // Deactivate all tabs
    const tabContainer = button.closest(".tabs").parentElement;
    tabContainer.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    tabContainer.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    
    // Activate selected tab
    button.classList.add("active");
    const tabContent = tabContainer.querySelector(`#${tabId}`);
    if (tabContent) {
        tabContent.classList.add("active");
    }
    
    playSound("click");
}

function playSound(soundType) {
    if (!soundEnabled) return;
    
    // Simple sound implementation
    const sounds = {
        click: { frequency: 800, duration: 50 },
        open: { frequency: 600, duration: 100 },
        close: { frequency: 400, duration: 100 },
        message: { frequency: 1000, duration: 80 },
        alert: { frequency: 1200, duration: 150 }
    };
    
    const sound = sounds[soundType] || sounds.click;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = "sine";
        oscillator.frequency.value = sound.frequency;
        gainNode.gain.value = 0.1;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, sound.duration);
    } catch (e) {
        console.log("Audio not supported");
    }
}

// --- Feature Functions ---
// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert("Please enter valid height and weight values.");
        return;
    }
    
    const bmi = weight / ((height / 100) * (height / 100));
    const bmiRounded = Math.round(bmi * 10) / 10;
    
    let category, message;
    if (bmi < 18.5) {
        category = "underweight";
        message = "You are underweight. Consider consulting with a healthcare provider about a balanced diet to gain weight healthily.";
    } else if (bmi < 25) {
        category = "normal";
        message = "You are in the normal weight range. Keep maintaining a balanced diet and regular exercise.";
    } else if (bmi < 30) {
        category = "overweight";
        message = "You are overweight. Consider adopting a healthier diet and increasing physical activity.";
    } else {
        category = "obese";
        message = "You are in the obese range. It's recommended to consult with a healthcare provider for personalized advice.";
    }
    
    document.getElementById("bmi-value").textContent = bmiRounded.toFixed(1);
    document.getElementById("bmi-message").textContent = message;
    
    // Position marker on BMI scale
    const markerPosition = Math.min(Math.max((bmi - 10) * 3, 0), 100);
    document.getElementById("bmi-marker").style.left = `${markerPosition}%`;
    
    document.getElementById("bmi-result").style.display = "block";
    playSound("alert");
}

// Water Tracker
function updateWaterIntake(amount) {
    userSettings.waterIntake += amount;
    if (userSettings.waterIntake < 0) userSettings.waterIntake = 0;
    updateWaterDisplay();
    saveUserSettings();
    playSound("click");
}

function updateWaterGoal() {
    const newGoal = parseInt(document.getElementById("water-goal-input").value);
    if (isNaN(newGoal) || newGoal < 500) {
        alert("Please enter a valid goal (minimum 500ml).");
        return;
    }
    
    userSettings.waterGoal = newGoal;
    updateWaterDisplay();
    saveUserSettings();
    playSound("alert");
}

function updateWaterDisplay() {
    document.getElementById("water-amount").textContent = userSettings.waterIntake;
    document.getElementById("water-goal").textContent = userSettings.waterGoal;
    document.getElementById("water-goal-input").value = userSettings.waterGoal;
    
    const percentage = Math.min((userSettings.waterIntake / userSettings.waterGoal) * 100, 100);
    document.getElementById("water-progress-fill").style.width = `${percentage}%`;
}

// Health Tips
function getRandomHealthTip(category = "all") {
    const healthTips = {
        nutrition: [
            { title: "Balanced Diet Tip", content: "Aim for a plate that is half vegetables, quarter protein, and quarter whole grains at each meal." },
            { title: "Hydration Reminder", content: "Drink water before meals to help with portion control and improve hydration." },
            { title: "Mindful Eating", content: "Eat slowly and without distractions to better recognize your body's hunger and fullness signals." },
            { title: "Healthy Snacking", content: "Choose nuts, fruits, or yogurt instead of processed snacks for sustained energy." },
            { title: "Fiber Focus", content: "Include high-fiber foods like beans, whole grains, and vegetables to improve digestion and feel fuller longer." }
        ],
        fitness: [
            { title: "Daily Movement", content: "Even short 10-minute walks throughout the day can significantly improve your health." },
            { title: "Strength Training", content: "Include resistance exercises at least twice a week to maintain muscle mass and bone density." },
            { title: "Flexibility Matters", content: "Regular stretching can improve your range of motion and reduce risk of injury." },
            { title: "Exercise Consistency", content: "Consistent moderate exercise is better than occasional intense workouts." },
            { title: "Active Recovery", content: "Light activity on rest days, like walking or gentle yoga, can help reduce muscle soreness." }
        ],
        mental: [
            { title: "Mindfulness Practice", content: "Just 5 minutes of mindfulness meditation daily can reduce stress and improve focus." },
            { title: "Digital Detox", content: "Schedule regular breaks from screens to reduce eye strain and improve mental clarity." },
            { title: "Gratitude Habit", content: "Writing down three things you're grateful for each day can boost your mood and outlook." },
            { title: "Social Connection", content: "Regular social interaction is linked to better mental health and cognitive function." },
            { title: "Nature Therapy", content: "Spending time in nature can reduce stress hormones and improve your mood." }
        ],
        sleep: [
            { title: "Sleep Schedule", content: "Maintain a consistent sleep schedule, even on weekends, to regulate your body's internal clock." },
            { title: "Bedtime Routine", content: "Develop a relaxing pre-sleep routine to signal to your body that it's time to wind down." },
            { title: "Sleep Environment", content: "Keep your bedroom cool, dark, and quiet for optimal sleep quality." },
            { title: "Screen Curfew", content: "Avoid screens at least 30 minutes before bedtime to reduce blue light exposure." },
            { title: "Caffeine Awareness", content: "Limit caffeine after noon as it can stay in your system for up to 8 hours." }
        ],
        prevention: [
            { title: "Hand Hygiene", content: "Proper handwashing for at least 20 seconds is one of the best ways to prevent illness." },
            { title: "Regular Check-ups", content: "Schedule regular preventive health screenings appropriate for your age and risk factors." },
            { title: "Sun Protection", content: "Use SPF 30+ sunscreen daily, even on cloudy days, to prevent skin damage." },
            { title: "Dental Health", content: "Floss daily and brush twice a day to prevent gum disease and related health issues." },
            { title: "Vaccination", content: "Stay up-to-date with recommended vaccines to protect yourself and your community." }
        ]
    };
    
    // Combine all categories for "all" option
    let allTips = [];
    if (category === "all") {
        Object.values(healthTips).forEach(tips => {
            allTips = allTips.concat(tips);
        });
    } else {
        allTips = healthTips[category] || Object.values(healthTips)[0];
    }
    
    // Select random tip
    const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
    
    document.getElementById("tip-title").textContent = randomTip.title;
    document.getElementById("tip-content").textContent = randomTip.content;
    
    playSound("alert");
}

// First Aid Instructions
function showFirstAidInstructions(aidType) {
    const firstAidData = {
        cuts: {
            title: "Cuts & Scrapes",
            instructions: `
                <ol>
                    <li>Wash your hands with soap and water.</li>
                    <li>Apply gentle pressure with a clean cloth to stop bleeding.</li>
                    <li>Clean the wound with cool running water. Avoid using soap directly on the wound.</li>
                    <li>Apply an antibiotic ointment to prevent infection.</li>
                    <li>Cover with a sterile bandage.</li>
                    <li>Change the bandage daily or if it gets wet or dirty.</li>
                </ol>
                <p><strong>Seek medical attention if:</strong></p>
                <ul>
                    <li>The wound is deep or has jagged edges</li>
                    <li>Bleeding doesn't stop after 10-15 minutes of pressure</li>
                    <li>There's embedded dirt or debris you can't remove</li>
                    <li>The wound shows signs of infection (increasing redness, warmth, swelling, or pus)</li>
                </ul>
            `
        },
        burns: {
            title: "First & Second Degree Burns",
            instructions: `
                <ol>
                    <li>Cool the burn with cool (not cold) running water for 10-15 minutes.</li>
                    <li>Do not apply ice directly to the burn as it can damage the tissue.</li>
                    <li>Remove jewelry or tight items from the burned area before swelling occurs.</li>
                    <li>Apply a thin layer of aloe vera gel or moisturizer to prevent drying.</li>
                    <li>Cover with a sterile, non-stick bandage wrapped loosely.</li>
                    <li>Take over-the-counter pain relievers if needed.</li>
                </ol>
                <p><strong>Seek medical attention if:</strong></p>
                <ul>
                    <li>The burn is larger than 3 inches in diameter</li>
                    <li>The burn is on the face, hands, feet, genitals, or over a joint</li>
                    <li>The skin is broken or blistered</li>
                    <li>There are signs of infection</li>
                    <li>For any third-degree burns (charred or white skin), seek emergency care immediately</li>
                </ul>
            `
        },
        choking: {
            title: "Choking - Heimlich Maneuver",
            instructions: `
                <p><strong>For a conscious adult or child over 1 year:</strong></p>
                <ol>
                    <li>Stand behind the person and wrap your arms around their waist.</li>
                    <li>Make a fist with one hand and place it slightly above the person's navel.</li>
                    <li>Grab your fist with your other hand.</li>
                    <li>Press hard into the abdomen with a quick, upward thrust.</li>
                    <li>Repeat thrusts until the object is expelled or the person becomes unconscious.</li>
                </ol>
                
                <p><strong>If the person becomes unconscious:</strong></p>
                <ol>
                    <li>Lower them to the ground and call 911 or local emergency number.</li>
                    <li>Begin CPR if you're trained.</li>
                    <li>Before giving breaths, look in the mouth for the object and remove it if visible.</li>
                </ol>
                
                <p><strong>For infants under 1 year:</strong></p>
                <ol>
                    <li>Hold the infant face down on your forearm, supporting their head.</li>
                    <li>Give up to 5 back blows between the shoulder blades with the heel of your hand.</li>
                    <li>If the object isn't expelled, turn the infant face up and give 5 chest compressions.</li>
                    <li>Continue alternating between back blows and chest compressions until the object is expelled or the infant becomes unconscious.</li>
                </ol>
                
                <p><strong>This is an emergency situation. Call 911 immediately.</strong></p>
            `
        },
        // Add more first aid instructions as needed
    };
    
    const aidData = firstAidData[aidType];
    if (!aidData) {
        document.getElementById("firstaid-title").textContent = "Instructions Not Found";
        document.getElementById("firstaid-instructions").innerHTML = "Sorry, instructions for this situation are not available.";
    } else {
        document.getElementById("firstaid-title").textContent = aidData.title;
        document.getElementById("firstaid-instructions").innerHTML = aidData.instructions;
    }
    
    // Hide tab content and show details
    document.querySelectorAll(".tab-content").forEach(tab => {
        if (tab.id.startsWith("firstaid-")) {
            tab.style.display = "none";
        }
    });
    document.getElementById("firstaid-details").style.display = "block";
    
    playSound("alert");
}

// Symptom Checker
function addSymptom(symptom) {
    const selectedSymptoms = document.getElementById("selected-symptoms");
    
    // Check if symptom already added
    if (selectedSymptoms.querySelector(`[data-symptom="${symptom}"]`)) {
        return;
    }
    
    const symptomTag = document.createElement("div");
    symptomTag.className = "symptom-tag";
    symptomTag.setAttribute("data-symptom", symptom);
    symptomTag.innerHTML = `${symptom} <span class="remove-symptom">&times;</span>`;
    
    symptomTag.querySelector(".remove-symptom").addEventListener("click", () => {
        symptomTag.remove();
        playSound("click");
    });
    
    selectedSymptoms.appendChild(symptomTag);
    playSound("click");
}

function checkSymptoms() {
    const selectedSymptoms = document.getElementById("selected-symptoms");
    const symptoms = Array.from(selectedSymptoms.querySelectorAll(".symptom-tag")).map(tag => tag.getAttribute("data-symptom"));
    
    if (symptoms.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }
    
    // Simple symptom checker logic
    const conditionsList = document.getElementById("condition-list");
    conditionsList.innerHTML = "";
    
    // Very basic symptom matching
    const conditions = [];
    
    if (symptoms.includes("headache")) {
        if (symptoms.includes("fever")) {
            conditions.push("Common Cold");
            conditions.push("Flu");
            conditions.push("Sinus Infection");
        }
        if (symptoms.includes("nausea")) {
            conditions.push("Migraine");
            conditions.push("Concussion");
        }
        conditions.push("Tension Headache");
        conditions.push("Dehydration");
    }
    
    if (symptoms.includes("fever")) {
        if (symptoms.includes("cough")) {
            conditions.push("Bronchitis");
            conditions.push("Pneumonia");
            conditions.push("COVID-19");
        }
        conditions.push("Viral Infection");
    }
    
    if (symptoms.includes("cough")) {
        if (symptoms.includes("shortness of breath")) {
            conditions.push("Asthma");
            conditions.push("Bronchitis");
            conditions.push("COVID-19");
        }
        conditions.push("Common Cold");
        conditions.push("Allergies");
    }
    
    if (symptoms.includes("sore throat")) {
        conditions.push("Strep Throat");
        conditions.push("Tonsillitis");
        conditions.push("Common Cold");
    }
    
    if (symptoms.includes("fatigue")) {
        conditions.push("Anemia");
        conditions.push("Depression");
        conditions.push("Sleep Apnea");
        conditions.push("Chronic Fatigue Syndrome");
    }
    
    if (symptoms.includes("chest pain")) {
        conditions.push("Angina");
        conditions.push("Heart Attack");
        conditions.push("Acid Reflux");
        conditions.push("Anxiety");
    }
    
    // Remove duplicates and limit to 5 conditions
    const uniqueConditions = [...new Set(conditions)].slice(0, 5);
    
    if (uniqueConditions.length === 0) {
        conditionsList.innerHTML = "<p>No specific conditions matched your symptoms. Please consult a healthcare provider for proper diagnosis.</p>";
    } else {
        uniqueConditions.forEach(condition => {
            const item = document.createElement("div");
            item.className = "condition-item";
            item.textContent = condition;
            conditionsList.appendChild(item);
        });
    }
    
    document.getElementById("symptom-results").style.display = "block";
    playSound("alert");
}

// Meditation
let meditationTimer;
let meditationSeconds = 300; // 5 minutes default
let meditationRunning = false;

function updateMeditationInstructions() {
    const meditationType = document.getElementById("meditation-type").value;
    let instruction = "";
    
    switch (meditationType) {
        case "breathing":
            instruction = "Focus on your breath flowing in and out";
            break;
        case "body-scan":
            instruction = "Notice sensations throughout your body";
            break;
        case "loving-kindness":
            instruction = "Send compassion to yourself and others";
            break;
        case "mindfulness":
            instruction = "Observe your thoughts without judgment";
            break;
        case "visualization":
            instruction = "Imagine a peaceful, calming place";
            break;
        default:
            instruction = "Focus on your breath";
    }
    
    document.getElementById("meditation-instruction").textContent = instruction;
}

function startMeditation() {
    if (meditationRunning) return;
    
    const duration = parseInt(document.getElementById("meditation-duration").value);
    if (isNaN(duration) || duration <= 0 || duration > 60) {
        alert("Please enter a valid duration between 1 and 60 minutes.");
        return;
    }
    
    meditationSeconds = duration * 60;
    updateMeditationTimer();
    
    document.getElementById("start-meditation").disabled = true;
    document.getElementById("pause-meditation").disabled = false;
    
    meditationRunning = true;
    meditationTimer = setInterval(() => {
        meditationSeconds--;
        updateMeditationTimer();
        
        if (meditationSeconds <= 0) {
            clearInterval(meditationTimer);
            meditationRunning = false;
            document.getElementById("start-meditation").disabled = false;
            document.getElementById("pause-meditation").disabled = true;
            playSound("alert");
        }
    }, 1000);
    
    playSound("click");
}

function pauseMeditation() {
    if (!meditationRunning) return;
    
    if (document.getElementById("pause-meditation").textContent === "Pause") {
        clearInterval(meditationTimer);
        document.getElementById("pause-meditation").textContent = "Resume";
    } else {
        document.getElementById("pause-meditation").textContent = "Pause";
        startMeditation();
    }
    
    playSound("click");
}

function resetMeditation() {
    clearInterval(meditationTimer);
    meditationRunning = false;
    
    const duration = parseInt(document.getElementById("meditation-duration").value);
    meditationSeconds = (isNaN(duration) || duration <= 0 || duration > 60) ? 300 : duration * 60;
    
    updateMeditationTimer();
    document.getElementById("start-meditation").disabled = false;
    document.getElementById("pause-meditation").disabled = true;
    document.getElementById("pause-meditation").textContent = "Pause";
    
    playSound("click");
}

function updateMeditationTimer() {
    const minutes = Math.floor(meditationSeconds / 60);
    const seconds = meditationSeconds % 60;
    document.getElementById("meditation-time").textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Voice Recognition
function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Voice recognition is not supported in your browser.");
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    voiceControl.classList.add("listening");
    playSound("open");
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        userInput.value = speechResult;
        voiceControl.classList.remove("listening");
        handleUserInput();
    };
    
    recognition.onerror = (event) => {
        voiceControl.classList.remove("listening");
        console.error("Speech recognition error", event.error);
        playSound("close");
    };
    
    recognition.onend = () => {
        voiceControl.classList.remove("listening");
    };
}

// Dashboard
function openDashboard() {
    addMessageToChat("MediPulse", "Health dashboard feature coming soon! This will show your health metrics, goals, and progress in one place.", "lifeline-message");
    dropdownMenu.classList.remove("show");
}

// Settings
function adjustFontSize(change) {
    userSettings.fontSize += change;
    if (userSettings.fontSize < 70) userSettings.fontSize = 70;
    if (userSettings.fontSize > 150) userSettings.fontSize = 150;
    
    document.documentElement.style.fontSize = `${userSettings.fontSize}%`;
    document.getElementById("font-size-value").textContent = `${userSettings.fontSize}%`;
    
    saveUserSettings();
    playSound("click");
}

// --- Data Management ---
function saveChatHistory() {
    if (document.getElementById("save-history-toggle").checked) {
        localStorage.setItem("medipulse_chat_history", JSON.stringify(chatHistory));
    }
}

function loadChatHistory() {
    const savedHistory = localStorage.getItem("medipulse_chat_history");
    if (savedHistory) {
        try {
            chatHistory = JSON.parse(savedHistory);
            chatHistory.forEach(msg => {
                addMessageToChat(msg.sender, msg.message, msg.className);
            });
        } catch (e) {
            console.error("Error loading chat history:", e);
        }
    }
}

function clearChatHistory() {
    chatHistory = [];
    localStorage.removeItem("medipulse_chat_history");
    chatBox.innerHTML = "";
    displayWelcomeMessage();
    playSound("alert");
}

function saveUserSettings() {
    localStorage.setItem("medipulse_user_settings", JSON.stringify(userSettings));
    localStorage.setItem("medipulse_sound_enabled", soundEnabled);
    localStorage.setItem("medipulse_dark_mode", darkMode);
}

function loadUserSettings() {
    const savedSettings = localStorage.getItem("medipulse_user_settings");
    if (savedSettings) {
        try {
            const parsedSettings = JSON.parse(savedSettings);
            userSettings = { ...userSettings, ...parsedSettings };
        } catch (e) {
            console.error("Error loading user settings:", e);
        }
    }
    
    // Load sound setting
    const savedSound = localStorage.getItem("medipulse_sound_enabled");
    if (savedSound !== null) {
        soundEnabled = savedSound === "true";
        soundToggle.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        document.getElementById("sound-effects-toggle").checked = soundEnabled;
    }
    
    // Load theme setting
    const savedTheme = localStorage.getItem("medipulse_dark_mode");
    if (savedTheme !== null) {
        darkMode = savedTheme === "true";
        document.body.classList.toggle("dark-mode", darkMode);
        themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        document.getElementById("dark-mode-toggle").checked = darkMode;
    }
    
    // Apply font size
    document.documentElement.style.fontSize = `${userSettings.fontSize}%`;
    document.getElementById("font-size-value").textContent = `${userSettings.fontSize}%`;
}

function clearAllData() {
    if (confirm("This will clear all your data including chat history, settings, and health tracking information. This action cannot be undone. Continue?")) {
        localStorage.clear();
        alert("All data has been cleared. The page will now reload.");
        location.reload();
    }
}

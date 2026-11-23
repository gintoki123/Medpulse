// MediPulse - Multi-language Support

// --- Global Variables ---
let currentLanguage = "en"; // Default language is English
const supportedLanguages = {
    "en": {
        name: "English",
        nativeName: "English",
        direction: "ltr"
    },
    "ar": {
        name: "Arabic",
        nativeName: "العربية",
        direction: "rtl"
    },
    "fr": {
        name: "French",
        nativeName: "Français",
        direction: "ltr"
    },
    "es": {
        name: "Spanish",
        nativeName: "Español",
        direction: "ltr"
    },
    "de": {
        name: "German",
        nativeName: "Deutsch",
        direction: "ltr"
    },
    "tr": {
        name: "Turkish",
        nativeName: "Türkçe",
        direction: "ltr"
    }
};

// --- Language Translations ---
const translations = {
    // English translations (default)
    "en": {
        // General UI
        "app_name": "MediPulse",
        "welcome_message": "Welcome to MediPulse 2.0! Your enhanced AI health companion. How can I assist you today? Explore tools via the menu or ask me anything.",
        "input_placeholder": "Ask MediPulse anything about your health...",
        
        // Menu items
        "menu_health_tools": "Health Tools",
        "menu_health_dashboard": "Health Dashboard",
        "menu_settings": "Settings",
        "menu_clear_history": "Clear Chat History",
        "menu_about": "About MediPulse",
        "menu_download_report": "Download Report",
        
        // Tool categories
        "tools_health_tracking": "Health Tracking",
        "tools_medical_resources": "Medical Resources",
        "tools_wellness": "Wellness",
        
        // Tool names
        "tool_bmi": "BMI Calculator",
        "tool_water": "Water Tracker",
        "tool_vitals": "Vital Signs",
        "tool_sleep": "Sleep Tracker",
        "tool_mood": "Mood Tracker",
        "tool_pain": "Pain Journal",
        "tool_symptoms": "Symptom Checker",
        "tool_firstaid": "First Aid",
        "tool_medication": "Medications",
        "tool_healthtip": "Health Tips",
        "tool_druginteraction": "Drug Interactions",
        "tool_medterms": "Medical Terms",
        "tool_meditation": "Meditation",
        "tool_exercise": "Exercise",
        "tool_nutrition": "Nutrition",
        "tool_breathing": "Breathing",
        "tool_gratitude": "Gratitude",
        "tool_habits": "Habit Builder",
        
        // BMI Calculator
        "bmi_title": "BMI Calculator",
        "bmi_height": "Height (cm)",
        "bmi_weight": "Weight (kg)",
        "bmi_calculate": "Calculate BMI",
        "bmi_result_underweight": "You are underweight. Consider consulting with a healthcare provider about a balanced diet to gain weight healthily.",
        "bmi_result_normal": "You are in the normal weight range. Keep maintaining a balanced diet and regular exercise.",
        "bmi_result_overweight": "You are overweight. Consider adopting a healthier diet and increasing physical activity.",
        "bmi_result_obese": "You are in the obese range. It's recommended to consult with a healthcare provider for personalized advice.",
        "bmi_category_underweight": "Underweight",
        "bmi_category_normal": "Normal",
        "bmi_category_overweight": "Overweight",
        "bmi_category_obese": "Obese",
        
        // Water Tracker
        "water_title": "Water Intake Tracker",
        "water_progress": "Today's Progress:",
        "water_add_small": "250ml",
        "water_add_large": "500ml",
        "water_remove": "Remove 250ml",
        "water_goal_label": "Daily Water Goal (ml)",
        "water_update_goal": "Update Goal",
        
        // Settings
        "settings_title": "Settings",
        "settings_theme": "Dark Mode",
        "settings_sound": "Sound Effects",
        "settings_save_history": "Save Chat History",
        "settings_font_size": "Font Size",
        "settings_increase_font": "Increase",
        "settings_decrease_font": "Decrease",
        "settings_clear_data": "Clear All Data",
        "settings_language": "Language",
        "settings_response_length": "Response Length",
        "settings_concise_responses": "Prefer concise responses",
        "settings_tts": "Text-to-Speech",
        "settings_tts_enable": "Enable voice readout",
        "settings_tts_voice": "Voice",
        "settings_tts_speed": "Speed",
        "settings_tts_pitch": "Pitch",
        "settings_tts_volume": "Volume",
        "settings_tts_test": "Test Voice",
        
        // Alerts and messages
        "alert_valid_height_weight": "Please enter valid height and weight values.",
        "alert_valid_goal": "Please enter a valid goal (minimum 500ml).",
        "alert_clear_confirm": "This will delete your current chat history. Continue?",
        "alert_clear_all_confirm": "This will clear all your data including chat history, settings, and health tracking information. This action cannot be undone. Continue?",
        "alert_all_cleared": "All data has been cleared. The page will now reload.",
        "alert_select_symptom": "Please select at least one symptom.",
        "alert_valid_duration": "Please enter a valid duration between 1 and 60 minutes.",
        "alert_voice_not_supported": "Voice recognition is not supported in your browser.",
        "alert_pdf_error": "An error occurred while generating the PDF report.",
        
        // Medical disclaimer
        "medical_disclaimer": "Disclaimer: MediPulse is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
    },
    
    // Arabic translations
    "ar": {
        "app_name": "ميدي بالس",
        "welcome_message": "مرحبًا بك في ميدي بالس 2.0! رفيقك الصحي المعزز بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟ استكشف الأدوات عبر القائمة أو اسألني أي شيء.",
        "input_placeholder": "اسأل ميدي بالس أي شيء عن صحتك...",
        
        "menu_health_tools": "الأدوات الصحية",
        "menu_health_dashboard": "لوحة المعلومات الصحية",
        "menu_settings": "الإعدادات",
        "menu_clear_history": "مسح سجل المحادثة",
        "menu_about": "حول ميدي بالس",
        "menu_download_report": "تنزيل التقرير",
        
        "tools_health_tracking": "تتبع الصحة",
        "tools_medical_resources": "الموارد الطبية",
        "tools_wellness": "العافية",
        
        "tool_bmi": "حاسبة مؤشر كتلة الجسم",
        "tool_water": "متتبع المياه",
        "tool_vitals": "العلامات الحيوية",
        "tool_sleep": "متتبع النوم",
        "tool_mood": "متتبع المزاج",
        "tool_pain": "سجل الألم",
        "tool_symptoms": "فاحص الأعراض",
        "tool_firstaid": "الإسعافات الأولية",
        "tool_medication": "الأدوية",
        "tool_healthtip": "نصائح صحية",
        "tool_druginteraction": "تفاعلات الأدوية",
        "tool_medterms": "المصطلحات الطبية",
        "tool_meditation": "التأمل",
        "tool_exercise": "التمارين",
        "tool_nutrition": "التغذية",
        "tool_breathing": "التنفس",
        "tool_gratitude": "الامتنان",
        "tool_habits": "بناء العادات",
        
        "bmi_title": "حاسبة مؤشر كتلة الجسم",
        "bmi_height": "الطول (سم)",
        "bmi_weight": "الوزن (كجم)",
        "bmi_calculate": "حساب مؤشر كتلة الجسم",
        "bmi_result_underweight": "أنت تعاني من نقص الوزن. فكر في استشارة مقدم رعاية صحية حول نظام غذائي متوازن لزيادة الوزن بشكل صحي.",
        "bmi_result_normal": "أنت في نطاق الوزن الطبيعي. استمر في الحفاظ على نظام غذائي متوازن وممارسة التمارين الرياضية بانتظام.",
        "bmi_result_overweight": "أنت تعاني من زيادة الوزن. فكر في اعتماد نظام غذائي أكثر صحة وزيادة النشاط البدني.",
        "bmi_result_obese": "أنت في نطاق السمنة. يُنصح باستشارة مقدم رعاية صحية للحصول على نصائح شخصية.",
        "bmi_category_underweight": "نقص الوزن",
        "bmi_category_normal": "طبيعي",
        "bmi_category_overweight": "زيادة الوزن",
        "bmi_category_obese": "سمنة",
        
        "medical_disclaimer": "إخلاء المسؤولية: ميدي بالس ليس بديلاً عن المشورة الطبية المهنية أو التشخيص أو العلاج. استشر دائمًا طبيبك أو مقدم الرعاية الصحية المؤهل الآخر بشأن أي أسئلة قد تكون لديك بخصوص حالة طبية."
        // Additional Arabic translations would continue here
    },
    
    // French translations
    "fr": {
        "app_name": "MediPulse",
        "welcome_message": "Bienvenue sur MediPulse 2.0 ! Votre compagnon de santé IA amélioré. Comment puis-je vous aider aujourd'hui ? Explorez les outils via le menu ou posez-moi n'importe quelle question.",
        "input_placeholder": "Demandez à MediPulse n'importe quoi sur votre santé...",
        
        "menu_health_tools": "Outils de Santé",
        "menu_health_dashboard": "Tableau de Bord Santé",
        "menu_settings": "Paramètres",
        "menu_clear_history": "Effacer l'Historique",
        "menu_about": "À Propos de MediPulse",
        "menu_download_report": "Télécharger le Rapport",
        
        "medical_disclaimer": "Avertissement : MediPulse ne remplace pas les conseils, diagnostics ou traitements médicaux professionnels. Consultez toujours votre médecin ou un autre professionnel de la santé qualifié pour toute question concernant une condition médicale."
        // Additional French translations would continue here
    },
    
    // Spanish translations
    "es": {
        "app_name": "MediPulse",
        "welcome_message": "¡Bienvenido a MediPulse 2.0! Tu compañero de salud mejorado con IA. ¿Cómo puedo ayudarte hoy? Explora las herramientas a través del menú o pregúntame cualquier cosa.",
        "input_placeholder": "Pregunta a MediPulse cualquier cosa sobre tu salud...",
        
        "menu_health_tools": "Herramientas de Salud",
        "menu_health_dashboard": "Panel de Salud",
        "menu_settings": "Configuración",
        "menu_clear_history": "Borrar Historial",
        "menu_about": "Acerca de MediPulse",
        "menu_download_report": "Descargar Informe",
        
        "medical_disclaimer": "Descargo de responsabilidad: MediPulse no sustituye el asesoramiento, diagnóstico o tratamiento médico profesional. Consulte siempre a su médico u otro proveedor de atención médica calificado con cualquier pregunta que pueda tener sobre una condición médica."
        // Additional Spanish translations would continue here
    },
    
    // German translations
    "de": {
        "app_name": "MediPulse",
        "welcome_message": "Willkommen bei MediPulse 2.0! Ihr verbesserter KI-Gesundheitsbegleiter. Wie kann ich Ihnen heute helfen? Erkunden Sie die Tools über das Menü oder stellen Sie mir eine beliebige Frage.",
        "input_placeholder": "Fragen Sie MediPulse alles über Ihre Gesundheit...",
        
        "menu_health_tools": "Gesundheitstools",
        "menu_health_dashboard": "Gesundheits-Dashboard",
        "menu_settings": "Einstellungen",
        "menu_clear_history": "Chatverlauf löschen",
        "menu_about": "Über MediPulse",
        "menu_download_report": "Bericht herunterladen",
        
        "medical_disclaimer": "Haftungsausschluss: MediPulse ist kein Ersatz für professionelle medizinische Beratung, Diagnose oder Behandlung. Wenden Sie sich bei Fragen zu einer medizinischen Erkrankung immer an Ihren Arzt oder einen anderen qualifizierten Gesundheitsdienstleister."
        // Additional German translations would continue here
    },
    
    // Turkish translations
    "tr": {
        "app_name": "MediPulse",
        "welcome_message": "MediPulse 2.0'a hoş geldiniz! Gelişmiş yapay zeka sağlık yardımcınız. Bugün size nasıl yardımcı olabilirim? Menü aracılığıyla araçları keşfedin veya bana herhangi bir şey sorun.",
        "input_placeholder": "MediPulse'a sağlığınız hakkında herhangi bir şey sorun...",
        
        "menu_health_tools": "Sağlık Araçları",
        "menu_health_dashboard": "Sağlık Paneli",
        "menu_settings": "Ayarlar",
        "menu_clear_history": "Sohbet Geçmişini Temizle",
        "menu_about": "MediPulse Hakkında",
        "menu_download_report": "Raporu İndir",
        
        "medical_disclaimer": "Sorumluluk Reddi: MediPulse, profesyonel tıbbi tavsiye, teşhis veya tedavinin yerini tutmaz. Tıbbi bir durumla ilgili sorularınız için her zaman doktorunuza veya diğer nitelikli sağlık uzmanına danışın."
        // Additional Turkish translations would continue here
    }
};

// --- Core Language Functions ---

// Initialize language support
function initializeLanguageSupport() {
    // Load saved language preference or use browser language
    const savedLanguage = localStorage.getItem("medipulse_language");
    if (savedLanguage && supportedLanguages[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (supportedLanguages[browserLang]) {
            currentLanguage = browserLang;
        }
    }
    
    // Add language selector to settings
    addLanguageSelector();
    
    // Apply initial language
    applyLanguage(currentLanguage);
    
    console.log(`Language support initialized with ${currentLanguage}`);
}

// Apply selected language to the UI
function applyLanguage(langCode) {
    if (!supportedLanguages[langCode]) {
        console.error(`Language ${langCode} is not supported.`);
        return;
    }
    
    currentLanguage = langCode;
    localStorage.setItem("medipulse_language", langCode);
    
    // Set document direction for RTL languages
    document.documentElement.dir = supportedLanguages[langCode].direction;
    document.documentElement.lang = langCode;
    
    // Get translation object
    const trans = translations[langCode] || translations.en;
    
    // Update all translatable elements
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (trans[key]) {
            // Check if this is an input with placeholder
            if (element.placeholder !== undefined) {
                element.placeholder = trans[key];
            } else {
                element.textContent = trans[key];
            }
        }
    });
    
    // Update page title
    document.title = trans.app_name + " - " + trans.menu_health_dashboard;
    
    // Update input placeholder
    const userInput = document.getElementById("user-input");
    if (userInput) {
        userInput.placeholder = trans.input_placeholder;
    }
    
    // Refresh any dynamic content that needs translation
    refreshDynamicContent();
}

// Add data-i18n attributes to all translatable elements
function prepareElementsForTranslation() {
    // App name
    document.querySelector(".logo-container h1").setAttribute("data-i18n", "app_name");
    
    // Menu items
    document.querySelector("#toggle-tools").setAttribute("data-i18n", "menu_health_tools");
    document.querySelector("#open-dashboard").setAttribute("data-i18n", "menu_health_dashboard");
    document.querySelector("#open-settings").setAttribute("data-i18n", "menu_settings");
    document.querySelector("#clear-history").setAttribute("data-i18n", "menu_clear_history");
    document.querySelector("#about-app").setAttribute("data-i18n", "menu_about");
    document.querySelector("#download-report").setAttribute("data-i18n", "menu_download_report");
    
    // Tool section headers
    document.querySelectorAll(".tools-section h3")[0].setAttribute("data-i18n", "tools_health_tracking");
    document.querySelectorAll(".tools-section h3")[1].setAttribute("data-i18n", "tools_medical_resources");
    document.querySelectorAll(".tools-section h3")[2].setAttribute("data-i18n", "tools_wellness");
    
    // Tool buttons
    document.querySelector('[data-tool="bmi"]').setAttribute("data-i18n", "tool_bmi");
    document.querySelector('[data-tool="water"]').setAttribute("data-i18n", "tool_water");
    document.querySelector('[data-tool="vitals"]').setAttribute("data-i18n", "tool_vitals");
    document.querySelector('[data-tool="sleep"]').setAttribute("data-i18n", "tool_sleep");
    document.querySelector('[data-tool="mood"]').setAttribute("data-i18n", "tool_mood");
    document.querySelector('[data-tool="pain"]').setAttribute("data-i18n", "tool_pain");
    document.querySelector('[data-tool="symptoms"]').setAttribute("data-i18n", "tool_symptoms");
    document.querySelector('[data-tool="firstaid"]').setAttribute("data-i18n", "tool_firstaid");
    document.querySelector('[data-tool="medication"]').setAttribute("data-i18n", "tool_medication");
    document.querySelector('[data-tool="healthtip"]').setAttribute("data-i18n", "tool_healthtip");
    document.querySelector('[data-tool="druginteraction"]').setAttribute("data-i18n", "tool_druginteraction");
    document.querySelector('[data-tool="medterms"]').setAttribute("data-i18n", "tool_medterms");
    document.querySelector('[data-tool="meditation"]').setAttribute("data-i18n", "tool_meditation");
    document.querySelector('[data-tool="exercise"]').setAttribute("data-i18n", "tool_exercise");
    document.querySelector('[data-tool="nutrition"]').setAttribute("data-i18n", "tool_nutrition");
    document.querySelector('[data-tool="breathing"]').setAttribute("data-i18n", "tool_breathing");
    document.querySelector('[data-tool="gratitude"]').setAttribute("data-i18n", "tool_gratitude");
    document.querySelector('[data-tool="habits"]').setAttribute("data-i18n", "tool_habits");
    
    // BMI Calculator
    document.querySelector("#bmi-modal .modal-title").setAttribute("data-i18n", "bmi_title");
    document.querySelector("#bmi-modal label[for='height']").setAttribute("data-i18n", "bmi_height");
    document.querySelector("#bmi-modal label[for='weight']").setAttribute("data-i18n", "bmi_weight");
    document.querySelector("#calculate-bmi").setAttribute("data-i18n", "bmi_calculate");
    document.querySelector(".bmi-category.underweight").setAttribute("data-i18n", "bmi_category_underweight");
    document.querySelector(".bmi-category.normal").setAttribute("data-i18n", "bmi_category_normal");
    document.querySelector(".bmi-category.overweight").setAttribute("data-i18n", "bmi_category_overweight");
    document.querySelector(".bmi-category.obese").setAttribute("data-i18n", "bmi_category_obese");
    
    // User input
    document.getElementById("user-input").setAttribute("data-i18n", "input_placeholder");
}

// Add language selector to settings
function addLanguageSelector() {
    // Add to settings modal
    const settingsContent = document.querySelector("#settings-modal .modal-content");
    
    const languageDiv = document.createElement("div");
    languageDiv.className = "settings-group";
    languageDiv.innerHTML = `
        <h3 data-i18n="settings_language">Language</h3>
        <div class="form-group">
            <select id="language-select" class="form-select">
                ${Object.entries(supportedLanguages).map(([code, lang]) => 
                    `<option value="${code}" ${code === currentLanguage ? 'selected' : ''}>${lang.nativeName}</option>`
                ).join('')}
            </select>
        </div>
    `;
    
    // Insert before the response length settings
    const responseSettings = settingsContent.querySelector(".settings-group:has(#concise-responses-toggle)");
    if (responseSettings) {
        settingsContent.insertBefore(languageDiv, responseSettings);
    } else {
        // If response settings don't exist yet, insert before the last button
        const lastButton = settingsContent.querySelector(".form-submit");
        settingsContent.insertBefore(languageDiv, lastButton);
    }
    
    // Add event listener
    document.getElementById("language-select").addEventListener("change", (e) => {
        const newLang = e.target.value;
        applyLanguage(newLang);
        playSound("click");
    });
}

// Refresh dynamic content that needs translation
function refreshDynamicContent() {
    // Update welcome message for new chats
    if (chatHistory.length === 0) {
        displayWelcomeMessage();
    }
}

// --- Integration with API ---

// Enhance the Gemini API function to respect language
function enhanceSendToGeminiAPI(originalFunction) {
    return function(message) {
        const headers = {
            "Content-Type": "application/json"
        };
        
        // Get user's preferred response length
        const preferConcise = localStorage.getItem("medipulse_concise_responses") === "true";
        
        // Get current language
        const lang = currentLanguage;
        const trans = translations[lang] || translations.en;
        
        // Construct a prompt with language instructions
        let promptText = `You are MediPulse, an advanced AI healthcare assistant. `;
        
        // Add language instruction
        if (lang !== "en") {
            promptText += `Please respond in ${supportedLanguages[lang].name} language. `;
        }
        
        promptText += `${preferConcise ? 'Provide a BRIEF and CONCISE response' : 'Respond'} to the following health-related query with accurate, helpful information.

IMPORTANT FORMATTING INSTRUCTIONS:
1. Use minimal formatting - avoid excessive asterisks (**)
2. Keep paragraphs short and focused
3. Use simple HTML tags for emphasis instead of asterisks
4. ${preferConcise ? 'Limit your response to 3-4 sentences maximum' : 'Be thorough but clear'}

Query: ${message}

Remember to include a brief medical disclaimer at the end of your response.`;
        
        const data = {
            contents: [{
                parts: [{
                    text: promptText
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: preferConcise ? 256 : 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        fetch(`${API_URL}?key=${API_KEY}`, {
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
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                let responseText = data.candidates[0].content.parts[0].text;
                
                // Post-process the response to clean up formatting
                responseText = cleanupResponseFormatting(responseText);
                
                // Add the response to chat with expand/collapse option if not concise mode
                addEnhancedMessageToChat("MediPulse", responseText, "lifeline-message", !preferConcise);
                
                // Play sound notification
                playSound("message");
                
                // Speak the response if text-to-speech is enabled
                if (localStorage.getItem("medipulse_tts_enabled") === "true") {
                    speakText(responseText);
                }
            } else {
                throw new Error("Unexpected API response format");
            }
        })
        .catch(error => {
            hideTypingIndicator();
            const errorMessage = trans.alert_api_error || `Sorry, there was an error: ${error.message}. Please try again or contact support if the issue persists.`;
            addMessageToChat("MediPulse", errorMessage, "lifeline-message");
            console.error("API Error:", error);
        });
    };
}

// --- Voice Recognition with Language Support ---
function enhanceStartVoiceRecognition(originalFunction) {
    return function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            const trans = translations[currentLanguage] || translations.en;
            alert(trans.alert_voice_not_supported || "Voice recognition is not supported in your browser.");
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Set recognition language based on current app language
        recognition.lang = currentLanguage === "en" ? "en-US" : 
                          currentLanguage === "fr" ? "fr-FR" :
                          currentLanguage === "es" ? "es-ES" :
                          currentLanguage === "de" ? "de-DE" :
                          currentLanguage === "ar" ? "ar-SA" :
                          currentLanguage === "tr" ? "tr-TR" : "en-US";
                          
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
    };
}

// --- Initialize Language Support ---
document.addEventListener("DOMContentLoaded", () => {
    // Prepare elements for translation
    prepareElementsForTranslation();
    
    // Initialize language support
    initializeLanguageSupport();
    
    // Enhance the welcome message function
    if (window.displayWelcomeMessage) {
        const originalWelcome = window.displayWelcomeMessage;
        window.displayWelcomeMessage = function() {
            const trans = translations[currentLanguage] || translations.en;
            addMessageToChat("MediPulse", trans.welcome_message, "lifeline-message");
        };
    }
    
    // Enhance the Gemini API function
    if (window.sendToGeminiAPI) {
        window.sendToGeminiAPI = enhanceSendToGeminiAPI(window.sendToGeminiAPI);
    }
    
    // Enhance the voice recognition function
    if (window.startVoiceRecognition) {
        window.startVoiceRecognition = enhanceStartVoiceRecognition(window.startVoiceRecognition);
    }
    
    // Enhance the BMI calculator function
    if (window.calculateBMI) {
        const originalCalculateBMI = window.calculateBMI;
        window.calculateBMI = function() {
            const height = parseFloat(document.getElementById("height").value);
            const weight = parseFloat(document.getElementById("weight").value);
            
            const trans = translations[currentLanguage] || translations.en;
            
            if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
                alert(trans.alert_valid_height_weight);
                return;
            }
            
            const bmi = weight / ((height / 100) * (height / 100));
            const bmiRounded = Math.round(bmi * 10) / 10;
            
            let category, message;
            if (bmi < 18.5) {
                category = "underweight";
                message = trans.bmi_result_underweight;
            } else if (bmi < 25) {
                category = "normal";
                message = trans.bmi_result_normal;
            } else if (bmi < 30) {
                category = "overweight";
                message = trans.bmi_result_overweight;
            } else {
                category = "obese";
                message = trans.bmi_result_obese;
            }
            
            document.getElementById("bmi-value").textContent = bmiRounded.toFixed(1);
            document.getElementById("bmi-message").textContent = message;
            
            // Position marker on BMI scale
            const markerPosition = Math.min(Math.max((bmi - 10) * 3, 0), 100);
            document.getElementById("bmi-marker").style.left = `${markerPosition}%`;
            
            document.getElementById("bmi-result").style.display = "block";
            playSound("alert");
        };
    }
});

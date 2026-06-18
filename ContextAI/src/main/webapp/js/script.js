// =====================================
// CONTEXT AI - SCRIPT.JS
// =====================================

let currentContact     = "";
let selectedMessage    = "";
let latestAiResponse   = "";
let currentTranslateAction = "";
let selectionText      = "";
let isLearningMode     = false;
let pressTimer;                        // FIX: was clearTimeout(10000), now correctly scoped

const STYLE_HISTORY_KEY = "contextai_style_history";
const LEARNING_MODE_KEY = "contextai_learning_mode";

// =====================================
// DUMMY CHATS (enriched for demo)
// =====================================

const dummyChats = {

    "Aman": [
        { type: "other", text: "Hey, can you explain API integration?" },
        { type: "me",    text: "Sure, send me the requirements." },
        { type: "other", text: "Bhai REST API ke baare mein baat kar raha tha, Spring Boot mein kaise karte hain yaar?" }
    ],

    "Priya": [
        { type: "other", text: "Let's finish the hackathon presentation today." },
        { type: "other", text: "Sab kuch ready hai? Deadline 6 baje hai yaar!" }
    ],

    "Rahul": [
        { type: "other", text: "Dependency Injection improves loose coupling." },
        { type: "other", text: "Tujhe Spring ke @Autowired ke baare mein pata hai?" }
    ],

    "Aditi": [
        { type: "other", text: "Can you review this message?" },
        { type: "me",    text: "Sure, share it!" },
        { type: "other", text: "Bhai ye bakwaas lag raha hai kya? 😅" }
    ],

    "Shivani": [
        { type: "other", text: "Hackathon starts soon." },
        { type: "other", text: "Ready ho? Aaj toh dhoom machaana hai! 🔥" }
    ],

    "Arjun": [
        { type: "other", text: "Let's make it awesome." },
        { type: "other", text: "Yaar serious ho ja, time kam hai aur kaam zyada." }
    ]
};

// =====================================
// DOMContentLoaded — INIT
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // Restore learning mode from localStorage
    isLearningMode = localStorage.getItem(LEARNING_MODE_KEY) === "true";
    updateLearningModeUI();

    // Send button
    document.getElementById("sendBtn")
            .addEventListener("click", sendMessage);

    // Enter to send (Shift+Enter = new line)
    document.getElementById("messageInput")
            .addEventListener("keypress", function (e) {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });

    // AI menu toggle
    document.getElementById("aiButton")
            .addEventListener("click", function (e) {
                e.stopPropagation();
                const menu = document.getElementById("aiDropdown");
                menu.style.display =
                        menu.style.display === "block" ? "none" : "block";
            });

    // Text selection on chat messages → show mini toolbar
    document.getElementById("chatMessages")
            .addEventListener("mouseup", handleTextSelection);

    // Global click → close popups
    document.addEventListener("click", function (e) {

        const popup     = document.getElementById("messagePopup");
        const aiDropdown = document.getElementById("aiDropdown");
        const aiButton   = document.getElementById("aiButton");
        const toolbar    = document.getElementById("selectionToolbar");

        if (popup && !popup.contains(e.target)) {
            popup.style.display = "none";
        }

        if (aiDropdown && !aiDropdown.contains(e.target)
                && e.target !== aiButton) {
            aiDropdown.style.display = "none";
        }

        if (toolbar
                && !toolbar.contains(e.target)
                && !document.getElementById("chatMessages").contains(e.target)) {
            toolbar.style.display = "none";
        }
    });

    // Contact search filter
    document.getElementById("contactSearch")
            .addEventListener("keyup", function () {
                const val = this.value.toLowerCase();
                document.querySelectorAll(".contact-item").forEach(item => {
                    const name = item.querySelector("h4").innerText.toLowerCase();
                    item.style.display = name.includes(val) ? "flex" : "none";
                });
            });
});

// =====================================
// OPEN CHAT
// =====================================

function openChat(name) {

    currentContact = name;

    document.getElementById("emptyState").style.display   = "none";
    document.getElementById("chatContainer").style.display = "flex";
    document.getElementById("chatUserName").innerText      = name;
    document.getElementById("chatAvatar").innerText        = name.charAt(0);

    loadMessages(name);
}

// =====================================
// LOAD MESSAGES
// =====================================

function loadMessages(contactName) {

    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    const messages = dummyChats[contactName] || [];

    messages.forEach(msg => {

        const div = document.createElement("div");
        div.classList.add("message");

        if (msg.type === "me") {
            div.classList.add("my-message");
        } else {
            div.classList.add("other-message");
            attachClickHandler(div, msg.text);
        }

        div.innerText = msg.text;
        chatMessages.appendChild(div);
    });

    scrollToBottom();
}

// =====================================
// SEND MESSAGE
// =====================================

function sendMessage() {

    const input = document.getElementById("messageInput");
    const text  = input.value.trim();

    if (text === "") return;

    const div = document.createElement("div");
    div.classList.add("message", "my-message");
    div.innerText = text;

    document.getElementById("chatMessages").appendChild(div);

    input.value = "";
    scrollToBottom();

    // Save to learning history
    if (isLearningMode) {
        saveToStyleHistory(text);
    }
}

// =====================================
// SCROLL
// =====================================

function scrollToBottom() {
    const chat = document.getElementById("chatMessages");
    chat.scrollTop = chat.scrollHeight;
}

// =====================================
// CONTEXT HELPER — last N messages
// =====================================

function getLastNMessages(n) {

    const msgEls = document.querySelectorAll("#chatMessages .message");
    const messages = [];
    const start = Math.max(0, msgEls.length - n);

    for (let i = start; i < msgEls.length; i++) {
        const el   = msgEls[i];
        const isMe = el.classList.contains("my-message");
        messages.push({
            sender: isMe ? "Me" : (currentContact || "Other"),
            text:   el.innerText
        });
    }

    return messages;
}

// =====================================
// SMART REPLIES — GENERATE
// =====================================

function generateSmartReplies() {

    const panel = document.getElementById("smartRepliesPanel");
    if (!panel) return;

    const context = getLastNMessages(8);
    if (context.length === 0) return;

    // Append style history hint if learning mode is on
    if (isLearningMode) {
        const history = getStyleHistory();
        if (history.length > 0) {
            context.push({
                sender: "STYLE_HINT",
                text: "User typically writes like: "
                        + history.slice(-5).join(" | ")
            });
        }
    }

    // Show panel with loading state
    panel.style.display = "flex";
    document.getElementById("replyChipsArea").innerHTML =
            "<span class='reply-loading'>✨ Generating smart replies...</span>";

    callAIWithMode("", "reply", context, function (responseText) {

        try {
            // Strip markdown code fences if present
            let cleaned = responseText.trim()
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/,      "")
                    .replace(/\s*```$/,      "")
                    .trim();

            const replies = JSON.parse(cleaned);
            displayReplyChips(replies);

        } catch (err) {
            console.error("Reply JSON parse error:", err, responseText);
            panel.style.display = "none";
            showToast("Couldn't generate replies. Try again.");
        }
    });
}

// =====================================
// SMART REPLIES — DISPLAY CHIPS
// =====================================

function displayReplyChips(replies) {

    const area = document.getElementById("replyChipsArea");
    if (!area) return;

    const config = [
        { key: "polite",  icon: "🤝", label: "Polite"   },
        { key: "savage",  icon: "🔥", label: "Savage"   },
        { key: "funny",   icon: "😂", label: "Funny"    },
        { key: "neutral", icon: "💬", label: "Neutral"  }
    ];

    area.innerHTML = "";

    config.forEach(cfg => {

        const replyText = replies[cfg.key];
        if (!replyText) return;

        const chip = document.createElement("div");
        chip.className = "reply-chip reply-chip-" + cfg.key;
        chip.innerHTML =
                "<span class='chip-label'>"
                        + cfg.icon + " " + cfg.label
                        + "</span>"
                        + "<span class='chip-text'>"
                        + escapeHtml(replyText)
                        + "</span>";

        chip.addEventListener("click", function () {
            document.getElementById("messageInput").value = replyText;
            document.getElementById("messageInput").focus();
            document.querySelectorAll(".reply-chip")
                    .forEach(c => c.classList.remove("chip-selected"));
            chip.classList.add("chip-selected");
        });

        area.appendChild(chip);
    });
}

function refreshSmartReplies() {
    generateSmartReplies();
}

// =====================================
// TEXT SELECTION TOOLBAR
// =====================================

let hideToolbarTimeout;

function handleTextSelection() {

    const selection = window.getSelection();
    const toolbar   = document.getElementById("selectionToolbar");

    if (!toolbar) return;

    if (!selection || selection.toString().trim().length < 2) {
        // Keep it stable for 3 seconds before hiding if selection clears
        if (!hideToolbarTimeout) {
            hideToolbarTimeout = setTimeout(() => {
                toolbar.style.display = "none";
            }, 3000);
        }
        return;
    }

    clearTimeout(hideToolbarTimeout);
    hideToolbarTimeout = null;

    selectionText = selection.toString().trim();

    const range = selection.getRangeAt(0);
    const rect  = range.getBoundingClientRect();

    // Position toolbar above selected text, centered
    const toolbarLeft = rect.left + rect.width / 2 - 100;
    const toolbarTop  = rect.top + window.scrollY - 48;

    toolbar.style.left    = Math.max(10, toolbarLeft) + "px";
    toolbar.style.top     = Math.max(60, toolbarTop)  + "px";
    toolbar.style.display = "flex";
}

function explainSelected() {

    hideSelectionToolbar();

    if (!selectionText) return;

    callAIWithMode(selectionText, "explain", [], function (response) {
        latestAiResponse = response;
        document.getElementById("aiResponseText").innerText = response;
        document.getElementById("aiResponseCard").style.display = "block";
    });
}

function decodeSelectedSlang() {

    hideSelectionToolbar();

    if (!selectionText) return;

    showLoader();

    callAIWithMode(selectionText, "slang", [], function (response) {

        hideLoader();

        try {
            let cleaned = response.trim()
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/,      "")
                    .replace(/\s*```$/,      "")
                    .trim();

            const slangData = JSON.parse(cleaned);
            displaySlangCard(slangData);

        } catch (err) {
            console.error("Slang JSON parse error:", err);
            // Fallback to AI card with raw response
            latestAiResponse = response;
            document.getElementById("aiResponseText").innerText = response;
            document.getElementById("aiResponseCard").style.display = "block";
        }
    });
}

function translateSelected() {

    hideSelectionToolbar();
    selectedMessage = selectionText;
    currentTranslateAction = "selectedMessage";
    document.getElementById("translateModal").style.display = "flex";
}

function hideSelectionToolbar() {
    const toolbar = document.getElementById("selectionToolbar");
    if (toolbar) toolbar.style.display = "none";
}

// =====================================
// SLANG DECODE CARD — DISPLAY
// =====================================

function displaySlangCard(data) {

    const card = document.getElementById("slangDecodeCard");
    if (!card) return;

    document.getElementById("slangWord").innerText =
            data.word || selectionText || "—";

    document.getElementById("slangMeaning").innerText =
            data.meaning || "—";

    document.getElementById("slangCulture").innerText =
            data.cultural_context || "—";

    const intensity = (data.intensity || "mild").toLowerCase();
    const bar       = document.getElementById("slangIntensityBar");
    const label     = document.getElementById("slangIntensityLabel");

    bar.className   = "intensity-bar intensity-" + intensity;
    label.innerText = intensity.charAt(0).toUpperCase() + intensity.slice(1);

    const safeToUse  = data.safe_to_use !== false;
    const safeTag    = document.getElementById("slangSafeTag");

    safeTag.innerText  = safeToUse ? "✅ Safe to use" : "⚠️ Use with caution";
    safeTag.className  = "safe-tag " + (safeToUse ? "safe-yes" : "safe-no");

    card.style.display = "block";
}

function closeSlangCard() {
    const card = document.getElementById("slangDecodeCard");
    if (card) card.style.display = "none";
}

// =====================================
// AI DROPDOWN ACTIONS
// =====================================

function performAiAction(action) {

    document.getElementById("aiDropdown").style.display = "none";

    if (action === "smartreply") {
        generateSmartReplies();
        return;
    }

    const message = document.getElementById("messageInput").value.trim();

    if (message === "") {
        showToast("Please type a message first.");
        return;
    }

    if (action === "translate") {
        currentTranslateAction = "inputTranslate";
        document.getElementById("translateModal").style.display = "flex";
        return;
    }

    callAIWithMode(message, action, [], function (response) {
        latestAiResponse = response;
        document.getElementById("aiResponseText").innerText = response;
        document.getElementById("aiResponseCard").style.display = "block";
    });
}

// =====================================
// TRANSLATE (enhanced + cultural nuance)
// =====================================

function translateTo(language) {

    closeTranslateModal();

    let textToTranslate = "";

    if (currentTranslateAction === "inputTranslate") {
        textToTranslate = document.getElementById("messageInput").value.trim();
    } else {
        textToTranslate = selectedMessage || selectionText;
    }

    if (!textToTranslate) {
        showToast("No text to translate.");
        return;
    }

    // "language|text" format — backend splits on first |
    const prompt = language + "|" + textToTranslate;

    callAIWithMode(prompt, "translate_smart", [], function (response) {
        latestAiResponse = response;
        document.getElementById("aiResponseText").innerText = response;
        document.getElementById("aiResponseCard").style.display = "block";
    });
}

function closeTranslateModal() {
    document.getElementById("translateModal").style.display = "none";
}

// =====================================
// CORE AI CALL — mode-aware
// =====================================

function callAIWithMode(prompt, mode, context, callback) {

    showLoader();

    const body = {
        prompt:  prompt  || "",
        mode:    mode    || "general",
        context: context || []
    };

    fetch("ai", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body)
    })
    .then(r => r.text())
    .then(data => {
        hideLoader();
        if (callback) callback(data);
    })
    .catch(err => {
        hideLoader();
        showToast("AI request failed. Check connection.");
        console.error("AI call error:", err);
    });
}

// Legacy wrapper (backward compat)
function callAI(prompt) {
    callAIWithMode(prompt, "general", [], function (response) {
        latestAiResponse = response;
        document.getElementById("aiResponseText").innerText = response;
        document.getElementById("aiResponseCard").style.display = "block";
    });
}

// =====================================
// AI RESPONSE CARD
// =====================================

function closeAiCard() {
    document.getElementById("aiResponseCard").style.display = "none";
}

function copyAiResponse() {
    navigator.clipboard.writeText(latestAiResponse)
            .then(()  => showToast("✅ Copied to clipboard!"))
            .catch(()  => showToast("Copy failed. Try again."));
}

function sendAiResponse() {

    if (!latestAiResponse) return;

    const div = document.createElement("div");
    div.classList.add("message", "my-message");
    div.innerText = latestAiResponse;

    document.getElementById("chatMessages").appendChild(div);

    if (isLearningMode) {
        saveToStyleHistory(latestAiResponse);
    }

    closeAiCard();
    scrollToBottom();
}

// =====================================
// CLICK HANDLER ON RECEIVED MESSAGES
// (single click shows quick action popup)
// =====================================

function attachClickHandler(element, messageText) {

    element.style.cursor = "pointer";

    element.addEventListener("click", function (e) {
        e.stopPropagation();

        // Don't trigger if user is currently selecting text
        if (window.getSelection().toString().trim().length > 0) return;

        selectedMessage = messageText;

        const popup = document.getElementById("messagePopup");
        popup.style.display = "flex";

        // Position popup near the click
        const x = Math.min(e.pageX, window.innerWidth  - 200);
        const y = Math.min(e.pageY, window.innerHeight - 180);

        popup.style.left = x + "px";
        popup.style.top  = y + "px";
    });
}

// =====================================
// POPUP ACTIONS (long press)
// =====================================

function popupAction(action) {

    document.getElementById("messagePopup").style.display = "none";

    switch (action) {

        case "explain":
            selectionText = selectedMessage;
            callAIWithMode(selectedMessage, "explain", [], function (r) {
                latestAiResponse = r;
                document.getElementById("aiResponseText").innerText = r;
                document.getElementById("aiResponseCard").style.display = "block";
            });
            break;

        case "slang":
            selectionText = selectedMessage;
            decodeSelectedSlang();
            break;

        case "translate":
            currentTranslateAction = "selectedMessage";
            document.getElementById("translateModal").style.display = "flex";
            break;

        case "factcheck":
            callAIWithMode(selectedMessage, "factcheck", [], function (r) {
                latestAiResponse = r;
                document.getElementById("aiResponseText").innerText = r;
                document.getElementById("aiResponseCard").style.display = "block";
            });
            break;

        case "askai":
            document.getElementById("askAiModal").style.display = "flex";
            break;
    }
}

// =====================================
// ASK AI ABOUT MESSAGE
// =====================================

function closeAskAiModal() {
    document.getElementById("askAiModal").style.display = "none";
}

function submitAskAboutMessage() {

    const question = document.getElementById("followupQuestion").value.trim();
    if (question === "") return;

    closeAskAiModal();

    const prompt =
            "Message:\n" + selectedMessage
            + "\n\nQuestion:\n" + question;

    callAIWithMode(prompt, "general", [], function (r) {
        latestAiResponse = r;
        document.getElementById("aiResponseText").innerText = r;
        document.getElementById("aiResponseCard").style.display = "block";
    });

    document.getElementById("followupQuestion").value = "";
}

// =====================================
// LEARNING MODE
// =====================================

function toggleLearningMode() {

    isLearningMode = !isLearningMode;
    localStorage.setItem(LEARNING_MODE_KEY, isLearningMode);
    updateLearningModeUI();

    showToast(
        isLearningMode
            ? "📚 Learning Mode ON — replies will match your style!"
            : "Learning Mode OFF"
    );
}

function updateLearningModeUI() {

    const toggle = document.getElementById("learningToggle");
    const badge  = document.getElementById("learningBadge");

    if (toggle) toggle.classList.toggle("active", isLearningMode);
    if (badge)  badge.style.display = isLearningMode ? "inline-flex" : "none";
}

function saveToStyleHistory(text) {

    const history = getStyleHistory();
    history.push(text);

    // Keep last 20 messages
    if (history.length > 20) history.splice(0, history.length - 20);

    localStorage.setItem(STYLE_HISTORY_KEY, JSON.stringify(history));
}

function getStyleHistory() {
    try {
        return JSON.parse(
            localStorage.getItem(STYLE_HISTORY_KEY) || "[]"
        );
    } catch {
        return [];
    }
}

// =====================================
// TOAST NOTIFICATION
// =====================================

function showToast(message) {

    let toast = document.getElementById("toastNotification");

    if (!toast) {
        toast = document.createElement("div");
        toast.id        = "toastNotification";
        toast.className = "toast-notification";
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.classList.add("toast-show");

    setTimeout(() => toast.classList.remove("toast-show"), 2800);
}

// =====================================
// LOADER
// =====================================

function showLoader() {
    document.getElementById("loaderOverlay").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loaderOverlay").style.display = "none";
}

// =====================================
// CONTACT SEARCH
// =====================================

document.getElementById("contactSearch")
        .addEventListener("keyup", function () {
            const val = this.value.toLowerCase();
            document.querySelectorAll(".contact-item").forEach(item => {
                const name = item.querySelector("h4").innerText.toLowerCase();
                item.style.display = name.includes(val) ? "flex" : "none";
            });
        });

// =====================================
// UTILITY
// =====================================

function escapeHtml(text) {
    return text
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;")
        .replace(/'/g,  "&#039;");
}

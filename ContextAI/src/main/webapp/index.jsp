<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

    <!DOCTYPE html>

    <html>

    <head>
        <meta charset="UTF-8">
        <title>ContextAI - AI Communication Layer</title>

        <link rel="stylesheet" href="css/style.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

    <body>

        <div class="background-blur"></div>

        <div class="app-container">

            <!-- SIDEBAR -->
            <div class="sidebar">

                <div class="sidebar-header">

                    <div class="profile-section">
                        <div class="profile-avatar">
                            <i class="fas fa-user"></i>
                        </div>

                        <div class="profile-info">
                            <h3>You</h3>
                            <span class="online-dot"></span>
                            <span class="online-text">Online</span>
                        </div>
                    </div>
                </div>

                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="contactSearch" placeholder="Search contact">
                </div>

                <div class="contacts-list">

                    <div class="contact-item" onclick="openChat('Aman')">

                        <div class="contact-avatar">A</div>

                        <div class="contact-details">
                            <h4>Aman</h4>
                            <p>Bhai, kal ke match ka score kya tha...</p>
                        </div>

                        <div class="contact-meta">
                            <span class="msg-count">3</span>
                        </div>

                    </div>

                    <div class="contact-item" onclick="openChat('Priya')">

                        <div class="contact-avatar">P</div>

                        <div class="contact-details">
                            <h4>Priya</h4>
                            <p>What is the weather forecast for Pari...</p>
                        </div>

                        <div class="contact-meta">
                            <span class="msg-count">5</span>
                        </div>

                    </div>

                    <div class="contact-item" onclick="openChat('Rahul')">

                        <div class="contact-avatar">R</div>

                        <div class="contact-details">
                            <h4>Rahul</h4>
                            <p>Was sind die genauen Zutaten fü.../p>
                        </div>

                        <div class="contact-meta">
                            <span class="msg-count">2</span>
                        </div>

                    </div>

                    <div class="contact-item" onclick="openChat('Aditi')">

                        <div class="contact-avatar">A</div>

                        <div class="contact-details">
                            <h4>Aditi</h4>
                            <p>¿A qué hora comienza el festival de mús</p>
                        </div>

                        <div class="contact-meta">
                            <span class="msg-count">1</span>
                        </div>

                    </div>

                    <div class="contact-item" onclick="openChat('Shivani')">

                        <div class="contact-avatar">S</div>

                        <div class="contact-details">
                            <h4>Shivani</h4>
                            <p>वजन घटाने के लिए सबसे अच्छा डाइट प्लान...</p>
                        </div>

                        <div class="contact-meta">
                            <span class="msg-count">4</span>
                        </div>

                    </div>

                    <div class="contact-item" onclick="openChat('Arjun')">

                        <div class="contact-avatar">A</div>

                        <div class="contact-details">
                            <h4>Arjun</h4>
                            <p>म्युच्युअल फंड (Mutual Funds) मध्ये थेट...</p>
                        </div>

                        <div class="contact-meta">
                            <span class="msg-count">2</span>
                        </div>

                    </div>

                </div>

            </div>

            <!-- CHAT AREA -->
            <div class="chat-section">

                <!-- EMPTY STATE -->
                <div id="emptyState" class="empty-state">

                    <div class="empty-icon">
                        <i class="fas fa-comments"></i>
                    </div>

                    <h2>ContextAI</h2>

                    <p>
                        AI Communication Layer for Future Messaging
                    </p>

                    <span>
                        Select a contact to start chatting
                    </span>

                </div>

                <!-- ACTIVE CHAT -->
                <div id="chatContainer" class="chat-container">

                    <!-- CHAT HEADER -->
                    <div class="chat-header">

                        <div class="chat-user">

                            <div class="chat-user-avatar" id="chatAvatar">
                                A
                            </div>

                            <div>
                                <h3 id="chatUserName">
                                    Aman
                                </h3>

                                <span class="chat-status">
                                    Online
                                </span>
                            </div>

                        </div>

                    </div>

                    <!-- MESSAGES -->
                    <div id="chatMessages" class="chat-messages">

                    </div>

                    <!-- AI FLOATING RESPONSE -->
                    <div id="aiResponseCard" class="ai-response-card">

                        <div class="ai-header">

                            <div>
                                ⚡ AI Response
                            </div>

                            <button onclick="closeAiCard()">
                                ×
                            </button>

                        </div>

                        <div id="aiResponseText" class="ai-response-text">
                        </div>

                        <div class="ai-actions">

                            <button onclick="copyAiResponse()">
                                Copy
                            </button>

                            <button onclick="sendAiResponse()">
                                Send
                            </button>

                        </div>

                    </div>

                    <!-- SLANG DECODE CARD -->
                    <div id="slangDecodeCard" class="slang-decode-card" style="display:none;">

                        <div class="slang-header">
                            <span>🔍 Slang Decoder</span>
                            <button onclick="closeSlangCard()">×</button>
                        </div>

                        <div class="slang-word" id="slangWord">word</div>

                        <div class="slang-section">
                            <span class="slang-label">Meaning</span>
                            <p id="slangMeaning">—</p>
                        </div>

                        <div class="slang-section">
                            <span class="slang-label">Cultural Context</span>
                            <p id="slangCulture">—</p>
                        </div>

                        <div class="slang-intensity-row">
                            <span class="slang-label">Intensity</span>
                            <div class="intensity-track">
                                <div id="slangIntensityBar" class="intensity-bar intensity-mild"></div>
                            </div>
                            <span id="slangIntensityLabel">Mild</span>
                        </div>

                        <div>
                            <span id="slangSafeTag" class="safe-tag safe-yes">✅ Safe to use</span>
                        </div>

                    </div>

                    <!-- INPUT -->
                    <div class="chat-input-area">

                        <div class="input-wrapper">

                            <textarea id="messageInput" placeholder="Type a message..." rows="1"></textarea>

                            <!-- AI BUTTON -->
                            <div class="ai-menu-wrapper">

                                <button id="aiButton" class="ai-button">
                                    ⚡
                                </button>

                                <div id="aiDropdown" class="ai-dropdown">

                                    <div onclick="performAiAction('askai')">
                                        Ask AI
                                    </div>

                                    <div onclick="performAiAction('grammar')">
                                        Grammar
                                    </div>

                                    <div onclick="performAiAction('formal')">
                                        Formal
                                    </div>

                                    <div onclick="performAiAction('translate')">
                                        Translate
                                    </div>

                                    <div onclick="performAiAction('shorten')">
                                        Shorten
                                    </div>

                                    <div onclick="performAiAction('factcheck')">
                                        Fact Check
                                    </div>

                                </div>

                            </div>

                            <button id="sendBtn" class="send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        <!-- TRANSLATE POPUP -->

        <div id="translateModal" class="modal">

            <div class="modal-content">

                <h3>Select Language</h3>

                <button onclick="translateTo('Hinglish')">
                    Hinglish 🇮🇳
                </button>

                <button onclick="translateTo('Hindi')">
                    Hindi
                </button>

                <button onclick="translateTo('English')">
                    English
                </button>

                <button onclick="translateTo('French')">
                    French
                </button>

                <button onclick="translateTo('German')">
                    German
                </button>

                <button onclick="translateTo('Spanish')">
                    Spanish
                </button>

                <button onclick="translateTo('Marathi')">
                    Marathi
                </button>

                <button class="close-modal" onclick="closeTranslateModal()">
                    Cancel
                </button>

            </div>

        </div>

        <!-- LONG PRESS POPUP -->

        <div id="messagePopup" class="message-popup">

            <div onclick="popupAction('askai')">
                🤖 Ask AI
            </div>

            <div onclick="popupAction('factcheck')">
                ✅ Fact Check
            </div>

            <div onclick="popupAction('explain')">
                💡 Explain
            </div>

            <div onclick="popupAction('translate')">
                🌐 Translate
            </div>

        </div>

        <!-- ASK AI ABOUT MESSAGE -->

        <div id="askAiModal" class="modal">

            <div class="modal-content">

                <h3>Ask AI About This Message</h3>

                <textarea id="followupQuestion" placeholder="Example: Explain in Hindi"></textarea>

                <button onclick="submitAskAboutMessage()">
                    Ask
                </button>

                <button class="close-modal" onclick="closeAskAiModal()">
                    Cancel
                </button>

            </div>

        </div>

        <!-- LOADER -->

        <div id="loaderOverlay" class="loader-overlay">

            <div class="loader"></div>

        </div>

        <script src="js/script.js"></script>

    </body>

    </html>
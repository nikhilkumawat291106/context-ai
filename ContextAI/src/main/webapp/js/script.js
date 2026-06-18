// =====================================
// CONTEXT AI - SCRIPT.JS
// =====================================

let currentContact = "";
let selectedMessage = "";
let latestAiResponse = "";
let currentTranslateAction = "";

const dummyChats = {

"Aman": [
    {
        type: "other",
        text: "Hey, can you explain API integration?"
    },
    {
        type: "me",
        text: "Sure, send me the requirements."
    }
],

"Priya": [
    {
        type: "other",
        text: "Let's finish the hackathon presentation today."
    }
],

"Rahul": [
    {
        type: "other",
        text: "Dependency Injection improves loose coupling."
    }
],

"Aditi": [
    {
        type: "other",
        text: "Can you review this message?"
    }
],

"Shivani": [
    {
        type: "other",
        text: "Hackathon starts soon."
    }
],

"Arjun": [
    {
        type: "other",
        text: "Let's make it awesome."
    }
]

};

// =====================================
// OPEN CHAT
// =====================================

function openChat(name) {

currentContact = name;

document.getElementById("emptyState").style.display = "none";

document.getElementById("chatContainer").style.display = "flex";

document.getElementById("chatUserName").innerText = name;

document.getElementById("chatAvatar").innerText =
        name.charAt(0);

loadMessages(name);

}

// =====================================
// LOAD CHAT
// =====================================

function loadMessages(contactName) {

const chatMessages =
        document.getElementById("chatMessages");

chatMessages.innerHTML = "";

const messages =
        dummyChats[contactName] || [];

messages.forEach(msg => {

    const div =
            document.createElement("div");

    div.classList.add("message");

    if (msg.type === "me") {

        div.classList.add("my-message");

    } else {

        div.classList.add("other-message");

        attachLongPress(div, msg.text);
    }

    div.innerText = msg.text;

    chatMessages.appendChild(div);

});

scrollToBottom();

}

// =====================================
// SEND MESSAGE
// =====================================

document.addEventListener("DOMContentLoaded", function () {

document.getElementById("sendBtn")
        .addEventListener("click",
                sendMessage);

document.getElementById("messageInput")
        .addEventListener("keypress",
                function (e) {

                    if (e.key === "Enter" &&
                            !e.shiftKey) {

                        e.preventDefault();

                        sendMessage();
                    }
                });

});

// =====================================

function sendMessage() {

const input =
        document.getElementById("messageInput");

const text =
        input.value.trim();

if (text === "")
    return;

const message =
        document.createElement("div");

message.classList.add(
        "message",
        "my-message"
);

message.innerText = text;

document.getElementById("chatMessages")
        .appendChild(message);

input.value = "";

scrollToBottom();

}

// =====================================
// SCROLL
// =====================================

function scrollToBottom() {

const chat =
        document.getElementById("chatMessages");

chat.scrollTop = chat.scrollHeight;

}

// =====================================
// AI MENU
// =====================================

document.getElementById("aiButton")
.addEventListener("click",
function () {

                const menu =
                        document.getElementById(
                                "aiDropdown"
                        );

                menu.style.display =
                        menu.style.display === "block"
                                ? "none"
                                : "block";
            });

// =====================================
// AI ACTIONS
// =====================================

function performAiAction(action) {

document.getElementById("aiDropdown")
        .style.display = "none";

const message =
        document.getElementById(
                "messageInput"
        ).value.trim();

if (message === "") {

    alert(
            "Please type a message first."
    );

    return;
}

if (action === "translate") {

    currentTranslateAction =
            "inputTranslate";

    document.getElementById(
            "translateModal"
    ).style.display = "flex";

    return;
}

let prompt = "";

switch (action) {

    case "askai":
        prompt = message;
        break;

    case "grammar":
        prompt =
                "Correct grammar only:\n\n"
                        + message;
        break;

    case "formal":
        prompt =
                "Convert into formal professional message:\n\n"
                        + message;
        break;

    case "shorten":
        prompt =
                "Shorten this message:\n\n"
                        + message;
        break;

    case "factcheck":
        prompt =
                "Fact Check this statement and answer in format:\nTrue/False/Partially True\nOne line explanation\n\n"
                        + message;
        break;
}

callAI(prompt);

}

// =====================================
// TRANSLATE
// =====================================

function translateTo(language) {

closeTranslateModal();

let prompt = "";

if (currentTranslateAction ===
        "inputTranslate") {

    const text =
            document.getElementById(
                    "messageInput"
            ).value;

    prompt =
            "Translate into "
                    + language
                    + ":\n\n"
                    + text;

} else {

    prompt =
            "Translate into "
                    + language
                    + ":\n\n"
                    + selectedMessage;
}

callAI(prompt);

}

function closeTranslateModal() {

document.getElementById(
        "translateModal"
).style.display = "none";

}

// =====================================
// AI CALL
// =====================================

function callAI(prompt) {
showLoader();

fetch("ai", {

    method: "POST",

    headers: {
        "Content-Type":
                "application/json"
    },

    body: JSON.stringify({
        prompt: prompt
    })

})

        .then(response =>
                response.text()
        )

        .then(data => {

            hideLoader();

            latestAiResponse = data;

            document.getElementById(
                    "aiResponseText"
            ).innerText = data;

            document.getElementById(
                    "aiResponseCard"
            ).style.display = "block";

        })

        .catch(error => {

            hideLoader();

            alert(
                    "AI Request Failed"
            );

            console.error(error);
        });

}

// =====================================
// AI CARD
// =====================================

function closeAiCard() {

document.getElementById(
        "aiResponseCard"
).style.display = "none";

}

function copyAiResponse() {

navigator.clipboard.writeText(
        latestAiResponse
);

alert("Copied");

}

function sendAiResponse() {

if (latestAiResponse === "")
    return;

const div =
        document.createElement("div");

div.classList.add(
        "message",
        "my-message"
);

div.innerText =
        latestAiResponse;

document.getElementById(
        "chatMessages"
).appendChild(div);

closeAiCard();

scrollToBottom();

}

// =====================================
// LONG PRESS
// =====================================

let pressTimer;

function attachLongPress(
element,
messageText
) {

element.addEventListener(
        "mousedown",
        function (e) {

            pressTimer =
                    setTimeout(
                            function () {

                                selectedMessage =
                                        messageText;

                                const popup =
                                        document.getElementById(
                                                "messagePopup"
                                        );

                                popup.style.display =
                                        "flex";

                                popup.style.left =
                                        e.pageX
                                                + "px";

                                popup.style.top =
                                        e.pageY
                                                + "px";

                            },
                            500
                    );
        }
);

element.addEventListener(
        "mouseup",
        function () {

            clearTimeout(
                    10000
            );
        }
);

element.addEventListener(
        "mouseleave",
        function () {

            clearTimeout(
                    10000
            );
        }
);

}

// =====================================
// POPUP ACTIONS
// =====================================

function popupAction(action) {


document.getElementById(
        "messagePopup"
).style.display = "none";

switch (action) {

    case "explain":

        callAI(
                "Explain in simple words:\n\n"
                        + selectedMessage
        );

        break;

    case "translate":

        currentTranslateAction =
                "selectedMessage";

        document.getElementById(
                "translateModal"
        ).style.display = "flex";

        break;

    case "factcheck":

        callAI(
                "Fact Check this statement:\n\n"
                        + selectedMessage
        );

        break;

    case "askai":

        document.getElementById(
                "askAiModal"
        ).style.display = "flex";

        break;
}


}

// =====================================
// ASK AI ABOUT MESSAGE
// =====================================

function closeAskAiModal() {


document.getElementById(
        "askAiModal"
).style.display = "none";


}

function submitAskAboutMessage() {

const question =
        document.getElementById(
                "followupQuestion"
        ).value.trim();

if (question === "")
    return;

closeAskAiModal();

const prompt =
        "Message:\n"
                + selectedMessage
                + "\n\nQuestion:\n"
                + question;

callAI(prompt);

document.getElementById(
        "followupQuestion"
).value = "";

}

// =====================================
// CLOSE POPUPS ON OUTSIDE CLICK
// =====================================

document.addEventListener(
"click",
function (e) {

        const popup =
                document.getElementById(
                        "messagePopup"
                );

        if (
                !popup.contains(
                        e.target
                )
        ) {

            popup.style.display =
                    "none";
        }
    }

);

// =====================================
// LOADER
// =====================================

function showLoader() {
document.getElementById(
        "loaderOverlay"
).style.display = "flex";

}

function hideLoader() {

document.getElementById(
        "loaderOverlay"
).style.display = "none";

}

// =====================================
// CONTACT SEARCH
// =====================================

document.getElementById(
"contactSearch"
).addEventListener(
"keyup",
function () {
        const value =
                this.value
                        .toLowerCase();

        const contacts =
                document.querySelectorAll(
                        ".contact-item"
                );

        contacts.forEach(
                item => {

                    const name =
                            item.querySelector(
                                    "h4"
                            )
                                    .innerText
                                    .toLowerCase();

                    item.style.display =
                            name.includes(
                                    value
                            )
                                    ? "flex"
                                    : "none";
                }
        );
    }

);

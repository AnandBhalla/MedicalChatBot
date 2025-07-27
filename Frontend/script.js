let chatMessages, messageInput, sendButton, audioButton;
const apiUrl = 'http://localhost:8000/chat';

document.addEventListener('DOMContentLoaded', () => {
    chatMessages = document.getElementById('chatMessages');
    messageInput = document.getElementById('messageInput');
    sendButton = document.getElementById('sendButton');
    audioButton = document.getElementById('audioButton');

    initializeEventListeners();
});

function initializeEventListeners() {
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    audioButton.addEventListener('click', () => {
        showMessage('Audio feature coming soon!', 'error');
    });
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, 'patient');
    messageInput.value = '';
    showTypingIndicator();

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        hideTypingIndicator();

        addMessage(data.response || 'I apologize, but I couldn\'t process your request right now.', 'doctor');

    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'doctor');
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = sender === 'patient' ? 'You' : 'Dr';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message doctor';
    typingDiv.id = 'typingIndicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = 'Dr';

    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    typingContent.style.display = 'block';

    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        dotsDiv.appendChild(dot);
    }

    typingContent.appendChild(dotsDiv);
    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(typingContent);

    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `error-message`;
    messageDiv.textContent = message;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

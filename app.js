let chatCounter = 1;
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatList = document.getElementById('chat-list');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
let currentChat = null;

// Ensure elements are fetched correctly before adding event listeners
toggleDarkModeButton.addEventListener('click', toggleDarkMode);
document.getElementById('send-message').addEventListener('click', sendMessage);
document.getElementById('add-new-chat').addEventListener('click', addNewChat);
document.getElementById('pdf-upload').addEventListener('change', handlePDFUpload);

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        appendMessage('user', userMessage);
        userInput.value = '';
        getMarketingRecommendation(userMessage);
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('p-4', 'rounded-lg', 'shadow', 'max-w-md');
    messageElement.classList.add(sender === 'user' ? 'bg-blue-100 self-end dark:bg-blue-700' : 'bg-gray-100 self-start dark:bg-gray-700');
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getMarketingRecommendation(projectInfo) {
    appendMessage('ai', 'Thinking...');

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are an AI assistant that generates marketing recommendations.' },
                    { role: 'user', content: `Generate marketing recommendations for the following project:\n${projectInfo}` }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        const recommendation = data.choices[0].message.content.trim();

        // Update AI's "Thinking..." message
        const aiMessages = document.querySelectorAll('.self-start');
        const lastAiMessage = aiMessages[aiMessages.length - 1];
        lastAiMessage.innerText = recommendation;
    } catch (error) {
        console.error('Error fetching marketing recommendation:', error);
        const aiMessages = document.querySelectorAll('.self-start');
        const lastAiMessage = aiMessages[aiMessages.length - 1];
        lastAiMessage.innerText = 'Failed to generate marketing recommendations. Please try again.';
    }
}

function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        toggleDarkModeButton.innerText = 'Light Mode';
    } else {
        document.documentElement.classList.add('dark');
        toggleDarkModeButton.innerText = 'Dark Mode';
    }
}

function addNewChat() {
    const chatId = `chat-${chatCounter++}`;
    const newChat = document.createElement('div');
    newChat.classList.add('flex', 'justify-between', 'items-center', 'p-2', 'bg-gray-200', 'dark:bg-gray-700', 'rounded-md', 'cursor-pointer', 'hover:bg-gray-300', 'dark:hover:bg-gray-600');
    newChat.innerHTML = `
    <span onclick="switchChat('${chatId}')" class="flex-1">${chatId}</span>
    <button onclick="deleteChat('${chatId}')" class="ml-2 text-red-500">Delete</button>
  `;
    newChat.id = chatId;
    chatList.appendChild(newChat);
    switchChat(chatId);
}

function switchChat(chatId) {
    const confirmation = currentChat ? confirm(`Switch to ${chatId}? All unsent messages will be lost.`) : true;
    if (confirmation) {
        chatBox.innerHTML = '';
        currentChat = chatId;
        appendMessage('system', `Switched to ${chatId}`);
    }
}

function deleteChat(chatId) {
    const chatElement = document.getElementById(chatId);
    if (chatElement) {
        const confirmation = confirm(`Are you sure you want to delete ${chatId}?`);
        if (confirmation) {
            chatElement.remove();
            if (currentChat === chatId) {
                chatBox.innerHTML = '';
                currentChat = null;
            }
        }
    }
}

async function handlePDFUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const text = await extractTextFromPDF(pdfDoc);
        appendMessage('user', text);
        getMarketingRecommendation(text);
    } else {
        alert('Please upload a valid PDF file.');
    }
}

async function extractTextFromPDF(pdfDoc) {
    const pages = pdfDoc.getPages();
    let text = '';
    for (const page of pages) {
        const pageText = await page.getTextContent();
        text += pageText.items.map(item => item.str).join(' ');
    }
    return text;
}

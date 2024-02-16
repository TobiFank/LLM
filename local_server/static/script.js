document.addEventListener('DOMContentLoaded', (event) => {
    fetchChatHistory(); // This should already be in place based on your provided code
});

document.getElementById('send-button').addEventListener('click', function() {
    const inputElement = document.getElementById('chat-input');
    const messageContent = inputElement.value.trim();

    if (!messageContent) {
        return;
    }

    // Handling system command
    if (messageContent.startsWith('/system')) {
        const systemMessageContent = messageContent.substring(7); // Extract the actual message
        fetch('/update-system-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"content": systemMessageContent}),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('chat-output').innerHTML = ''; // Clear the chat output
            // Update chat with server response
            data.forEach(message => {
                updateChat(message);
            });
        })
        .catch(error => console.error('Error:', error));
    } else {
        // Normal message sending logic
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"role": "user", "content": messageContent}),
        })
        .then(handleResponse)
        .catch(handleError);
    }

    inputElement.value = ''; // Clear input field after sending
});

function handleResponse(response) {
    return response.json().then(data => {
        document.getElementById('chat-output').innerHTML = ''; // Clear the chat output
        // Update chat with server response
        data.forEach(message => {
            updateChat(message);
        });
    });
}

function handleError(error) {
    console.error('Error:', error);
}


function updateChat(message, messageId) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.id = `message-${messageId}`; // Unique identifier for each message

    // Set the class based on the role of the message
    messageDiv.classList.add(`${message.role}-message`);

    messageDiv.textContent = message.content;

    // Add click event listener for editing
    if (message.role === "user") { // Assuming you want to make only user messages editable
        messageDiv.addEventListener('click', function() {
            const newText = prompt("Edit your message:", message.content);
            if (newText !== null && newText.trim() !== "") {
                // Here you would send the updated text back to the server
                // For demonstration, we'll just update the frontend
                messageDiv.textContent = newText;
                message.content = newText; // Update the message content locally
                // Implement a fetch call to update the backend here
            }
        });
    }

    chatOutput.appendChild(messageDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

document.getElementById('new-chat-button').addEventListener('click', function() {
    fetch('/reset', { // Assuming you have a '/reset' endpoint to reset the chat
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('chat-output').innerHTML = ''; // Clear the chat output
        // Repopulate chat with the initial system message from the server response
        data.forEach(message => {
            updateChat(message);
        });
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default action to avoid submitting a form if any
        document.getElementById('send-button').click(); // Trigger the send button click
    }
});

function fetchChatHistory() {
    fetch('/') // Assuming this endpoint returns the current chat including the initial system message
    .then(response => response.json())
    .then(data => {
        document.getElementById('chat-output').innerHTML = ''; // Clear the chat output
        data.forEach(message => {
            updateChat(message);
        });
    })
    .catch(error => console.error('Error:', error));
}

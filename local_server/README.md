# Rudimentary Chat-Interface for ShieldGPT Project

README of a rudimentary Chat-UI to test out some models for the ShieldGPT Project. This document outlines the steps needed to set up and start using the chat interface that integrates with Hugging Face's models library.

## Setup Instructions

Follow these steps to get the chat interface up and running:

### 1. Install Dependencies

First, you need to install the necessary dependencies. Open your terminal and execute the following command:

```shell
poetry install
```

Then to create a virtual environment type:

```shell
poetry shell
```

### 2. Start the Server
After the dependencies are installed, navigate to the local_server directory and start the application by running:

```shell
cd local_server
python app.py
```

### 3. Model Selection
Once the server is running, you can specify any model name from the Hugging Face models library in the terminal. Note that the model will be downloaded to your local machine. Model sizes can be significant, often amounting to approximately 1.5 times the model's parameter count in bytes. Make sure you have enough storage space available. By default i.e. if left empty "HuggingFaceH4/zephyr-7b-beta" will be loaded.

The models are by default loaded in 4bit, double quantized, taking up less VRAM and increasing inference speed at the cost of a slight output quality decrease.

### 4. Access the Chat Interface
To access the chat interface, open a web browser and navigate to:

```shell
localhost:5000
```

5. Start a New Chat
   Click on "New Chat" to begin interacting with the chosen model.

6. Customizing System Messages
   To change the system message, type /system followed by your message in the chat interface.

```shell
/system Act as a knowledgeable and helpful customer support assistant for Microsoft products. Your responses should be polite, concise, and informative, aiming to resolve common software issues, provide product information, and guide users through troubleshooting steps. For queries outside your knowledge base, suggest contacting human support or visiting the official Microsoft support website. Always prioritize user satisfaction and clarity in your explanations. Avoid technical jargon unless the user demonstrates familiarity with it. Handle queries related to Office applications, Windows operating systems, account management, and general product inquiries.
```


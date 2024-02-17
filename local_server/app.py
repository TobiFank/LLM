import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline, BitsAndBytesConfig
from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

# Load the model and tokenizer
model_name = input("Enter Model Name, default HuggingFaceH4/zephyr-7b-beta: ")
if model_name == "":
    model_name = "HuggingFaceH4/zephyr-7b-beta"

quantized = input("Enter 1 for quantized model, 0 for non-quantized model, default 1: ")
if quantized == "1" or quantized == "":
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type='nf4'
    )
    base_model = AutoModelForCausalLM.from_pretrained(model_name,
                                                      device_map="auto",
                                                      torch_dtype=torch.bfloat16,
                                                      trust_remote_code=True,
                                                      quantization_config=quantization_config,
                                                      low_cpu_mem_usage=True
                                                      )
else:
    base_model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto", torch_dtype=torch.bfloat16, trust_remote_code=True)

tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True, trust_remote_code=True)
pipe = pipeline("conversational", model=base_model, tokenizer=tokenizer, torch_dtype=torch.bfloat16, device_map="auto")

initial_system_message = {"role": "system", "content": "As a support agent, your role is to assist users with their inquiries and issues in a manner that is both efficient and empathetic. You are the human touchpoint for our users, offering guidance, solving problems, and providing information tailored to their needs. Your responses should be clear, concise, and structured to facilitate understanding and resolution. Begin with a greeting, confirm understanding of the issue, provide a step-by-step solution or guidance, and conclude with an invitation for further questions. Always maintain a professional and friendly tone, ensuring the user feels heard and supported. When responding, kindly ask users to provide specific details about their issue, such as the context, error messages, and what troubleshooting steps, if any, they have already taken. This will enable you to offer the most effective assistance. Remember, your goal is to solve problems efficiently while ensuring the user feels valued and satisfied with the support experience."}

chat = [initial_system_message]


# Define a function for the '/' route
@app.route('/', methods=['POST'])
def generate_text():
    # Get the input from the request
    global chat
    input = request.json
    chat.append(input)

    global pipe
    global tokenizer
    pipe(chat, max_length=2048, do_sample=True, temperature=0.7)

    print(chat)
    # Generate a response
    return jsonify(chat)


@app.route('/update-system-message', methods=['POST'])
def update_system_message():
    global chat, initial_system_message
    data = request.json
    system_message_content = data.get("content")
    # Update the initial system message content
    initial_system_message["content"] = system_message_content
    # Optionally, find and update the system message in the chat history if it exists
    for message in chat:
        if message["role"] == "system":
            message["content"] = system_message_content
            break
    return jsonify(chat)


@app.route('/reset', methods=['POST'])
def reset_chat():
    global chat
    # Reset chat to only contain the initial system message
    chat = [initial_system_message.copy()]  # Use copy to avoid modifying the original dict
    return jsonify(chat)

@app.route('/')
def home():
    return render_template('index.html')

# Run the app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

from dotenv import load_dotenv
import os
from nylas import Client
from flask import Flask, request, redirect, jsonify, session, render_template_string
from nylas.models.auth import URLForAuthenticationConfig
from nylas.models.auth import CodeExchangeRequest
from bs4 import BeautifulSoup

import json
import requests

from flask_cors import CORS

load_dotenv()

nylas_config = {
    "client_id": os.getenv("NYLAS_CLIENT_ID"),
    "callback_uri": "http://127.0.0.1:5000/oauth/exchange",
    "api_key": os.getenv("NYLAS_API_KEY"),
    "api_uri": os.getenv("NYLAS_API_URI"),
    "grant_id": os.getenv("NYLAS_GRANT_ID"), # Nylas gives back an auth id after a user authenticate with an account
}

nylas = Client(
    api_key=nylas_config["api_key"],
    api_uri=nylas_config["api_uri"],
)

app = Flask(__name__)
port = 5000
CORS(app)

@app.route("/nylas/recent-threads", methods=["GET", "POST"])
def recent_threads():
  folder_id = request.args.get('folderID', 'INBOX')
  page = request.args.get('page', '')

  query_params = {
    "limit": 5,
    "in": folder_id,
    "page_token": page,
  }

  try:
    threads = nylas.threads.list(
      nylas_config["grant_id"],
      query_params,
    )

    return jsonify(threads)
  except Exception as e:
    return f'{e}'
  
@app.route("/nylas/get-thread", methods=["GET", "POST"])
def get_thread():
  id = request.args.get('id', '')

  try:
    thread = nylas.threads.find(
      nylas_config["grant_id"],
      id,
    )

    return jsonify(thread)
  except Exception as e:
    return f'{e}'
  
@app.route("/nylas/get-email", methods=["GET", "POST"])
def get_email():
  id = request.args.get('id', '')

  try:
    message = nylas.messages.find(
      nylas_config["grant_id"],
      id,
    )

    return jsonify(message)
  except Exception as e:
    return f'{e}'
  
@app.route("/nylas/get_folders", methods=["GET"])
def get_folders():
  try: 
    folders = nylas.folders.list(
        nylas_config["grant_id"]
    )

    return jsonify(folders)
  except Exception as e:
    return f'{e}'

@app.route('/process', methods=['POST'])
def process_data():
    # Get JSON data from the request
    data = request.json
    input_text = data.get('text', '')

    # Example processing: Reverse the input text
    processed_text = BeautifulSoup(input_text, 'html.parser').get_text()

    # Send back the processed data
    return jsonify({'processed_text': processed_text})

@app.route('/render_html')
def render_html():
    body = "request.args.get('body', '')"
    # Render the HTML content
    return render_template_string(body)

# Main
if __name__ == "__main__":
    app.run(port=port, debug=True)
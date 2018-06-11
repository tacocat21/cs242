from flask import Flask, request, abort, render_template, jsonify, send_from_directory
from src.web_frontend.frontend_server import view
from src.api_server.api_server import api
import os


ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
TEMPLATE_DIR = os.path.abspath('./src/web_frontend/')
STATIC_DIR = os.path.abspath('./src/web_frontend/')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.register_blueprint(view)
app.register_blueprint(api, url_prefix='/api')


if __name__ == "__main__":
    app.run()

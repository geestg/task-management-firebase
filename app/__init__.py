from flask import Flask
from flask_cors import CORS
from app.routes.tasks import task_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # ⬅️ PENTING
    app.register_blueprint(task_bp)
    return app

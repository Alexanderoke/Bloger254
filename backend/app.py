import os

from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException

import db
import posts


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, "blog.sqlite"),
        CORS_ORIGINS={
            "http://localhost:55173",
            "http://127.0.0.1:55173",
            "http://localhost:55173",
            "http://127.0.0.1:55173",
        },
    )
    if test_config:
        app.config.update(test_config)

    os.makedirs(app.instance_path, exist_ok=True)
    db.init_app(app)
    app.register_blueprint(posts.bp)

    @app.get("/")
    def index():
        return jsonify({"message": "Blog API is running", "posts": "/api/posts"})

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin in app.config["CORS_ORIGINS"]:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        return response

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return jsonify({"error": error.name, "message": error.description}), error.code

    return app


if __name__ == "__main__":
    create_app().run(debug=True)

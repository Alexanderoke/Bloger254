from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
  return "<p>Hello, Hello, Hello, Dunia, I apease the programming gods, hello world!!</p>"
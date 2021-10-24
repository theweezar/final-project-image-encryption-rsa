from flask import Flask, request, make_response, jsonify
from Crypto.PublicKey import RSA
from flask_cors import CORS
import FileHelpers

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "<p>Hello, World!</p>"

@app.route("/getkey", methods = ["GET"])
def get_key():
    key_length_bits = request.args["key-length-bits"]
    key = RSA.generate(key_length_bits)
    public_key = key.publickey().exportKey("DER")
    private_key = key.exportKey("DER")

@app.route("/upload_encrypt", methods = ["POST"])
def upload_encrypt():
    files = request.files.getlist("file[]")
    app.logger.info(files)
    for file in files:
        FileHelpers.write_bin(file.filename, file.stream.read())
    res = make_response(
        jsonify(
            {
                "success" : True,
                "file_count": len(files)
            }
        ),
        200
    )
    res.headers.add("Content-Type", "application/json")
    return res

@app.route("/upload_decrypt", methods = ["POST"])
def upload_decrypt():
    return ""

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=3000,
        debug=True
    )
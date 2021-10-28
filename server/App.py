from flask import Flask, request
from Keypair import Keypair
from flask_cors import CORS
import response as res
import FileHelpers

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "<p>Hello, World!</p>"

@app.route("/getkey", methods = ["GET"])
def get_key():
    key_length_bits = request.args["key-length-bits"]
    keypair = Keypair(int(key_length_bits))
    public_key, private_key = keypair.get_key_pair()
    return res.json({
        "success": True,
        "public_key": public_key,
        "private_key": private_key
    })


@app.route("/upload_encrypt", methods = ["POST"])
def upload_encrypt():
    files = request.files.getlist("file[]")
    # app.logger.info(files)
    for file in files:
        file_ndarray = FileHelpers.read_stream_file_to_numpy(file)
        app.logger.info(file_ndarray.shape)
        FileHelpers.save_numpy_to_image("test2.jpg", file_ndarray)
    return res.json({
        "success" : True,
        "file_count": len(files)
    })

@app.route("/upload_decrypt", methods = ["POST"])
def upload_decrypt():
    return ""

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=3000,
        debug=True
    )
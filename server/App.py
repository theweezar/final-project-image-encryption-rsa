from flask import Flask, request, send_file
from werkzeug.datastructures import FileStorage
from Keypair import Keypair
from flask_cors import CORS
import response as res
import FileHelpers
import RSAScratch
from io import BytesIO

app = Flask(__name__)
CORS(app)

keypair = Keypair()
public_key_data, stt1 = FileHelpers.read("public_key.txt")
private_key_data, stt2 = FileHelpers.read("private_key.txt")
keypair.import_public_key(public_key_data)
keypair.import_private_key(private_key_data)

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
    app.logger.info(f"Count: {len(files)}")

    files_bytes_container = []

    for file in files:
        file_read = FileHelpers.read_stream_file_base64(file)
        files_bytes_container.append(file_read)

    decrypted_file_bytes = RSAScratch.encrypt_array_to_file(files_bytes_container, keypair)
    # decrypted_file = FileStorage()

    return send_file(
        BytesIO(decrypted_file_bytes),
        mimetype='text/plain;charset=UTF-8',
        as_attachment=True,
        attachment_filename='Encrypted.cry'
    )

    # return res.json({
    #     "success" : True,
    #     "file_count": len(files),
    #     "decrypted_file": decrypted_file
    # })

@app.route("/upload_decrypt", methods = ["POST"])
def upload_decrypt():
    return ""

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=3000,
        debug=True
    )
from flask import Flask, request, send_file
from Keypair import Keypair
from flask_cors import CORS
from io import BytesIO
import response as res
import FileHelpers
import RSAScratch

app = Flask(__name__)
CORS(app)

# keypair = Keypair()
# public_key_data, stt1 = FileHelpers.read("public_key.txt")
# private_key_data, stt2 = FileHelpers.read("private_key.txt")
# keypair.import_public_key(public_key_data)
# keypair.import_private_key(private_key_data)

@app.route("/getkey", methods = ["POST"])
def get_key():
    key_length = request.args["key_length"]
    keypair = Keypair(int(key_length))
    keypair.print_bit_length()
    public_key, private_key = keypair.get_key_pair()
    keypair_zip_buffer = FileHelpers.convert_keypair_to_zip_file(public_key, private_key)
    return send_file(
        keypair_zip_buffer,
        attachment_filename="keypair.zip",
        as_attachment=True
    )

@app.route("/upload_encrypt", methods = ["POST"])
def upload_encrypt():
    files = request.files.getlist("file[]")

    keypair = Keypair()
    public_key_file = request.files["public-key"]

    # Check key file has name's format which is (.*)(.key)$
    if FileHelpers.is_key_file(public_key_file) is None:
        return res.json({
            "message": "Wrong key file format. Please import another key file."
        }, 500)
    
    app.logger.info("Importing public key...")
    keypair.import_public_key(FileHelpers.read_stream_file(public_key_file).decode())

    # Check import key successfully or failed
    if keypair.get_modulus_n_public() is None or keypair.get_public_key_long() is None:
        return res.json({
            "message": "Can't import this public key file. Please generate new key file and use it."
        }, 500)

    app.logger.info(f"Count encrypt files: {len(files)}")

    files_bytes_container = []

    for file in files:
        file_read = FileHelpers.read_stream_file_base64_with_name(file)
        files_bytes_container.append(file_read)

    result_file_bytes = RSAScratch.encrypt_array_to_file(files_bytes_container, keypair)
    
    return send_file(BytesIO(result_file_bytes), attachment_filename="encrypted.cry", as_attachment=True)

@app.route("/upload_decrypt", methods = ["POST"])
def upload_decrypt():
    files = request.files.getlist("file[]")
    
    keypair = Keypair()
    private_key_file = request.files["private-key"]

    # Check key fil format
    if FileHelpers.is_key_file(private_key_file) is None:
        return res.json({
            "message": "Wrong key file format. Please import another key file."
        }, 500)

    keypair.import_private_key(FileHelpers.read_stream_file(private_key_file).decode())

    # Check import key successfully or failed
    if keypair.get_modulus_n_private() is None or keypair.get_private_key_long() is None:
        return res.json({
            "message": "Can't import this private key file. Please generate new key file and use it."
        }, 500)

    app.logger.info(f"Count decrypt files: {len(files)}")
    
    files_bytes_container = []

    for file in files:
        file_read = FileHelpers.read_stream_file(file)
        files_bytes_container += RSAScratch.decrypt_to_file_array(file_read, keypair)

    zip_buffer = FileHelpers.convert_list_image_to_zip_file(files_bytes_container)

    return send_file(
        zip_buffer,
        attachment_filename="images_packet.zip",
        as_attachment=True
    )

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=3000,
        debug=True
    )
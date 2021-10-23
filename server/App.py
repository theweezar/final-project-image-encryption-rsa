from flask import Flask, request
from Crypto.PublicKey import RSA

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Hello, World!</p>"

@app.route("/getkey", methods = ['GET'])
def get_key():
    key_length_bits = request.args['key-length-bits']
    key = RSA.generate(key_length_bits)
    public_key = key.publickey().exportKey('DER')
    private_key = key.exportKey('DER')

@app.route("/upload_encrypt", methods = ['POST'])
def upload_encrypt():
    files = request.files['uploaded-files']
    app.logger.info(files)
    return files

@app.route("/upload_decrypt", methods = ['POST'])
def upload_decrypt():
    return ""

if __name__ == "__main__":
    app.run(
        host='127.0.0.1',
        port=3000,
        debug=True
    )
from werkzeug.datastructures import FileStorage
from io import BytesIO
from PIL import Image
from zipfile import ZipFile, ZIP_DEFLATED
import numpy as np
import base64
import random
import string
import re

def write(file_name: str, input_data):
    input_file = open(file_name, "w+")
    input_file.write(input_data)
    input_file.close()

def read(file_name: str):
    """Read a file and return a result with a status number: 0: successfully, 1: failed"""
    output_string = ""
    status = 0
    try:
        output_file = open(file_name, "r")
        output_string = output_file.read()
        output_file.close()
    except:
        status = 1
    return output_string, status

def write_bin(file_name: str, input_data):
    input_file = open(file_name, "wb+")
    input_file.write(input_data)
    input_file.close()


def read_bin(file_name: str):
    """Read a binary file and return a result with a status number: 0: successfully, 1: failed"""
    output_bin = b""
    status = 0
    try:
        output_file = open(file_name, "rb")
        output_bin = output_file.read()
        output_file.close()
    except:
        status = 1
    return output_bin, status

def read_stream_file_base64_with_name(file: FileStorage) -> bytes:
    """Return a bytes string b'<file_name>|<file_base64_data>'"""
    return f"{file.filename}|".encode() + base64.b64encode(file.stream.read())

def read_stream_file(file: FileStorage) -> bytes:
    """Return a bytes string of stream file"""
    return file.stream.read()

def read_stream_file_to_numpy(file: FileStorage) -> np.ndarray:
    file_bytes = file.stream.read()
    return np.array(Image.open(BytesIO(file_bytes)))

def save_numpy_to_image(file_name: str, ndarray: np.ndarray):
    img = Image.fromarray(ndarray)
    img.save(file_name)

def is_key_file(file: FileStorage) -> bool:
    filename = file.filename
    regex = re.compile("(.*)(.key)$")
    # print(regex.match(filename))
    return regex.match(filename)

def convert_list_image_to_zip_file(list_image: list):
    """Convert list image to a zip file object store in buffer"""
    # Create an empty buffer
    zip_buffer = BytesIO()

    # Init zip file object in above buffer
    with ZipFile(zip_buffer, "w", ZIP_DEFLATED, False) as zip_obj:
        for image in list_image:
            info = bytes(image).split(b"|")
            if len(info) == 2:
                file_name = info[0].decode()
                file_data = info[1]
                with zip_obj.open(file_name, "w") as image_file:
                    image_file.write(base64.b64decode(file_data))
                print(f"Zipped {file_name}")

    zip_buffer.seek(0)

    return zip_buffer

def convert_keypair_to_zip_file(public_key: str, private_key: str):
    """Convert keypair object into zip files"""
    # Create an empty buffer in temp memory
    zip_buffer = BytesIO()

    # Init zip file object in above buffer
    with ZipFile(zip_buffer, "w", ZIP_DEFLATED, False) as zip_obj:

        # Generate random value for keypair file name
        public_random = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        private_random = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

        # Create temp public key file in zip 
        with zip_obj.open(f"publickey_{public_random}.key", "w") as publickey_file:
            publickey_file.write(public_key.encode())
        print("Zipped public key")

        # Create temp private key file in zip
        with zip_obj.open(f"privatekey_{private_random}.key", "w") as privatekey_file:
            privatekey_file.write(private_key.encode())
        print("Zipped private key")

    zip_buffer.seek(0)

    return zip_buffer

if __name__ == "__main__":
    zip_buffer = BytesIO()

    # Init zip file object in above buffer
    with ZipFile(zip_buffer, "w", ZIP_DEFLATED, False) as zip_obj:

        with zip_obj.open("publickey.txt", "w") as publickey_file:
            publickey_file.write("public key here".encode())
        print("Zipped public key")

        with zip_obj.open("privatekey.txt", "w") as privatekey_file:
            privatekey_file.write("private key here".encode())
        print("Zipped private key")

    zip_buffer.seek(0)

    with open("test.zip", "wb+") as zip_file:
        zip_file.write(zip_buffer.getvalue())
    
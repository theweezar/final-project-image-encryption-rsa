from werkzeug.datastructures import FileStorage
from io import BytesIO
from PIL import Image
import numpy as np
import base64

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

def read_stream_file_base64(file: FileStorage) -> bytes:
    """Return a bytes string b'<file_name>|<file_base64_data>'"""
    return f"{file.filename}|".encode() + base64.b64encode(file.stream.read())

def read_stream_file_to_numpy(file: FileStorage) -> np.ndarray:
    file_bytes = file.stream.read()
    return np.array(Image.open(BytesIO(file_bytes)))

def save_numpy_to_image(file_name: str, ndarray: np.ndarray):
    img = Image.fromarray(ndarray)
    img.save(file_name)

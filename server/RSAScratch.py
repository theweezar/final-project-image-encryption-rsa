import base64
import FileHelpers
from Crypto.Util import number
from Keypair import Keypair
import time

def encrypt(data_bytes: bytes, keypair: Keypair):
    track = 0
    limit = 234
    stop = False
    enc_container = ""
    print("Data bytes length:", len(data_bytes))

    while stop is False:
        block_bytes = data_bytes[track: track + limit] if track + limit < len(data_bytes) else data_bytes[track: len(data_bytes)]
        stop = False if track + limit < len(data_bytes) else True
        track += limit
        enc_long = pow(number.bytes_to_long(block_bytes), keypair.get_public_key_prime(), keypair.get_modulus_n_public())
        enc_container += hex(enc_long) + ";"
        # break
        
    return enc_container[:-1]

def decrypt(data: bytes, keypair: Keypair):
    enc_blocks_hex = data.decode().split(";")
    dec_container = b""
    
    for block_hex in enc_blocks_hex:
        block_long = int(block_hex, 16)
        dec_long = pow(block_long, keypair.get_private_key_prime(), keypair.get_modulus_n_private())
        dec_container += number.long_to_bytes(dec_long)

    return dec_container


def calculate_time_execute(callback):
    start_time = time.time()
    if callback is not None and type(callback).__name__ == "function":
        callback()
    else:
        raise TypeError("Callback is not function")
    print(f"--- {(time.time() - start_time)} seconds ---")

def main():
    keypair = Keypair()
    public_key_data, stt1 = FileHelpers.read("public_key.txt")
    private_key_data, stt2 = FileHelpers.read("private_key.txt")
    keypair.import_public_key(public_key_data)
    keypair.import_private_key(private_key_data)
    
    image_file = open("images/test.jpg", "rb")

    print("Compare 2 modulus:", keypair.get_modulus_n_private() == keypair.get_modulus_n_public())

    def execute():
        # enc = encrypt(image_file.read(), keypair)
        # FileHelpers.write_bin("encrypted/encrypted.bin", enc.encode())

        enc, stt = FileHelpers.read_bin("encrypted/encrypted.bin")
        dec = decrypt(enc, keypair)
        FileHelpers.write_bin("decrypted/decrypted.jpg", dec)
        
    calculate_time_execute(execute)


if __name__ == "__main__":
    main()

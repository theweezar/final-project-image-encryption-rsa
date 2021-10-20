import math
import File
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5 # Public-Key Cryptography Standards 1 (PKCS1) ver 1.5
from Crypto.Random import get_random_bytes

"""
    Library
    pip install pycryptodome==3.4.3
"""

PUBLIC_KEY_FILENAME = "public_key.bin"
PRIVATE_KEY_FILENAME = "private_key.bin"

def gcd(a: int, b: int):
    return a if b == 0 else gcd(b, a % b)

def isPrime(n: int):
    sqrt_n = math.sqrt(n)
    print('sqrt_n: ', sqrt_n)
    for i in range(2, int(sqrt_n)):
        if n % i == 0:
            return False
    return True

def generate_key_pairs(key_length_bits):
    list_key_length = [1024, 2048, 4096]
    if key_length_bits not in list_key_length:
        return None

    key = RSA.generate(key_length_bits)
    public_key = key.publickey().exportKey('DER')
    private_key = key.exportKey('DER')

    File.write_bin(PUBLIC_KEY_FILENAME, public_key)
    File.write_bin(PRIVATE_KEY_FILENAME, private_key)

def import_key(file_name: str):
    key_bin, status = File.read_bin(file_name)
    try:
        return None if status == 1 else RSA.import_key(key_bin)
    except:
        return None

def encrypt(public_key: RSA.RsaKey, plain_data: str):
    cipher = PKCS1_v1_5.new(public_key)
    return cipher.encrypt(plain_data.encode())

def decrypt(private_key: RSA.RsaKey, cipher_data: bytes):
    cipher = PKCS1_v1_5.new(private_key)
    sentinel = get_random_bytes(16)
    return cipher.decrypt(cipher_data, sentinel)
    
if __name__ == "__main__": 
    # generate_key_pairs(1024)
    public_key = import_key(PUBLIC_KEY_FILENAME)
    private_key = import_key(PRIVATE_KEY_FILENAME)
    cipher_text = encrypt(public_key, 'Hoang Phan Minh Duc')
    print('\nCipher text: ', cipher_text)
    plain_text= decrypt(private_key, cipher_text)
    print('\nPlain text: ', plain_text.decode())
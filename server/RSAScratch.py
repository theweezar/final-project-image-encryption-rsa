import MathHelpers
import numpy as np
from Crypto.Util import number
from Keypair import Keypair
from typing import Union
import matplotlib.image as image

def encrypt(data: Union[int, np.ndarray], keypair: Keypair) -> Union[int, np.ndarray]:
    public_key = keypair.get_public_key_prime()
    modulus_n = keypair.get_modulus_n()
    # return (data ** public_key) % modulus_n
    return pow(data, public_key, modulus_n)

def decrypt(data: Union[int, np.ndarray], keypair: Keypair) -> Union[int, np.ndarray]:
    private_key = keypair.get_private_key_prime()
    modulus_n = keypair.get_modulus_n()
    # return (data ** private_key) % modulus_n
    return pow(data, private_key, modulus_n)

def main():
    image_ndarray8 = image.imread("images/test.jpg")
    image_ndarray64 = MathHelpers.convert_numpy_dtype(image_ndarray8, np.uint64)
    
    keypair = Keypair(1024)
    
    pixel = image_ndarray8[0,0,:]

    r = image_ndarray64[:,:,0]
    g = image_ndarray64[:,:,1]
    b = image_ndarray64[:,:,2]

    print(r)

    rgb_join = ((r * 1000) + g) * 1000 + b

    print("\nPixel:", pixel)
    print("rgb_join:",rgb_join[0])
    print(rgb_join.dtype)

    name = "Hoang Phan Minh Duc"

    encrypted = encrypt(number.bytes_to_long(name.encode()), keypair)

    print("Encrypted:", encrypted)

    decrypted = decrypt(encrypted, keypair)

    print("Decrypted:", number.long_to_bytes(decrypted))
    
    print()


if __name__ == "__main__":
    main()
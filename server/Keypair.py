import MathHelpers
import base64
import re
from Crypto.Util import number

class Keypair:
    def __init__(self, key_length = 0) -> None:
        self.__public_key = None
        self.__private_key = None
        self.__modulus_n = None
        if type(key_length) == int and key_length > 0:
            self.key_length = key_length
            self.__generate_rsa_keypairs()

    def __generate_rsa_keypairs(self):
        found = False
        while found is False:
            print("Generate large prime p...")
            # p = MathHelpers.generate_large_prime(self.key_length)
            p = number.getPrime(self.key_length)
            print("Generate large prime q...")
            # q = MathHelpers.generate_large_prime(self.key_length)
            q = number.getPrime(self.key_length)

            n = p * q

            phi = (p - 1) * (q - 1)

            e = 0

            while True:
                e = number.getPrime(self.key_length)
                if MathHelpers.gcd(e, phi) == 1:
                    break

            d = MathHelpers.find_mod_inverse(e, phi)

            if d != -1:
                found = True
                print(f"\nSummary: p = {p}, q = {q}, n (Message length) = {n}, phi(Φ) = {phi}")
                print(f"Public key - e = ({e}, {n})")
                print(f"Public key - d = ({d}, {n})")

                # Private
                self.__public_key = e
                self.__private_key = d
                self.__modulus_n = n

    def __make_pem_key(self, title: str, key: int):
        """Generate PEM data"""
        header = f"-----BEGIN {title.upper()}-----"
        footer = f"-----END {title.upper()}-----"

        hex_key = hex(key)

        b64_key = base64.b64encode(hex_key.encode("utf-8")).decode("utf-8")

        pem_key = f"{header}\n{b64_key}\n{footer}"

        return pem_key

    def get_key_pair(self, is_pem = True):
        """Return a key pair as a tuple (public key, private key)"""
        if is_pem is True and self.__public_key is not None and self.__private_key is not None:
            return (
                self.__make_pem_key("PUBLIC KEY", self.__public_key),
                self.__make_pem_key("PRIVATE KEY", self.__private_key)
            )
        return self.__public_key, self.__private_key

    def __parse_key(self, key: str):
        key = key.replace("\n", "")
        # ^(-----)(.*)(-----)(\w+)(-----)(.*)(-----)$
        # ^(-----.*-----)(\w+)(-----.*-----)$
        # ^(-----.*-----)(.*)(-----.*-----)$
        regex = re.compile("^(-----.*-----)(.*)(-----.*-----)$")
        split_array = regex.split(key)
        b64_key = None
        if split_array is not None and len(split_array) > 3:
            b64_key = split_array[2]

        if b64_key is not None:
            hex_key = base64.b64decode(b64_key.encode("utf-8")).decode("utf-8")
            prime = int(hex_key, 16)
            return prime

        return None

    def import_public_key(self, public_key: str):
        self.__public_key = self.__parse_key(public_key)

    def import_private_key(self, private_key: str):
        self.__private_key = self.__parse_key(private_key)

    def get_public_key_prime(self):
        return self.__public_key

    def get_private_key_prime(self):
        return self.__private_key

    def get_modulus_n(self):
        return self.__modulus_n



if __name__ == "__main__":
    keypair = Keypair(16)

    public_key, private_key = keypair.get_key_pair()

    keypair.import_public_key(public_key)

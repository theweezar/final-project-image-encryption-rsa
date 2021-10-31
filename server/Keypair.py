import MathHelpers
import base64
import re
import FileHelpers
from Crypto.Util import number

class Keypair:
    def __init__(self, key_length = 0, verbose = False) -> None:
        self.__verbose = verbose
        self.__seperate = ",,,"
        self.reset()
        if type(key_length) == int and key_length > 0:
            self.key_length = key_length
            self.__generate_rsa_keypairs()

    def reset(self):
        self.__public_key = None
        self.__private_key = None
        self.__modulus_n_public = None
        self.__modulus_n_private = None
        self.__is_generated = False

    def __generate_rsa_keypairs(self):
        found = False
        while found is False:
            # print("Generate large prime p...")
            # p = MathHelpers.generate_large_prime(self.key_length)
            p = number.getPrime(self.key_length)
            # print("Generate large prime q...")
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

                if self.__verbose is True:
                    print(f"\nSummary: p = {p}, q = {q}, n (Message length) = {n}, phi(Φ) = {phi}")
                    print(f"Public key - e = ({e}, {n})")
                    print(f"Private key - d = ({d}, {n})")

                # Private
                self.__public_key = e
                self.__private_key = d
                self.__modulus_n_public = n
                self.__modulus_n_private = n
                self.__is_generated = True

    def __make_pem_key(self, title: str, modulus_n: int, key: int):
        """Generate PEM data"""
        header = f"-----BEGIN {title.upper()}-----"
        footer = f"-----END {title.upper()}-----"

        data_export = f"{modulus_n}{self.__seperate}{key}"
        data_export_hex = base64.b64encode(data_export.encode("utf-8")).decode("utf-8")

        pem_key = f"{header}\n{data_export_hex}\n{footer}"

        return pem_key

    def get_key_pair(self, is_pem = True):
        """Return a key pair as a tuple (public key, private key)"""
        if is_pem is True and self.__public_key is not None and self.__private_key is not None:
            return (
                self.__make_pem_key("PUBLIC KEY", self.__modulus_n_public, self.__public_key),
                self.__make_pem_key("PRIVATE KEY", self.__modulus_n_private, self.__private_key)
            )
        return self.__public_key, self.__private_key

    def __parse_key(self, key: str):
        """Return a tuple with (modulus N, Key)"""
        key = key.replace("\n", "")
        # ^(-----)(.*)(-----)(\w+)(-----)(.*)(-----)$
        # ^(-----.*-----)(\w+)(-----.*-----)$
        # ^(-----.*-----)(.*)(-----.*-----)$
        regex = re.compile("^(-----.*-----)(.*)(-----.*-----)$")
        split_array = regex.split(key)
        b64_data = None
        if split_array is not None and len(split_array) > 3:
            b64_data = split_array[2]

        if b64_data is not None:
            key_data = base64.b64decode(b64_data.encode("utf-8")).decode("utf-8")
            key_data_split = key_data.split(self.__seperate)
            if len(key_data_split) == 2:
                return int(key_data_split[0]), int(key_data_split[1])

        return None, None

    def import_public_key(self, public_key: str):
        self.__modulus_n_public, self.__public_key = self.__parse_key(public_key)

    def import_private_key(self, private_key: str):
        self.__modulus_n_private, self.__private_key = self.__parse_key(private_key)

    def get_public_key_prime(self) -> int:
        return self.__public_key

    def get_private_key_prime(self) -> int:
        return self.__private_key

    def get_modulus_n_public(self) -> int:
        return self.__modulus_n_public

    def get_modulus_n_private(self) -> int:
        return self.__modulus_n_private

    def save_key_file(self, path = ""):
        public_key, private_key = self.get_key_pair()
        FileHelpers.write(path + "public_key.txt", public_key)
        FileHelpers.write(path + "private_key.txt", private_key)

if __name__ == "__main__":
    keypair = Keypair()

    # public_key, private_key = keypair.get_key_pair()

    # keypair.import_public_key(public_key)

    # keypair.save_key_file()

    public_key_data, pub_stt = FileHelpers.read("public_key.txt")
    private_key_data, pri_stt = FileHelpers.read("private_key.txt")
    keypair.import_public_key(public_key_data)
    keypair.import_private_key(private_key_data)
    print("\nPublic key:", keypair.get_public_key_prime())
    print("\nPrivate key:", keypair.get_private_key_prime())
    print("\nCompare 2 modulus is:", keypair.get_modulus_n_private() == keypair.get_modulus_n_public())

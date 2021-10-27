import MathHelpers
import base64
from Crypto.Util import number

class Keypair:
    def __init__(self, key_length: int) -> None:
        if key_length is None or key_length <= 0:
            raise ValueError("Key length must be integer and greater than 0")
        self.key_length = key_length
        self.generate_rsa_keypairs()
        pass

    def generate_rsa_keypairs(self):
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

                self.__public_key = e
                self.__private_key = d

    def get_key_pair(self, is_hex = False):
        """Return a key pair as a tuple (public key, private key)"""
        if is_hex is True:
            return (hex(self.__public_key), hex(self.__private_key))
        return (self.__public_key, self.__private_key)


if __name__ == "__main__":
    keypair = Keypair(1024)

    public_key, private_key = keypair.get_key_pair(is_hex=True)

    print(base64.b64encode(public_key.encode("utf-8")).decode("utf-8"))

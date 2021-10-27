import math
import random

tiny_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71
, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181
, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281
, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397
, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503
, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619
, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743
, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863
, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
]

def gcd(a: int, b: int):
    return a if b == 0 else gcd(b, a % b)

def is_prime(n: int):
    """Version sqrt to check if the number is prime or not"""
    sqrt_n = int(math.sqrt(n))
    for i in range(2, sqrt_n + 1):
        if n % i == 0:
            return False
    return True

def random_with_length(length: int):
    return random.randrange(2 ** (length - 1), 2 ** (length))

def miller_rabin(num: int):
    """ # Algorithm used to check if the input is prime or not 
    # (Use for big number like 2^1024 and above)
    1. n - 1 = (2^s) x m. Find s and m
    2. a = random(2, num - 1)
    3. b = a^m % num
    4. if b == 1 --> return True
    5. for 0 --> s
        if b == num - 1 (b == -1 % num) --> return True
        else b = b^2 % num
    6. Return False
    """
    # n - 1 = (2^s) x m. Find s and m
    m = num - 1
    s = 0

    while m % 2 == 0:
        m /= 2
        s += 1
    m = int(m)
    print("s =", s)
    print("m =", m)
    print("num - 1 = (2^s) x m")
    print(f"{num} - 1 ({num - 1})= (2^{s}) x {m} ({(2**s) * m})")

    a = random.randrange(2, num - 1)
    print("a =", a)
    b = a ** m % num
    print(f"b = (a**m) % num = ({a} ** {m}) % {num} =", b)
    
    if b == 1:
        return True
    
    for i in range(0, s):
        print("Loop :", i)
        if b == num - 1:
            return True
        b = b ** 2 % num
    
    return False

def is_big_prime(num: int):
    """ Version to check a big big number if it is prime or not"""
    if num in tiny_primes:
        return True
    
    for prime in tiny_primes:
        if num % prime == 0:
            return False

    return miller_rabin(num)

def generate_large_prime(key_length):
    """Generate a big prime with size: 1024, 2048, 3072, 4096"""
    while True:
        num = random_with_length(key_length)
        if is_big_prime(num):
            return num

def main():
    key_length = 16

    p = generate_large_prime(key_length)
    q = generate_large_prime(key_length)

    n = p*q

    phi = (p - 1)*(q - 1)

    e = 0
    while True:
        e = random_with_length(key_length)
        if gcd(e, phi) == 1:
            break

    print(f"p = {p}, q = {q}, n = {n}, phi = {phi}, e = {e}")

if __name__ == "__main__":
    main()
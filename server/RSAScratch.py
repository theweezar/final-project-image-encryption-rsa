import math
import FileHelpers
import MathHelpers

primes = []
for i in range(2, 1000):
    if MathHelpers.is_prime(i):
        primes.append(i)

print(primes)
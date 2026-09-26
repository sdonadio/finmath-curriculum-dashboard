import numpy as np
import hashlib
np.seterr(all="ignore")

# A cryptographic hash function is deterministic (same input -> same output,
# always), but a single flipped bit in the input should flip roughly HALF of
# the output bits with no discernible pattern -- the "avalanche effect" that
# makes the output look unrelated to the input even though it is a pure
# function of it.

def sha256_bits(data: bytes) -> str:
    digest = hashlib.sha256(data).digest()
    return "".join(format(byte, "08b") for byte in digest)

msg = b"Alice pays Bob 10 BTC at block height 800000"
h1 = hashlib.sha256(msg).hexdigest()
h2 = hashlib.sha256(msg).hexdigest()
print("message           : %r" % msg)
print("sha256 (run 1)     : %s" % h1)
print("sha256 (run 2)     : %s" % h2)
print("deterministic: same input always gives the same digest -> %s\n" % (h1 == h2))

# Flip a single bit (change one character) and compare bit-by-bit.
msg_flipped = b"Alice pays Bob 11 BTC at block height 800000"
bits1 = sha256_bits(msg)
bits2 = sha256_bits(msg_flipped)
n_bits = len(bits1)
n_diff = sum(1 for a, b in zip(bits1, bits2) if a != b)
print("original message  : %r" % msg)
print("one character changed (10 -> 11) : %r" % msg_flipped)
print("sha256 of the changed message    : %s" % hashlib.sha256(msg_flipped).hexdigest())
print("output bits that differ : %d / %d (%.1f%%) -- expect close to 50%%"
      % (n_diff, n_bits, 100 * n_diff / n_bits))

# Average the avalanche fraction over many random single-bit flips, drawn
# deterministically with a seeded numpy generator, to show 50% is the RULE,
# not a lucky example.
rng = np.random.default_rng(31200)
base = rng.bytes(64)
fracs = []
for bit_index in range(len(base) * 8):
    flipped = bytearray(base)
    flipped[bit_index // 8] ^= (1 << (bit_index % 8))
    b1 = sha256_bits(bytes(base))
    b2 = sha256_bits(bytes(flipped))
    diff = sum(1 for a, b in zip(b1, b2) if a != b)
    fracs.append(diff / len(b1))
fracs = np.array(fracs)
print("\nflipping each of the %d bits of a random 64-byte message, one at a time:" % (len(base) * 8))
print("  mean fraction of output bits changed : %.4f" % fracs.mean())
print("  std dev across the %d single-bit flips: %.4f" % (len(fracs), fracs.std()))
print("  min / max fraction changed            : %.4f / %.4f" % (fracs.min(), fracs.max()))

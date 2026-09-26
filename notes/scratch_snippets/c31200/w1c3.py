import numpy as np
import hashlib
np.seterr(all="ignore")

# A Lamport signature builds a digital signature scheme out of NOTHING but a
# hash function -- no elliptic curves, no number-theoretic trapdoor -- which
# is exactly why hash-based signatures are the leading post-quantum
# candidate: breaking them requires inverting a hash, not factoring or
# discrete logs, and a large quantum computer does not help with that.
#
# Keygen: for each of the 256 output bits of SHA-256, generate a private-key
# PAIR of random 256-bit secrets (secret if the bit is 0, secret if it is
# 1); the public key is the hash of every one of those 512 secrets.
# Sign(m): hash m, then for each bit of the hash reveal the secret matching
# that bit's value. Verify: hash each revealed secret and check it matches
# the public commitment for that bit and that bit value. Reusing a keypair
# to sign a second message leaks half of BOTH messages' secrets, exposing
# enough of the private key to forge a signature on some third message --
# which is exactly why this is a ONE-TIME signature scheme.

def h(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def keygen(rng):
    sk = [[rng.bytes(32), rng.bytes(32)] for _ in range(256)]   # sk[i][bit]
    pk = [[h(sk[i][0]), h(sk[i][1])] for i in range(256)]
    return sk, pk

def hash_bits(data: bytes):
    digest = h(data)
    return [(byte >> shift) & 1 for byte in digest for shift in range(7, -1, -1)]

def sign(message: bytes, sk):
    bits = hash_bits(message)
    return [sk[i][bits[i]] for i in range(256)]

def verify(message: bytes, signature, pk):
    bits = hash_bits(message)
    return all(h(signature[i]) == pk[i][bits[i]] for i in range(256))

rng = np.random.default_rng(31200 + 2)
sk, pk = keygen(rng)

msg = b"transfer 5 coins from Alice's key to Bob's key"
signature = sign(msg, sk)
print("private key size  : %d secrets x 32 bytes = %d bytes" % (2 * 256, 2 * 256 * 32))
print("public key size    : %d hashes x 32 bytes  = %d bytes" % (2 * 256, 2 * 256 * 32))
print("signature size     : %d secrets x 32 bytes = %d bytes\n" % (256, 256 * 32))

ok = verify(msg, signature, pk)
print("message   : %r" % msg)
print("signature verifies against the public key : %s" % ok)

# Forge attempt: flip one bit of the message and try to reuse the SAME
# signature (the attacker did not get new secrets for the changed bits).
tampered = b"transfer 9 coins from Alice's key to Bob's key"
ok_tampered = verify(tampered, signature, pk)
print("\nattacker tampers the message (5 coins -> 9 coins), reuses the signature:")
print("  verifies : %s" % ok_tampered)

# The one-time danger: sign a SECOND message with the same keypair, and
# count how many of the 256 secrets have now been revealed across both
# signatures -- an attacker who has both signatures holds that many of the
# 512 total secrets, more than enough to sign many other messages the key
# owner never approved.
msg2 = b"transfer all remaining coins to the attacker's key"
signature2 = sign(msg2, sk)
bits1 = hash_bits(msg)
bits2 = hash_bits(msg2)
revealed = set()
for i in range(256):
    revealed.add((i, bits1[i]))
    revealed.add((i, bits2[i]))
print("\nsigning a SECOND message with the same one-time keypair:")
print("  distinct (position, bit) secrets now revealed : %d / 512 (%.1f%%)"
      % (len(revealed), 100 * len(revealed) / 512))
print("  positions where BOTH bit-0 and bit-1 are now revealed : %d / 256"
      % sum(1 for i in range(256) if (i, 0) in revealed and (i, 1) in revealed))
print("  -> at those positions the attacker can pick either bit freely,")
print("     which is the leverage a forger needs; reuse is fatal, one use is not")

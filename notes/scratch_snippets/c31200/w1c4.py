import numpy as np
import hashlib
np.seterr(all="ignore")

# Proof-of-work mining is a brute-force search for a NONCE such that
# hash(block_header || nonce) falls below a target -- equivalently, starts
# with enough leading zero bits. There is no shortcut: SHA-256 gives no
# structure to exploit, so the expected number of tries to find a valid
# nonce is exactly 2^difficulty, independent of everything about the miner
# except raw hash rate.

def h(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def leading_zero_bits(digest: bytes) -> int:
    n = 0
    for byte in digest:
        if byte == 0:
            n += 8
            continue
        n += 8 - byte.bit_length()
        break
    return n

def mine(header: bytes, difficulty_bits: int, max_tries=5_000_000):
    for nonce in range(max_tries):
        digest = h(header + nonce.to_bytes(8, "big"))
        if leading_zero_bits(digest) >= difficulty_bits:
            return nonce, digest, nonce + 1
    return None, None, max_tries

header = b"prev_hash=0000...aa17 | merkle_root=f3547d57... | timestamp=1798329600"
print("mining a block header against rising difficulty targets:\n")
print(" difficulty(bits)  expected tries (2^d)   actual tries   ratio(actual/expected)")
for difficulty in (8, 12, 16, 18, 20):
    nonce, digest, tries = mine(header, difficulty)
    expected = 2 ** difficulty
    print("      %2d              %10d          %10d         %6.2fx"
          % (difficulty, expected, tries, tries / expected))

# The winning nonce and digest at the highest difficulty tried above.
nonce, digest, tries = mine(header, 20)
print("\nat difficulty 20, the winning nonce is %d after %d tries" % (nonce, tries))
print("winning digest : %s" % digest.hex())
print("leading zero bits achieved : %d (needed >= 20)" % leading_zero_bits(digest))

# Translate difficulty into a network-level block time: given a total
# network hash rate, expected time to solve = 2^difficulty / hashrate.
hashrate_th_s = 500_000_000.0                          # 500 million TH/s, order of magnitude for a large network
target_block_time_s = 600.0                            # 10-minute blocks
required_difficulty_bits = np.log2(hashrate_th_s * 1e12 * target_block_time_s)
print("\nat a network hash rate of %.0e H/s targeting a %.0f-second block time,"
      % (hashrate_th_s * 1e12, target_block_time_s))
print("the difficulty needed is 2^%.1f -- this is exactly the number a real network's"
      % required_difficulty_bits)
print("difficulty-retarget rule solves for every ~2 weeks, using the last epoch's actual")
print("block times as the measurement of the network's current aggregate hash rate")

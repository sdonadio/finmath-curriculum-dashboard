"""Week 3 of FINM 33500 (Session 2, 2026-10-16): networking and trading protocols.
Imported by tools/gen_finm_33500.py; apply(WEEKS) is called after gen_finm_33500_w2w3.apply().

Rebuilt 2026-10-09 to the instructor's required order, one step after another and
nothing out of place:

    1  the seven OSI layers (two concepts: layers 1-3, layers 4-7 and encapsulation)
       + the osi-stack widget, drawn right after concept 2
    2  UDP against TCP (one concept) + the tcp-vs-udp widget, drawn right after concept 3
    3  the TCP and UDP socket APIs (two concepts: TCP calls; UDP calls, blocking modes)
    4  a TCP echo server/client and a UDP server/client, each two real processes
    5  FIX; ITCH over MoldUDP64, OUCH, SBE/FAST and MDP 3.0
    6  WebSocket, last, with the arena's JSON over WebSocket mapped onto 1-5

The "you connect to the Wi-Fi" story is the week's short intro paragraph (week.intro),
not a concept. The asyncio material that used to be this week (five concepts and the
code-trace widget, from gen_finm_33500.py) moves to week 4, in front of the streaming
concepts that use it; see apply().

No snippet here prints a wall-clock timing, so `run_snippets.py --check` stays stable:
where a delay matters (s5 timeouts, s7 retries) the snippet prints a verdict, not a number.
"""

SRC = {}

SRC["w3s1"] = r'''import numpy as np
np.seterr(all="ignore")
import ipaddress
import struct
import zlib

# --- L1 physical: bits on a medium, at a line rate --------------------------------------------
byte = 0x45
print(f"L1 physical  0x{byte:02x} leaves the NIC as the bits {byte:08b}; one full 1,518-byte frame takes")
for name, bps in (("1 Gb/s copper", 1e9), ("10 Gb/s fibre", 1e10), ("25 Gb/s colo link", 2.5e10)):
    wire = (1518 + 8 + 12) * 8                     # frame + preamble + inter-frame gap
    print(f"     {name:<18} {wire / bps * 1e6:6.2f} us to serialise   (a 64-byte frame: {(64 + 20) * 8 / bps * 1e9:5.1f} ns)")

# --- L2 data link: an Ethernet frame, and a switch that learns MAC addresses ------------------
def mac(s):
    return bytes.fromhex(s.replace(":", ""))

def ethernet(dst, src, ethertype, payload):
    body = mac(dst) + mac(src) + struct.pack("!H", ethertype) + payload.ljust(46, b"\0")  # pad to the 64 B minimum
    return body + struct.pack("<I", zlib.crc32(body))                                     # FCS: CRC-32 of everything before it

LAPTOP, ROUTER, PRINTER = "a4:c3:f0:44:55:66", "f0:b3:ec:11:22:33", "3c:22:fb:00:00:07"
f = ethernet(ROUTER, LAPTOP, 0x0800, b"an IPv4 packet goes here")
ok = struct.unpack("<I", f[-4:])[0] == zlib.crc32(f[:-4])
bad = bytearray(f); bad[20] ^= 0x01                 # one bit flipped on the wire
print(f"L2 data link frame {len(f)} B: dst {f[:6].hex(':')} src {f[6:12].hex(':')} type 0x{f[12:14].hex()} "
      f"FCS ok={ok}; one flipped bit -> FCS ok={struct.unpack('<I', bytes(bad[-4:]))[0] == zlib.crc32(bytes(bad[:-4]))} (dropped)")

table = {}
def switch(in_port, src, dst):
    table[src] = in_port                           # learn: this MAC lives behind this port
    out = table.get(dst)
    return f"port {out}" if out is not None else "flood to every other port"
for port, src, dst in ((1, LAPTOP, ROUTER), (4, ROUTER, LAPTOP), (1, LAPTOP, ROUTER), (2, PRINTER, "ff:ff:ff:ff:ff:ff")):
    print(f"     switch: frame in on port {port}, {src[-5:]} -> {dst[-5:]:<5}  => {switch(port, src, dst)}")

# --- L3 network: an IPv4 header, a router's TTL decrement, longest-prefix match ---------------
def checksum16(data):
    s = sum(struct.unpack(f"!{len(data) // 2}H", data))
    while s >> 16:
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF

def ipv4(src, dst, ttl, proto, length):
    h = struct.pack("!BBHHHBBH4s4s", 0x45, 0, length, 0x1c46, 0x4000, ttl, proto, 0,
                    ipaddress.IPv4Address(src).packed, ipaddress.IPv4Address(dst).packed)
    return h[:10] + struct.pack("!H", checksum16(h)) + h[12:]

h = ipv4("192.168.1.23", "203.0.113.10", 64, 6, 132)
print(f"L3 network   IPv4 header {len(h)} B: {h.hex(' ')}")
print(f"     version 4, ihl 5, total length 132, ttl {h[8]}, protocol {h[9]} (TCP), checksum ok={checksum16(h) == 0}")
for hop in range(1, 3):                            # every router: TTL - 1, recompute the checksum
    ttl = h[8] - 1
    h = h[:8] + bytes([ttl]) + h[9:10] + b"\0\0" + h[12:]
    h = h[:10] + struct.pack("!H", checksum16(h)) + h[12:]
    print(f"     router {hop}: ttl {h[8]}, new checksum 0x{h[10:12].hex()}, ok={checksum16(h) == 0}; addresses untouched")

routes = {"0.0.0.0/0": "default gateway 192.168.1.1", "192.168.1.0/24": "on-link: ARP for the MAC",
          "10.8.0.0/16": "VPN tunnel", "10.8.4.0/24": "VPN, colo subnet"}
for dst in ("192.168.1.40", "10.8.4.2", "203.0.113.10"):
    d = ipaddress.ip_address(dst)
    best = max((ipaddress.ip_network(n) for n in routes if d in ipaddress.ip_network(n)), key=lambda n: n.prefixlen)
    print(f"     route {dst:<13} longest match {str(best):<15} -> {routes[str(best)]}")
'''

SRC["w3s2"] = r'''import numpy as np
np.seterr(all="ignore")
import ipaddress
import json
import struct
import zlib

def checksum16(data):
    if len(data) % 2:
        data += b"\0"
    s = sum(struct.unpack(f"!{len(data) // 2}H", data))
    while s >> 16:
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF

SRC, DST = ipaddress.IPv4Address("192.168.1.23"), ipaddress.IPv4Address("203.0.113.10")

# ---- SENDER: each layer is handed the layer above's bytes and puts its own header in front ----
order = {"type": "place_order", "team_id": "TEAM07", "symbol": "AAPL", "side": "buy",
         "order_type": "limit", "price": 185.5, "quantity": 5}
l7 = json.dumps(order, separators=(",", ":"))                       # L7 application: what the message means
l6 = l7.encode("utf-8")                                              # L6 presentation: how it is encoded (TLS would encrypt here)
MASK = bytes.fromhex("37fa213d")                                     # clients must mask every frame (RFC 6455)
l5 = struct.pack("!BB", 0x81, 0x80 | len(l6)) + MASK + bytes(b ^ MASK[i % 4] for i, b in enumerate(l6))
#                     ^ FIN + opcode 1 (text)   ^ MASK bit + length: the WebSocket frame that carries it
def tcp(sport, dport, seq, ack, payload):                            # L4 transport: ports, sequence numbers, checksum
    hdr = struct.pack("!HHIIBBHHH", sport, dport, seq, ack, 5 << 4, 0x18, 65535, 0, 0)
    pseudo = SRC.packed + DST.packed + struct.pack("!BBH", 0, 6, len(hdr) + len(payload))
    c = checksum16(pseudo + hdr + payload)                           # covers the IP addresses too
    return hdr[:16] + struct.pack("!H", c) + hdr[18:] + payload
l4 = tcp(51514, 8765, 1_000_001, 7_000_001, l5)
ip_hdr = struct.pack("!BBHHHBBH4s4s", 0x45, 0, 20 + len(l4), 0x1c46, 0x4000, 64, 6, 0, SRC.packed, DST.packed)
l3 = ip_hdr[:10] + struct.pack("!H", checksum16(ip_hdr)) + ip_hdr[12:] + l4      # L3 network: addresses, TTL
eth = bytes.fromhex("f0b3ec112233a4c3f0445566") + struct.pack("!H", 0x0800) + l3
l2 = eth + struct.pack("<I", zlib.crc32(eth))                        # L2 data link: MACs, type, FCS trailer

print(f"{'layer':<18}{'PDU':<9}{'adds':>6}{'size':>7}   first bytes of what this layer hands down")
for name, pdu, unit, prev in (("L7 JSON, L6 UTF-8", "data", l6, b""), ("L7 WebSocket", "data", l5, l6),
                              ("L4 transport", "segment", l4, l5), ("L3 network", "packet", l3, l4),
                              ("L2 data link", "frame", l2, l3)):
    print(f"{name:<18}{pdu:<9}{len(unit) - len(prev):>5}B{len(unit):>6}B   {unit[:14].hex(' ')}")
print(f"L1 physical       bits     {len(l2) * 8:,} bits + 8 B preamble; the order is {len(l6) / len(l2):.0%} of the frame")

# ---- RECEIVER: each layer checks its own header, strips it, and picks who gets the rest ----
f = l2
assert struct.unpack("<I", f[-4:])[0] == zlib.crc32(f[:-4])
etype = struct.unpack("!H", f[12:14])[0]
p = f[14:-4]
ihl, proto = (p[0] & 0x0F) * 4, p[9]
s_ip, d_ip = ipaddress.IPv4Address(p[12:16]), ipaddress.IPv4Address(p[16:20])
seg = p[ihl:struct.unpack("!H", p[2:4])[0]]
sport, dport, seq = struct.unpack("!HHI", seg[:8])
pseudo = s_ip.packed + d_ip.packed + struct.pack("!BBH", 0, proto, len(seg))
data = seg[(seg[12] >> 4) * 4:]
op, n, key = data[0] & 0x0F, data[1] & 0x7F, data[2:6]
msg = json.loads(bytes(b ^ key[i % 4] for i, b in enumerate(data[6:6 + n])).decode("utf-8"))
print("decapsulation, bottom up:")
print(f"  L2 FCS ok, ethertype 0x{etype:04x} -> hand to IPv4")
print(f"  L3 {s_ip} -> {d_ip}, header checksum ok={checksum16(p[:ihl]) == 0}, protocol {proto} -> hand to TCP")
print(f"  L4 checksum ok={checksum16(pseudo + seg) == 0}, port {dport} -> the socket of the process listening on {dport}, seq {seq}")
print(f"  L7 WebSocket opcode {op} (text), {n} B, unmasked | L6 UTF-8 -> JSON | L7 {msg['type']}: {msg['side']} {msg['quantity']} {msg['symbol']} @ {msg['price']}")
'''

SRC["w3s3"] = r'''import numpy as np
np.seterr(all="ignore")
import socket
import struct
import time

# 1. the headers: UDP's 8 bytes against TCP's 20 (plus options)
udp_hdr = struct.pack("!HHHH", 51000, 26477, 8 + 36, 0)                         # ports, length, checksum
tcp_hdr = struct.pack("!HHIIBBHHH", 51514, 8765, 1_000_001, 7_000_001, 5 << 4, 0x18, 65535, 0, 0)
print(f"UDP header {len(udp_hdr)} B: ports, length, checksum")
print(f"TCP header {len(tcp_hdr)} B: ports, seq, ack, offset, flags (SYN ACK PSH FIN RST), window, checksum, urgent")

# 2. message boundaries, on this machine's loopback: UDP keeps them, TCP is a byte stream
rx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); rx.bind(("127.0.0.1", 0))
tx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
for m in (b"px=185.49", b"px=185.50", b"px=185.48"):
    tx.sendto(m, rx.getsockname())
print("UDP: 3 sendto  ->", [rx.recvfrom(2048)[0].decode() for _ in range(3)], "(3 datagrams, 3 reads)")
tx.close(); rx.close()
srv = socket.create_server(("127.0.0.1", 0))
cli = socket.create_connection(srv.getsockname())
conn, _ = srv.accept()
for m in (b"px=185.49", b"px=185.50", b"px=185.48"):
    cli.sendall(m)
time.sleep(0.05)
print("TCP: 3 sendall ->", [conn.recv(2048).decode()], "(one stream: where a message ends is your problem)")
for s in (cli, conn, srv):
    s.close()

# 3. ten messages, 2 ms apart, one-way delay 10 ms, and message 4 is lost (deterministic model)
ONE_WAY, GAP, LOST, N = 10.0, 2.0, 4, 10
RTT, RTO = 2 * ONE_WAY, 3 * 2 * ONE_WAY            # retransmit after no ACK for 60 ms (a real RTO is >= 200 ms)
setup = RTT                                         # SYN, SYN-ACK, ACK before the first byte
udp = {k: k * GAP + ONE_WAY for k in range(1, N + 1) if k != LOST}
arrive = {k: setup + k * GAP + ONE_WAY for k in range(1, N + 1)}
arrive[LOST] = setup + LOST * GAP + RTO + ONE_WAY  # the retransmission lands one RTO later
tcp, released = {}, 0.0
for k in range(1, N + 1):                           # in-order delivery: nothing passes the hole
    released = max(released, arrive[k])
    tcp[k] = released
print(f"one-way {ONE_WAY:.0f} ms, a message every {GAP:.0f} ms, message {LOST} lost:")
print(f"  {'msg':>3} {'UDP delivered':>14} {'TCP delivered':>14}  TCP waited behind the hole")
for k in range(1, N + 1):
    u = f"{udp[k]:.0f} ms" if k in udp else "never (gap)"
    hol = tcp[k] - arrive[k] if k != LOST else 0.0
    print(f"  {k:>3} {u:>14} {tcp[k]:>11.0f} ms  {f'{hol:.0f} ms' if hol > 0 else ''}")
print(f"  UDP: 9 of 10, the receiver sees seq 3 then 5 and knows 4 is missing | "
      f"TCP: 10 of 10, every one in order, the last at {max(tcp.values()):.0f} ms instead of {setup + N * GAP + ONE_WAY:.0f} ms")

# 4. the comparison, row by row
ROWS = [("", "TCP", "UDP"),
        ("connection", "3-way handshake, then FIN/RST", "none: just send"),
        ("delivery", "reliable: ACK + retransmit", "best effort: a loss is gone"),
        ("ordering", "in order, always", "as it arrives; seq is yours"),
        ("boundaries", "byte stream: frame it yourself", "one datagram = one message"),
        ("flow/congestion", "receive window, cwnd", "none: may flood or be dropped"),
        ("head-of-line", "a loss stalls later bytes", "none"),
        ("fan-out", "one connection per peer", "multicast: 1 send, N receivers"),
        ("trading use", "order entry, FIX, OUCH, WebSocket", "market data: ITCH, MDP3 multicast")]
for a, b, c in ROWS:
    print(f"{a:<16}{b:<35}{c}")
'''

SRC["w3s4"] = r'''import numpy as np
np.seterr(all="ignore")
import errno
import socket

def say(call, result):
    print(f"  {call:<44} {result}")

print("server")
srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)               # TCP = SOCK_STREAM
say("srv = socket(AF_INET, SOCK_STREAM)", f"a file descriptor: fileno() >= 0 is {srv.fileno() >= 0}")
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
say("srv.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)", "may rebind a port whose old connections sit in TIME_WAIT")
srv.bind(("127.0.0.1", 0))
PORT = srv.getsockname()[1]
say("srv.bind(('127.0.0.1', 0))", f"port 0 = 'any free port'; the OS chose an ephemeral port: {PORT > 1023}")
srv.listen(8)
say("srv.listen(8)", "passive socket; backlog 8 = completed handshakes queued until accept()")

print("client")
cli = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
cli.connect(("127.0.0.1", PORT))
say("cli.connect(('127.0.0.1', PORT))", "SYN, SYN-ACK, ACK done by the kernels; returns BEFORE any accept()")
cli.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
say("cli.setsockopt(IPPROTO_TCP, TCP_NODELAY, 1)", "Nagle off: small writes leave at once (set it for orders)")

print("server")
conn, peer = srv.accept()
say("conn, peer = srv.accept()", f"a NEW socket per client; peer is the client's ephemeral port: {peer[1] == cli.getsockname()[1]}")
say("", f"srv still listens on {PORT == srv.getsockname()[1]}; conn and srv are different fds: {conn.fileno() != srv.fileno()}")

print("data")
n = cli.send(b"BUY 5 AAPL 185.49\n")
say("n = cli.send(b'BUY 5 AAPL 185.49\\n')", f"returns bytes accepted by the kernel: {n} (may be fewer: use sendall)")
say("conn.recv(1024)", repr(conn.recv(1024)))
conn.sendall(b"ACK 1\n")
say("conn.sendall(b'ACK 1\\n'); cli.recv(1024)", repr(cli.recv(1024)))

print("close")
conn.close()
say("conn.close()   (the server hangs up first)", "sends FIN; this side now waits in TIME_WAIT")
say("cli.recv(1024)", f"{cli.recv(1024)!r}  <- empty bytes means the peer closed: stop reading")
cli.close(); srv.close()

print("errors you will meet")
probe = socket.socket()
try:
    probe.connect(("127.0.0.1", PORT))                                 # nobody listens there any more
except ConnectionRefusedError as e:
    say("connect() to a closed port", f"ConnectionRefusedError (errno {errno.errorcode[e.errno]}): the peer answered RST")
finally:
    probe.close()

# the server closed first, so the connection on its port sits in TIME_WAIT (2 x MSL: 30 s to 4 min)
again = socket.socket()
try:
    again.bind(("127.0.0.1", PORT))
    say("bind(PORT) again WITHOUT SO_REUSEADDR", "succeeded")
except OSError as e:
    say("bind(PORT) again WITHOUT SO_REUSEADDR", f"OSError {errno.errorcode[e.errno]}: why servers set SO_REUSEADDR")
finally:
    again.close()
again = socket.socket()
again.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
again.bind(("127.0.0.1", PORT))
say("bind(PORT) again WITH SO_REUSEADDR", "succeeded: the restarted server is back on its port")
again.close()
'''

SRC["w3s5"] = r'''import numpy as np
np.seterr(all="ignore")
import errno
import select
import socket
import time

def say(call, result):
    print(f"  {call:<42} {result}")

print("UDP: no listen, no accept, no connection")
srv = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)                # UDP = SOCK_DGRAM
srv.bind(("127.0.0.1", 0))
say("srv = socket(AF_INET, SOCK_DGRAM); bind()", "ready to receive from anyone, at once")
cli = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
n = cli.sendto(b"QUOTE? AAPL", srv.getsockname())
say("cli.sendto(b'QUOTE? AAPL', (host, port))", f"{n} B sent; the OS gave cli a port on first send")
data, addr = srv.recvfrom(2048)
say("data, addr = srv.recvfrom(2048)", f"{data!r} from the client's port: {addr[1] == cli.getsockname()[1]}")
srv.sendto(b"AAPL 185.48/185.50", addr)                              # reply to whoever asked
say("srv.sendto(reply, addr)", f"client gets {cli.recvfrom(2048)[0]!r}")
cli.sendto(b"0123456789", srv.getsockname())
say("recvfrom(4) on a 10-byte datagram", f"{srv.recvfrom(4)[0]!r}: the rest is discarded, size buffers for the largest")
cli.connect(srv.getsockname())
cli.send(b"connected UDP")
say("cli.connect(addr); cli.send(...)", f"just a default peer, no handshake: {srv.recvfrom(2048)[0]!r}")

print("blocking modes: what recv() does when nothing has arrived")
srv.setblocking(True)
srv.settimeout(0.05)
t = time.perf_counter()
try:
    srv.recvfrom(2048)
except TimeoutError:
    say("settimeout(0.05); recvfrom()", f"TimeoutError, after at least 50 ms: {time.perf_counter() - t >= 0.045}")
srv.setblocking(False)
try:
    srv.recvfrom(2048)
except BlockingIOError as e:
    say("setblocking(False); recvfrom()", f"BlockingIOError at once (errno {errno.errorcode[e.errno]}): poll again later")
srv.settimeout(None)
say("settimeout(None)", "blocking again: recv waits forever (the default)")

print("readiness: one thread watching many sockets (what an event loop does underneath)")
feeds = [socket.socket(socket.AF_INET, socket.SOCK_DGRAM) for _ in range(3)]
for f in feeds:
    f.bind(("127.0.0.1", 0)); f.setblocking(False)
cli2 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
cli2.sendto(b"tick B", feeds[1].getsockname())
cli2.sendto(b"tick C", feeds[2].getsockname())
time.sleep(0.02)
ready, _, _ = select.select(feeds, [], [], 0.1)
say("select.select([A, B, C], [], [], 0.1)", f"ready: {['ABC'[feeds.index(s)] for s in ready]}")
for s in ready:
    say(f"  feed {'ABC'[feeds.index(s)]}.recvfrom()", repr(s.recvfrom(2048)[0]))
ready, _, _ = select.select(feeds, [], [], 0.05)
say("select again, nothing sent", f"ready: {ready} after the 50 ms timeout")
for s in feeds + [cli, cli2, srv]:
    s.close()
'''

SRC["w3s6"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import multiprocessing as mp
import os
import socket
import struct
import time

HDR = struct.Struct("!I")                       # 4-byte big-endian length before every message

def recv_exact(sock, n):
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise ConnectionError("peer closed mid-message")
        buf += chunk
    return buf

def recv_msg(sock):
    (n,) = HDR.unpack(recv_exact(sock, HDR.size))
    return recv_exact(sock, n) if n else None    # length 0 = "goodbye"

def frame(obj):
    body = json.dumps(obj, separators=(",", ":")).encode()
    return HDR.pack(len(body)) + body

def echo_server(port_q):
    """Runs in its OWN process: socket, bind, listen, accept one client, echo every message back."""
    with socket.create_server(("127.0.0.1", 0)) as lst:       # socket() + SO_REUSEADDR + bind() + listen()
        port_q.put((lst.getsockname()[1], os.getpid()))
        conn, _ = lst.accept()
        with conn:
            seq = 0
            while (raw := recv_msg(conn)) is not None:
                seq += 1
                conn.sendall(frame({"seq": seq, "echo": json.loads(raw)}))

if __name__ == "__main__":
    q = mp.Queue()
    server = mp.Process(target=echo_server, args=(q,))
    server.start()
    port, server_pid = q.get(timeout=10)
    print(f"server runs in another process: {server_pid != os.getpid()}; "
          f"listening on an OS-assigned ephemeral port: {port > 1023}")
    with socket.create_connection(("127.0.0.1", port)) as c:
        c.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        orders = [{"type": "place_order", "symbol": s, "side": "buy", "quantity": 5} for s in
                  ("AAPL", "MSFT", "NVDA", "AMZN")]
        c.sendall(frame(orders[0]) + frame(orders[1]) + frame(orders[2]))   # three messages, ONE write
        whole = frame(orders[3])
        for i in range(0, len(whole), 7):                                    # one message, many writes
            c.sendall(whole[i:i + 7])
            time.sleep(0.002)
        for sent in orders:
            reply = json.loads(recv_msg(c))
            print(f"  echo seq={reply['seq']} {reply['echo']['symbol']:<4} identical to what was sent: {reply['echo'] == sent}")
        c.sendall(HDR.pack(0))                                               # orderly goodbye
    server.join(timeout=5)
    print(f"server exited cleanly: {server.exitcode == 0}")
'''

SRC["w3s7"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import multiprocessing as mp
import os
import socket

QUOTES = {"AAPL": (185.48, 185.50), "MSFT": (411.20, 411.24), "NVDA": (122.05, 122.07)}

def quote_server(port_q, drop_first_of):
    """Its OWN process: one UDP socket, no connections; answer each request datagram with one reply."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind(("127.0.0.1", 0))
    port_q.put((s.getsockname()[1], os.getpid()))
    seen, served, from_cache, dropped = {}, 0, 0, False
    while True:
        raw, addr = s.recvfrom(2048)
        req = json.loads(raw)
        if req["type"] == "bye":
            s.sendto(json.dumps({"served": served, "retries_from_cache": from_cache}).encode(), addr)
            break
        if req["id"] in seen:                           # a retry: same answer again, NOT a second execution
            reply = seen[req["id"]]
            from_cache += 1
        else:
            bid, ask = QUOTES.get(req["symbol"], (None, None))
            served += 1
            reply = json.dumps({"id": req["id"], "symbol": req["symbol"], "bid": bid, "ask": ask,
                                "served": served}).encode()
            seen[req["id"]] = reply
            if req["id"] == drop_first_of and not dropped:
                dropped = True                          # simulate the REPLY being lost on the way back
                continue
        s.sendto(reply, addr)
    s.close()

def ask(sock, server, req_id, symbol, timeout=0.2, tries=3):
    msg = json.dumps({"type": "quote", "id": req_id, "symbol": symbol}).encode()
    for attempt in range(1, tries + 1):
        sock.sendto(msg, server)
        sock.settimeout(timeout)
        try:
            while True:
                raw, _ = sock.recvfrom(2048)
                rep = json.loads(raw)
                if rep["id"] == req_id:                 # ignore a late answer to an older request
                    return rep, attempt
        except TimeoutError:
            print(f"  request {req_id} ({symbol}): no reply within {timeout * 1000:.0f} ms, attempt {attempt} -> resend")
    return None, tries

if __name__ == "__main__":
    q = mp.Queue()
    server = mp.Process(target=quote_server, args=(q, 2))       # the reply to request 2 is lost once
    server.start()
    port, pid = q.get(timeout=10)
    print(f"UDP quote server in another process: {pid != os.getpid()}, port is ephemeral: {port > 1023}")
    c = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    for req_id, sym in enumerate(("AAPL", "MSFT", "NVDA"), start=1):
        rep, attempts = ask(c, ("127.0.0.1", port), req_id, sym)
        print(f"  request {req_id} ({sym}) -> bid {rep['bid']} ask {rep['ask']} after {attempts} attempt(s); "
              f"server has served {rep['served']} distinct request(s)")
    c.sendto(json.dumps({"type": "bye"}).encode(), ("127.0.0.1", port))
    c.settimeout(2)
    print("server stats:", json.loads(c.recvfrom(2048)[0]))
    c.close()
    server.join(timeout=5)
    print(f"server exited cleanly: {server.exitcode == 0}")
    print("the reliability here (timeout, resend, request id, de-duplication) was written by hand: UDP gives none of it")
'''

SRC["w3s8"] = r'''import numpy as np
np.seterr(all="ignore")

SOH = "\x01"

def fix(msg_type, seq, body, sender="TEAM07", target="ARENA", when="20261016-14:30:00.000"):
    """Build a FIX 4.4 message: BodyLength (9) counts the bytes after itself up to the checksum
    field; CheckSum (10) is the byte sum mod 256, three digits."""
    fields = [("35", msg_type), ("49", sender), ("56", target), ("34", str(seq)), ("52", when)] + body
    inner = "".join(f"{t}={v}{SOH}" for t, v in fields)
    head = f"8=FIX.4.4{SOH}9={len(inner)}{SOH}"
    cks = sum((head + inner).encode()) % 256
    return f"{head}{inner}10={cks:03d}{SOH}"

def parse(raw):
    pairs = [f.split("=", 1) for f in raw.split(SOH) if f]
    tags = dict(pairs)
    body_start = raw.index(f"{SOH}35=") + 1
    trailer = raw.rindex(f"{SOH}10=") + 1
    ok_len = int(tags["9"]) == len(raw[body_start:trailer].encode())
    ok_sum = int(tags["10"]) == sum(raw[:trailer].encode()) % 256
    return tags, ok_len and ok_sum

show = lambda raw: raw.replace(SOH, "|")
NAMES = {"A": "Logon", "D": "NewOrderSingle", "8": "ExecutionReport", "0": "Heartbeat",
         "1": "TestRequest", "2": "ResendRequest", "4": "SequenceReset"}

logon = fix("A", 1, [("98", "0"), ("108", "30")])                 # no encryption, 30 s heartbeat
order = fix("D", 2, [("11", "ord-0001"), ("55", "AAPL"), ("54", "1"), ("38", "5"),
                     ("40", "2"), ("44", "185.49"), ("59", "0")])  # buy 5 AAPL limit 185.49, day
for raw in (logon, order):
    tags, ok = parse(raw)
    print(f"{NAMES[tags['35']]:<15} {len(raw):3d} B  valid={ok}  {show(raw)}")
# the venue answers with ExecutionReports (35=8): first "New", then a fill
for exec_type, status, last_qty, cum, leaves in (("0", "0", 0, 0, 5), ("F", "2", 5, 5, 0)):
    er = fix("8", 2 if exec_type == "0" else 3, [("37", "V-77812"), ("11", "ord-0001"), ("17", f"E{exec_type}1"),
             ("150", exec_type), ("39", status), ("55", "AAPL"), ("54", "1"), ("38", "5"),
             ("32", str(last_qty)), ("31", "185.49" if last_qty else "0"), ("14", str(cum)), ("151", str(leaves)),
             ("6", "185.49" if cum else "0")], sender="ARENA", target="TEAM07")
    tags, ok = parse(er)
    what = {"0": "New: the order rests", "F": "Trade: filled 5 @ 185.49"}[tags["150"]]
    print(f"{'ExecutionReport':<15} {len(er):3d} B  valid={ok}  150={tags['150']} 39={tags['39']} "
          f"14={tags['14']} 151={tags['151']}  -> {what}")
tampered = order.replace("38=5", "38=9")
print(f"{'tampered qty':<15} {len(tampered):3d} B  valid={parse(tampered)[1]}  (checksum catches it)")

# the session layer: every message carries MsgSeqNum (34); a gap triggers a ResendRequest
print("session, venue side: expecting seq 5")
expected, log = 5, []
for seq, kind in ((5, "D"), (8, "D")):                         # 6 and 7 never arrived
    if seq > expected:
        req = fix("2", 41, [("7", str(expected)), ("16", "0")], sender="ARENA", target="TEAM07")
        log.append(f"  got 34={seq}, expected {expected} -> ResendRequest 7={expected} 16=0 (BeginSeqNo, 0 = to the end)")
        log.append(f"     {show(req)}")
        break
    log.append(f"  got 34={seq} {NAMES[kind]} -> accepted")
    expected = seq + 1
print("\n".join(log))
replay = [fix("D", 6, [("43", "Y"), ("122", "20261016-14:30:00.000"), ("11", "ord-0006"), ("55", "MSFT"),
                       ("54", "2"), ("38", "3"), ("40", "1")]),
          fix("4", 7, [("43", "Y"), ("123", "Y"), ("36", "8")])]   # 7 was a heartbeat: skip it
for raw in replay:
    t, ok = parse(raw)
    extra = " PossDupFlag=Y (resent)" if t["35"] == "D" else " GapFill to NewSeqNo=8 (admin msg not resent)"
    print(f"  client resends 34={t['34']} {NAMES[t['35']]}{extra}  valid={ok}")
print("  then 34=8 is processed; the stream is whole again")

# heartbeats: silence for HeartBtInt -> TestRequest; no Heartbeat back -> the session is dead
hb = 30
for silent in (12, 31, 62):
    act = "nothing" if silent < hb else ("send TestRequest 112=TR1" if silent < 2 * hb else "disconnect, log out")
    print(f"  {silent:2d} s since last message from peer -> {act}")
'''

SRC["w3s9"] = r'''import numpy as np
np.seterr(all="ignore")
import json
import struct

# ---- ITCH 5.0 (market data, venue -> everyone): fixed offsets, big-endian, no field names ----
ADD = struct.Struct("!cHH6sQcI8sI")              # 'A' Add Order: 36 bytes
EXE = struct.Struct("!cHH6sQIQ")                 # 'E' Order Executed: 31 bytes
CXL = struct.Struct("!cHH6sQI")                  # 'X' Order Cancel: 23 bytes
def ts6(ns):
    return ns.to_bytes(6, "big")                 # nanoseconds since midnight in 48 bits
def add_order(ref, side, shares, stock, px, ns):
    return ADD.pack(b"A", 13, 0, ts6(ns), ref, side, shares, stock.ljust(8).encode(), round(px * 10_000))
def executed(ref, shares, match, ns):
    return EXE.pack(b"E", 13, 0, ts6(ns), ref, shares, match)

T0 = 34_200_000_000_123                          # 09:30:00.000000123
msgs = [add_order(880_001, b"B", 500, "AAPL", 185.49, T0), add_order(880_002, b"S", 300, "AAPL", 185.51, T0 + 900),
        CXL.pack(b"X", 13, 0, ts6(T0 + 4_100), 880_002, 100), executed(880_001, 200, 51_001, T0 + 5_400)]
raw = msgs[0]
print(f"ITCH Add Order, {len(raw)} B on the wire: {raw.hex(' ')}")
t, loc, trk, ts, ref, side, sh, stock, px = ADD.unpack(raw)
ns = int.from_bytes(ts, "big")
print(f"  type={t.decode()} locate={loc} time={ns // 3_600_000_000_000:02d}:{ns // 60_000_000_000 % 60:02d}:"
      f"{ns // 1_000_000_000 % 60:02d}.{ns % 1_000_000_000:09d} ref={ref} side={side.decode()} shares={sh} "
      f"stock={stock.decode().strip()} price={px} -> {px / 10_000:.4f} (4 implied decimals)")

# ---- MoldUDP64: the session wrapper that carries ITCH over UDP multicast ----
HDR = struct.Struct("!10sQH")                    # session, sequence number of the FIRST message, count
def mold(session, seq, messages):
    return HDR.pack(session, seq, len(messages)) + b"".join(struct.pack("!H", len(m)) + m for m in messages)
def unmold(pkt):
    session, seq, count = HDR.unpack_from(pkt)
    off, out = HDR.size, []
    for k in range(count):
        (n,) = struct.unpack_from("!H", pkt, off)
        out.append((seq + k, pkt[off + 2:off + 2 + n]))
        off += 2 + n
    return session, out

def apply(book, m):
    kind = m[:1]
    if kind == b"A":
        _, _, _, _, ref, side, sh, stock, px = ADD.unpack(m)
        book[ref] = f"{side.decode()} {sh} @ {px / 10_000:.2f}"
    else:
        ref, sh = (EXE.unpack(m)[4:6] if kind == b"E" else CXL.unpack(m)[4:6])
        side, left, _, px = book[ref].split()
        book[ref] = f"{side} {int(left) - sh} @ {px}"
    return f"{kind.decode()} on {ref}"

SESSION = b"20261016A1"
packets = [mold(SESSION, 1001, msgs[:2]), mold(SESSION, 1004, msgs[3:])]   # the packet with 1003 was lost
expected, book, held = 1001, {}, []
for pkt in packets:
    session, items = unmold(pkt)
    print(f"MoldUDP64 packet {len(pkt)} B: session {session.decode()}, first seq {items[0][0]}, {len(items)} message(s)")
    for seq, m in items:
        if seq > expected:
            held.append((seq, m))
            print(f"  seq {seq}: GAP, expected {expected} -> hold it, mark the book stale, re-request {expected}..{seq - 1}")
            continue
        print(f"  seq {seq}: apply {apply(book, m)} -> {book}")
        expected = seq + 1
_, resent = unmold(mold(SESSION, 1003, msgs[2:3]))                      # the re-request server's answer
for seq, m in resent + held:
    print(f"  seq {seq}: apply {apply(book, m)} -> {book}")
    expected = seq + 1
print(f"  stream whole again at {expected - 1}; only now may the strategy trust the book")

# ---- OUCH 4.2 (order entry, you -> venue): the same style, sent over a TCP session (SoupBinTCP) ----
ENTER = struct.Struct("!c14scI8sII4scccIcc")       # 'O' Enter Order: 49 bytes
o = ENTER.pack(b"O", b"TEAM07-000001".ljust(14), b"B", 500, b"AAPL".ljust(8), 1_854_900, 99_998, b"TM07",
               b"Y", b"A", b"N", 0, b"N", b"R")
f = ENTER.unpack(o)
print(f"OUCH Enter Order {len(o)} B: token={f[1].decode().strip()} {f[2].decode()} {f[3]} {f[4].decode().strip()} "
      f"@ {f[5] / 10_000} tif={f[6]} (99998 = market hours; 0 = IOC) firm={f[7].decode()}")

# ---- SBE (CME MDP 3.0): an 8-byte header names the template; the block is read in place ----
SBE_HDR, BODY = struct.Struct("<HHHH"), struct.Struct("<qiiB3x")
body = BODY.pack(185_490_000_000, 500, 4321, 1)                       # price mantissa (exp -9), qty, security id, side
sbe = SBE_HDR.pack(BODY.size, 46, 1, 9) + body
bl, tid, sid, ver = SBE_HDR.unpack_from(sbe)
print(f"SBE message {len(sbe)} B: blockLength {bl}, templateId {tid}, schema {sid} v{ver}, "
      f"price {BODY.unpack_from(sbe, 8)[0] * 1e-9:.2f} (little-endian, fixed offsets)")

as_json = json.dumps({"type": "add_order", "ref": 880001, "side": "buy", "shares": 500, "symbol": "AAPL",
                      "price": 185.49, "ts": T0}, separators=(",", ":"))
print(f"one add-order: ITCH {len(raw)} B | SBE {len(sbe)} B | JSON {len(as_json)} B")
'''

SRC["w3s10"] = r'''import numpy as np
np.seterr(all="ignore")
import asyncio
import base64
import hashlib
import json

try:
    import websockets
    from websockets.asyncio.client import connect
    from websockets.asyncio.server import serve
    from websockets.exceptions import ConnectionClosed
    from websockets.frames import Close, Frame, Opcode
except ImportError:
    websockets = None

GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"                  # fixed by RFC 6455

async def venue(ws):
    """A stub of the arena's exchange: the first message must be a handshake, then JSON both ways."""
    first = json.loads(await ws.recv())
    if first.get("type") != "handshake":
        await ws.send(json.dumps({"type": "error", "code": "EXPECTED_HANDSHAKE",
                                  "message": "First message must be a Handshake"}))
        return                                                   # returning closes the socket: code 1000
    for bid in (185.48, 185.49):
        await ws.send(json.dumps({"type": "book_snapshot", "symbol": "AAPL", "bids": [[bid, 300]],
                                  "asks": [[round(bid + 0.02, 2), 200]]}))
    async for raw in ws:
        msg = json.loads(raw)
        if msg["type"] == "place_order":
            await ws.send(json.dumps({"type": "order_ack", "order_id": "V-1", "symbol": msg["symbol"],
                                      "side": msg["side"], "price": msg["price"], "quantity": msg["quantity"]}))
        elif msg["type"] == "crash_me":
            ws.transport.abort()                                 # the process dies: no close frame is sent
            return

async def bot(url):
    async with connect(url) as ws:
        rq, rs = ws.request, ws.response
        print(f"GET {rq.path} HTTP/1.1   Upgrade: {rq.headers['Upgrade']}   Connection: {rq.headers['Connection']}   "
              f"Sec-WebSocket-Version: {rq.headers['Sec-WebSocket-Version']}")
        key = rq.headers["Sec-WebSocket-Key"]
        print(f"  Sec-WebSocket-Key: {len(base64.b64decode(key))} random bytes, base64 (new on every connect)")
        accept = base64.b64encode(hashlib.sha1((key + GUID).encode()).digest()).decode()
        print(f"HTTP/1.1 {rs.status_code} {rs.reason_phrase}   Sec-WebSocket-Accept = base64(SHA-1(key + GUID)): "
              f"{rs.headers['Sec-WebSocket-Accept'] == accept}")
        await ws.send(json.dumps({"type": "handshake", "team_id": "TEAM07", "role": "trader", "level": 1}))
        for _ in range(2):
            m = json.loads(await ws.recv())
            print(f"  <- {m['type']:<14} bid {m['bids'][0]} ask {m['asks'][0]}")
        await ws.send(json.dumps({"type": "place_order", "team_id": "TEAM07", "symbol": "AAPL", "side": "buy",
                                  "order_type": "limit", "price": 185.49, "quantity": 5}))
        m = json.loads(await ws.recv())
        print(f"  <- {m['type']:<14} {m['order_id']} {m['side']} {m['quantity']} {m['symbol']} @ {m['price']}")
        rtt = await (await ws.ping())                            # opcode 0x9 out, 0xA back
        print(f"  ping -> pong answered by the peer's library: {rtt < 0.05}")
    print(f"  closed by us: code {ws.close_code} (normal closure)")

    async with connect(url) as ws:                               # break the protocol: no handshake first
        await ws.send(json.dumps({"type": "place_order", "symbol": "AAPL"}))
        err = json.loads(await ws.recv())
        await ws.wait_closed()
        print(f"  no handshake -> error {err['code']}, then closed by the venue: code {ws.close_code}")

    async with connect(url) as ws:                               # the peer vanishes without a closing handshake
        await ws.send(json.dumps({"type": "handshake", "team_id": "TEAM07", "role": "trader", "level": 1}))
        await ws.recv(); await ws.recv()
        await ws.send(json.dumps({"type": "crash_me"}))
        try:
            await ws.recv()
        except ConnectionClosed as e:
            print(f"  peer died -> {type(e).__name__}, code {ws.close_code} (abnormal: no close frame received)")

def show_frames():
    text = Frame(Opcode.TEXT, b'{"type":"order_ack"}').serialize(mask=False, extensions=[])
    ping = Frame(Opcode.PING, b"").serialize(mask=False, extensions=[])
    close = Frame(Opcode.CLOSE, Close(1000, "").serialize()).serialize(mask=False, extensions=[])
    for name, f in (("text frame (server)", text), ("ping", ping), ("close 1000", close)):
        print(f"  {name:<20} {f[:2].hex(' '):<6}{('+ ' + f[2:].hex(' ')) if name == 'close 1000' else '':<10} FIN={f[0] >> 7} opcode=0x{f[0] & 0x0F:x} "
              f"MASK={f[1] >> 7} len={f[1] & 0x7F}")
    body = b'{"type":"place_order"}'
    masked = Frame(Opcode.TEXT, body).serialize(mask=True, extensions=[])
    print(f"  text frame (client)  {masked[:2].hex(' ')} + 4-byte mask key + XOR-masked payload: "
          f"{len(masked)} B for a {len(body)}-byte message")

async def main():
    async with serve(venue, "127.0.0.1", 0) as server:
        await bot(f"ws://127.0.0.1:{server.sockets[0].getsockname()[1]}")

if websockets is None:
    print("websockets is not installed: pip install websockets")
else:
    print("websockets", websockets.__version__)
    asyncio.run(main())
    print("frames on the wire:")
    show_frames()
    print("the arena's JSON over WebSocket, against the protocols of this week:")
    for row in (("transport", "TCP, ws:// on 8765 (wss:// adds TLS)", "FIX/OUCH on TCP, ITCH on UDP multicast"),
                ("session start", "handshake {team_id, role, level}, 15 s", "FIX Logon 35=A, SoupBinTCP login"),
                ("liveness", "ping/pong frames, every 20 s by default", "FIX Heartbeat 35=0, TestRequest 35=1"),
                ("order entry", "place_order, cancel_order", "NewOrderSingle 35=D, OUCH 'O'"),
                ("order state", "order_ack, queue_update, trade_execution", "ExecutionReport 35=8"),
                ("market data", "book_snapshot: the whole book each time", "ITCH A/E/X deltas + snapshot"),
                ("rejects", "error {code, message}", "Reject 35=3"),
                ("gap recovery", "reconnect, re-handshake, next snapshot", "ResendRequest 35=2, re-request"),
                ("encoding", "JSON text frames", "tag=value text; binary ITCH, SBE")):
        print(f"  {row[0]:<14}{row[1]:<43}{row[2]}")
'''


def _code(key):
    return {"lang": "python", "src": SRC[key], "output": ""}


TITLE = ("Session 2 · Networking and trading protocols: the seven layers, UDP and TCP, sockets, "
         "FIX, ITCH and OUCH, and WebSocket")

INTRO = (
    "<p>Open the laptop in class and start your bot. Before the first book snapshot arrives, the laptop has "
    "associated with the access point and agreed the radio keys, leased an IP address, a gateway and a DNS "
    "resolver by DHCP, found the gateway's MAC address with ARP, asked DNS for the venue's address over UDP, "
    "opened a TCP connection and upgraded an HTTP request to a WebSocket. Each of those steps belongs to one "
    "layer of one model. This week takes the model apart in order: the seven layers, the two transports, the "
    "socket calls you program them with, a real server and client for each, the protocols that trading runs "
    "on, and last the WebSocket the arena uses, mapped onto everything before it.</p>"
)

TOPICS = [
    "the seven OSI layers and the four of TCP/IP: the job, PDU, header and devices of each; encapsulation",
    "UDP versus TCP: connection, ordering, reliability, boundaries, head-of-line blocking, multicast",
    "the socket API: socket, bind, listen, accept, connect, send, recv, sendto, recvfrom, close; "
    "blocking, timeouts, SO_REUSEADDR, backlog",
    "a TCP echo server and client, and a UDP server and client, each in two processes",
    "financial protocols: FIX sessions and orders, ITCH over MoldUDP64, OUCH, SBE, FAST and MDP 3.0",
    "WebSocket: the upgrade, frames, ping/pong, close codes, and the arena's JSON mapped onto the protocols",
    "capability you leave with: read a trading protocol layer by layer, and write the socket code under it",
]

CONCEPTS = [
    # ── step 1 · the seven layers ────────────────────────────────────────────────
    {
        "name": "The seven layers, bottom half: physical, data link and network move bits, frames and packets",
        "explain": (
            "<p>The OSI model splits networking into seven layers. Each has one job, a name for its unit of data "
            "(the PDU) and, usually, a header it adds. The bottom three get a packet to the right machine. "
            "<strong>Layer 1, physical</strong>, turns bits into signals: voltage on copper, light in fibre, radio "
            "for Wi-Fi. Its PDU is the bit, and the devices that work there are the NIC's transceiver, cables, "
            "optics, repeaters and hubs. The snippet prints what the layer costs: 12.3 µs to serialise a full "
            "1,518-byte frame at 1 Gb/s and 1.23 µs at 10 Gb/s, one reason colocated firms pay for faster links.</p>"
            "<p><strong>Layer 2, data link</strong>, moves a <em>frame</em> across one link, addressed by MAC "
            "address. An Ethernet frame is a 6-byte destination MAC, a 6-byte source MAC, a 2-byte EtherType "
            "(0x0800 for IPv4), the payload padded to the 64-byte minimum, and a 4-byte frame check sequence, a "
            "CRC-32 that the receiver recomputes. In the snippet one flipped bit fails the check and the frame is "
            "dropped. A <strong>switch</strong> works at this layer: it learns which MAC address lives behind "
            "which port from the source addresses it sees, floods a frame whose destination it has not learned yet, "
            "and from then on forwards to one port only.</p>"
            "<p><strong>Layer 3, network</strong>, moves a <em>packet</em> from host to host across networks by IP "
            "address. The 20-byte IPv4 header carries the two addresses, a TTL, the protocol number (6 for TCP, 17 "
            "for UDP) and a header checksum. A <strong>router</strong> works here. It chooses the next hop by "
            "longest-prefix match in its routing table, decrements the TTL, recomputes the checksum and leaves the "
            "addresses alone. ARP, which finds the MAC address behind an IP address on the local subnet, sits "
            "between layers 2 and 3.</p>"
        ),
        "code": _code("w3s1"),
    },
    {
        "name": "The seven layers, top half: transport, session, presentation and application, and encapsulation end to end",
        "explain": (
            "<p>The top four layers get the bytes to the right <em>program</em>, in a form it understands. "
            "<strong>Layer 4, transport</strong>, adds ports, so that one machine can hold many conversations, and "
            "either reliability (TCP, whose PDU is the segment) or nothing more (UDP, the datagram). It is the next "
            "concept. <strong>Layer 5, session</strong>, keeps a conversation alive across messages: logon, "
            "authentication, checkpoints, resumption. <strong>Layer 6, presentation</strong>, fixes how the data is "
            "represented: UTF-8 and JSON, binary encodings such as SBE, encryption by TLS. <strong>Layer 7, "
            "application</strong>, says what a message means: HTTP, WebSocket, FIX, DNS. The Internet's own model, "
            "TCP/IP, has four layers (link, internet, transport, application) and folds 5 to 7 into one. In "
            "practice TLS, WebSocket and the FIX session all run inside your process, not in the kernel.</p>"
            "<p>The snippet sends one arena order down the stack. The 118-byte JSON <code>place_order</code> is "
            "UTF-8 encoded. WebSocket frames it with 6 bytes: FIN and opcode, the mask bit and the length, and a "
            "4-byte masking key. TCP adds 20 bytes of ports, sequence and acknowledgement numbers and a checksum "
            "computed over a pseudo-header that includes both IP addresses. IPv4 adds 20 bytes, and Ethernet 14 in "
            "front and the 4-byte FCS behind. The 182-byte frame is 65% order. The receiver runs the stack in "
            "reverse: each layer checks its own field, then uses one number to choose who gets the rest. The "
            "EtherType selects IPv4, the protocol number selects TCP, the destination port selects the socket of "
            "the process, and the opcode says the payload is text.</p>"
            "<p>The widget below draws the same stack. Click any layer for its job, PDU, header fields, protocols "
            "and devices, then send a message through it.</p>"
        ),
        "code": _code("w3s2"),
    },
    # ── step 2 · UDP against TCP ─────────────────────────────────────────────────
    {
        "name": "UDP against TCP: datagrams or a reliable byte stream, and what one lost packet costs each",
        "explain": (
            "<p>Both transports run on IP and add ports. Everything else differs. <strong>TCP</strong> opens a "
            "connection with a three-way handshake (SYN, SYN-ACK, ACK), numbers every byte, acknowledges what "
            "arrives and retransmits what does not, delivers in order, and slows down when the receiver's window is "
            "full (flow control) or the network drops packets (congestion control). Its header is 20 bytes or more. "
            "What it delivers is a <em>byte stream</em> with no message boundaries: in the snippet three "
            "<code>sendall</code> calls come out of one <code>recv</code> as 27 glued bytes. <strong>UDP</strong> "
            "adds an 8-byte header and nothing else: no connection, no acknowledgement, no ordering, no "
            "retransmission, no flow control. But each datagram arrives whole or not at all, so three "
            "<code>sendto</code> calls give three reads.</p>"
            "<p>The price of TCP's guarantee shows when a packet is lost. In the snippet's model ten messages leave "
            "2 ms apart over a 10 ms path, and message 4 is dropped. UDP delivers the other nine on time, and the "
            "receiver sees sequence number 5 after 3, so it knows exactly what is missing. TCP delivers all ten in "
            "order, but nothing passes the hole: messages 5 to 10 reach the receiver and wait there until the "
            "retransmission of 4 lands, 48 to 58 ms late. That is <strong>head-of-line blocking</strong>. TCP also "
            "spends one round trip on the handshake before its first byte.</p>"
            "<p>Trading uses both, for opposite reasons. Market data goes out as <strong>UDP multicast</strong>: one "
            "datagram reaches every subscriber, nobody waits for a slow reader, and sequence numbers plus a recovery "
            "service handle the losses. Order entry runs over <strong>TCP</strong> (FIX, OUCH, the arena's "
            "WebSocket), where every message must arrive exactly once and in order. The widget below runs both "
            "side by side: turn the loss on and off.</p>"
        ),
        "code": _code("w3s3"),
    },
    # ── step 3 · the socket API ──────────────────────────────────────────────────
    {
        "name": "The TCP socket API, call by call: socket, bind, listen, accept, connect, send, recv, close",
        "explain": (
            "<p>A socket is your program's handle on a transport endpoint: a file descriptor that the kernel ties "
            "to TCP or UDP. A TCP <strong>server</strong> makes four calls before any data moves. "
            "<code>socket(AF_INET, SOCK_STREAM)</code> creates the descriptor. <code>bind((host, port))</code> "
            "attaches it to a local address: port 0 lets the OS choose a free ephemeral port, and "
            "<code>127.0.0.1</code> admits only local clients where <code>0.0.0.0</code> admits anyone. "
            "<code>listen(backlog)</code> makes it a passive socket, and the backlog bounds how many completed "
            "handshakes may queue up waiting for the program. <code>accept()</code> blocks until one is queued and "
            "returns a <em>new</em> socket for that client, with the client's address; the listening socket keeps "
            "listening. The <strong>client</strong> makes two calls, <code>socket()</code> and "
            "<code>connect((host, port))</code>, which runs the handshake. The snippet shows that "
            "<code>connect</code> returns before the server has called <code>accept</code>: the two kernels finish "
            "the handshake by themselves and park the connection in the backlog.</p>"
            "<p>Then the data. <code>send</code> returns how many bytes the kernel took, which can be fewer than you "
            "passed, so use <code>sendall</code>. <code>recv(n)</code> returns <em>up to</em> n bytes, whatever has "
            "arrived, and returns <code>b\"\"</code> once the peer has closed: that empty read is the only "
            "end-of-stream signal you get. <code>close()</code> sends FIN. Two options belong on trading sockets. "
            "<code>TCP_NODELAY</code> turns off Nagle's algorithm, which otherwise holds a small write until the "
            "previous one is acknowledged. <code>SO_REUSEADDR</code> lets a restarted server bind its port again: in "
            "the snippet the server hung up first, its side of the connection waits in TIME_WAIT, and a plain "
            "<code>bind</code> to the same port fails with EADDRINUSE, while one with the option succeeds. A "
            "<code>connect</code> to a port with no listener fails at once with <code>ConnectionRefusedError</code>, "
            "because the peer's kernel answers with RST.</p>"
        ),
        "code": _code("w3s4"),
    },
    {
        "name": "The UDP socket API, and what blocking, non-blocking and timeouts do to every call",
        "explain": (
            "<p>UDP needs fewer calls because there is no connection. A server calls "
            "<code>socket(AF_INET, SOCK_DGRAM)</code> and <code>bind</code> and can receive straight away: no "
            "<code>listen</code>, no <code>accept</code>. <code>recvfrom(bufsize)</code> returns one whole datagram "
            "and the sender's address, and the reply goes back with <code>sendto(data, addr)</code>. A client need "
            "not even bind, since the OS gives it an ephemeral port on its first <code>sendto</code>. Two details "
            "from the snippet matter. A datagram larger than the buffer you pass is truncated and the rest is "
            "discarded, so size the buffer for the largest message. And <code>connect()</code> on a UDP socket only "
            "records a default peer so that <code>send</code> needs no address: no packet is exchanged.</p>"
            "<p>Every socket, TCP or UDP, is in one of three modes, and the mode decides what a call does when "
            "there is nothing to read. <strong>Blocking</strong>, the default (<code>settimeout(None)</code>), waits "
            "for ever, which is how a bot hangs on a dead feed. <strong>Timeout</strong> "
            "(<code>settimeout(0.05)</code>) waits at most that long and then raises <code>TimeoutError</code>, the "
            "right default for request and response code. <strong>Non-blocking</strong> "
            "(<code>setblocking(False)</code>) never waits: it raises <code>BlockingIOError</code> (EAGAIN) at once, "
            "so the program has to ask the kernel which sockets are ready. <code>select.select</code> does that. "
            "Given three feed sockets with data waiting on B and C, it returns B and C; after a quiet timeout it "
            "returns nothing.</p>"
            "<p>That readiness loop, scaled up with <code>epoll</code> on Linux or <code>kqueue</code> on macOS, "
            "is what an asyncio event loop runs underneath: one thread, many non-blocking sockets, and work only "
            "where data is waiting.</p>"
        ),
        "code": _code("w3s5"),
    },
    # ── step 4 · server and client examples ─────────────────────────────────────
    {
        "name": "A TCP echo server and client in two processes, with length-prefix framing",
        "explain": (
            "<p>Here server and client are two operating-system processes, started from one file with "
            "<code>multiprocessing</code>. The server process calls "
            "<code>socket.create_server((\"127.0.0.1\", 0))</code>, which is <code>socket</code>, "
            "<code>SO_REUSEADDR</code>, <code>bind</code> and <code>listen</code> in one call. It reports its "
            "ephemeral port back through a queue and blocks in <code>accept()</code>. The client connects and sets "
            "<code>TCP_NODELAY</code>, and the two speak a framed protocol: every message is a 4-byte big-endian "
            "length followed by that many bytes of JSON, and a length of zero means goodbye. The server echoes each "
            "message back, inside an envelope with its own sequence number.</p>"
            "<p>Framing is needed because TCP is a byte stream, and the client tests it on purpose. It writes three "
            "orders in a single <code>sendall</code>, so one server read may hold all three, then writes the fourth "
            "in 7-byte pieces with pauses, so the server sees fragments. <code>recv_exact</code> handles both: it "
            "loops until it has exactly <code>n</code> bytes, because <code>recv(n)</code> may return fewer, and "
            "raises if the peer closes in the middle of a message. The output shows four echoes, in order, each "
            "identical to what was sent, and a server process that exits with status 0 after the goodbye.</p>"
            "<p>Three habits carry straight into the arena and into any exchange gateway. Loop on <code>recv</code> "
            "until a whole message is in hand. Give the protocol an explicit end, here the zero length, so that a "
            "clean shutdown can be told apart from a crash. And put the length first: a reader that knows the size "
            "before it reads can bound its buffer and reject an absurd length, instead of scanning untrusted bytes "
            "for a delimiter.</p>"
        ),
        "code": _code("w3s6"),
    },
    {
        "name": "A UDP quote server and client in two processes: timeouts, retries and request ids by hand",
        "explain": (
            "<p>The UDP version is the same exercise without a connection, so the client must supply the "
            "reliability that TCP gave the previous one. The server process binds one datagram socket and loops on "
            "<code>recvfrom</code>. Each request is one JSON datagram carrying a request id and a symbol; each answer "
            "is one datagram sent back to the address the request came from. There is no accept and no per-client "
            "socket: one socket serves every client.</p>"
            "<p>The script loses the server's reply to request 2 once, standing in for a dropped datagram. The "
            "client sends each request, sets a 200 ms timeout and waits. Requests 1 and 3 are answered at the first "
            "attempt. For request 2 the timeout fires, the client sends the same request again with the same id, "
            "and this time the answer arrives. The server has seen id 2 before, so it returns the stored answer "
            "instead of executing the request twice: its statistics show three requests served and one retry "
            "answered from the cache. The client also ignores any reply whose id is not the one it is waiting for, "
            "because a late answer to an older request can turn up at any moment.</p>"
            "<p>Timeouts, retransmission, request ids and duplicate suppression are what TCP does inside the "
            "kernel, rebuilt here in about twenty lines. For a quote request that is a fair trade. For an order it "
            "is not: a retry that is not idempotent can buy twice. That is why order entry runs on TCP with session "
            "sequence numbers, and why every order carries a client order id (FIX tag 11) that the venue uses to "
            "reject duplicates.</p>"
        ),
        "code": _code("w3s7"),
    },
    # ── step 5 · financial protocols ─────────────────────────────────────────────
    {
        "name": "FIX: tag=value messages, header, body and trailer, the session layer, NewOrderSingle and ExecutionReport",
        "explain": (
            "<p>FIX, the Financial Information eXchange protocol, has carried orders between brokers, buy-side "
            "firms and venues since the 1990s, usually over a plain TCP connection. A message is a flat list of "
            "<code>tag=value</code> fields separated by the SOH byte (0x01, printed as | here), in three parts. The "
            "<strong>header</strong> opens with <code>8=FIX.4.4</code> and <code>9=</code>, the BodyLength in bytes "
            "from the next field up to the checksum, then <code>35</code> MsgType, <code>49</code> and "
            "<code>56</code> sender and target, <code>34</code> MsgSeqNum and <code>52</code> SendingTime. The "
            "<strong>body</strong> holds the business fields. The <strong>trailer</strong> is <code>10=</code>, the "
            "byte sum modulo 256 in three digits. The snippet builds and verifies a Logon (35=A, heartbeat interval "
            "108=30), a NewOrderSingle (35=D: client order id 11, symbol 55, side 54=1 for buy, quantity 38=5, "
            "limit 40=2 at price 44), and the venue's two ExecutionReports (35=8): ExecType 150=0, New, with "
            "LeavesQty 151=5, then 150=F, a trade, with CumQty 14=5 and OrdStatus 39=2, filled. Changing one digit "
            "of the quantity breaks the checksum.</p>"
            "<p>FIX's real contribution is its <strong>session layer</strong>, a layer-5 protocol carried inside the "
            "messages. Each side numbers what it sends and checks what it receives. The venue in the snippet "
            "expects 6, receives 8, and sends a ResendRequest (35=2 with 7=6 and 16=0, from 6 to the end). The "
            "client resends 6 with PossDupFlag 43=Y, so that it cannot be taken for a new order, and replaces 7, a "
            "heartbeat not worth resending, with a SequenceReset in gap-fill mode (35=4, 123=Y, 36=8). Then 8 is "
            "processed, in order. Silence is handled the same way: no traffic for one heartbeat interval triggers a "
            "TestRequest (35=1), and no Heartbeat (35=0) in reply means the session is dead.</p>"
        ),
        "code": _code("w3s8"),
    },
    {
        "name": "ITCH over MoldUDP64, OUCH, and a note on SBE, FAST and MDP 3.0: binary market data and order entry",
        "explain": (
            "<p>Exchange feeds drop text altogether. NASDAQ's TotalView-<strong>ITCH</strong> is the canonical "
            "binary market-data protocol: every message has a one-byte type and fields at fixed offsets, big-endian, "
            "with no names and no delimiters. An Add Order (type A) is 36 bytes: stock locate, tracking number, a "
            "6-byte timestamp in nanoseconds since midnight, the order reference number, B or S, shares, the symbol "
            "padded to 8 bytes, and the price as an integer with four implied decimals. The snippet decodes one: buy "
            "500 AAPL at 185.4900 at 09:30:00.000000123. Order Cancel (X) and Order Executed (E) then shrink a "
            "resting order by its reference number; from such deltas the receiver builds the book itself.</p>"
            "<p>ITCH travels inside <strong>MoldUDP64</strong> over UDP multicast. Each packet carries a 10-byte "
            "session, the 64-bit sequence number of its first message and a message count, then each message behind "
            "a 2-byte length. In the snippet the second packet starts at 1004 when 1003 was expected. The handler "
            "holds it, marks the book stale, asks the re-request server for 1003, applies 1003 and then 1004, and "
            "only then trusts the book again. Venues also publish each feed twice, on A and B lines over separate "
            "paths, so most gaps are filled from the other line without asking.</p>"
            "<p><strong>OUCH</strong> is the order-entry side: fixed binary messages over a TCP session "
            "(SoupBinTCP). An Enter Order (O) is 49 bytes: a 14-byte order token, side, shares, stock, price, time in "
            "force, firm and flags. CME's <strong>MDP 3.0</strong> feed is encoded in <strong>SBE</strong>, Simple "
            "Binary Encoding: an 8-byte header naming the template and schema version, then a little-endian block "
            "read in place. Its predecessor <strong>FAST</strong> compressed FIX with stop-bit integers and deltas. "
            "One add order is 36 bytes in ITCH, 28 in this SBE layout and 110 as "
            "JSON.</p>"
        ),
        "code": _code("w3s9"),
    },
    # ── step 6 · WebSocket ───────────────────────────────────────────────────────
    {
        "name": "WebSocket, last: the HTTP upgrade, frames, ping/pong, close codes, and the arena mapped onto the week",
        "explain": (
            "<p>WebSocket (RFC 6455) is the protocol the arena speaks, and it starts as HTTP on a TCP connection. "
            "The client sends a <code>GET</code> with <code>Upgrade: websocket</code>, <code>Connection: "
            "Upgrade</code>, <code>Sec-WebSocket-Version: 13</code> and a <code>Sec-WebSocket-Key</code> of 16 random "
            "bytes. The server answers <code>101 Switching Protocols</code> with <code>Sec-WebSocket-Accept</code>, "
            "base64(SHA-1(key + a fixed GUID)), which the snippet recomputes. From then on the connection carries "
            "<strong>frames</strong> both ways: a first byte holding FIN and the opcode (0x1 text, 0x2 binary, 0x8 "
            "close, 0x9 ping, 0xA pong), a second holding the mask bit and the length (2 or 8 more bytes for long "
            "messages), and, from client to server only, a 4-byte masking key XORed over the payload.</p>"
            "<p><strong>Ping and pong</strong> are the liveness check, answered by the peer's library without your "
            "code; <code>websockets</code> pings every 20 seconds by default and drops a peer that stays silent. "
            "Closing is a handshake too: the close frame carries a 2-byte code. 1000 is normal closure; 1001 going "
            "away, 1002 protocol error, 1008 policy violation, 1009 message too big and 1011 server error are sent "
            "by peers. 1006 is never sent: it is reported when the connection died without a close frame, as on the "
            "snippet's third connection.</p>"
            "<p>The snippet runs a stub of the arena with <code>serve</code> and a bot with <code>connect</code>. "
            "As on the real exchange, the first message must be a <code>handshake</code> with team, role and level, "
            "or the venue answers <code>EXPECTED_HANDSHAKE</code> and closes. The table at the end maps the arena "
            "onto the week: TCP underneath, the handshake for a Logon, ping for Heartbeat, <code>place_order</code> "
            "for NewOrderSingle, <code>order_ack</code> and <code>trade_execution</code> for ExecutionReport, full "
            "snapshots instead of ITCH deltas, and a reconnect with a fresh snapshot instead of a ResendRequest, "
            "because inside one TCP connection nothing goes missing.</p>"
        ),
        "code": _code("w3s10"),
    },
]

# ── the osi-stack widget: every layer's data lives here, the widget only draws it ──
OSI_LAYERS = [
    {"n": 7, "name": "Application", "examples": "HTTP, WebSocket, FIX, DNS",
     "pdu": "data",
     "job": "Gives programs a shared language for what a message means: an order, a quote, a web page.",
     "header": {"proto": "WebSocket frame header", "short": "WS",
                "fields": [{"f": "FIN + opcode", "b": 1}, {"f": "MASK + length", "b": 1}, {"f": "masking key", "b": 4}]},
     "protocols": "HTTP, WebSocket, FIX messages, DNS, ITCH, OUCH",
     "devices": "Hosts; L7 load balancers and API gateways (they read the request), web application firewalls",
     "note": "The arena's JSON messages, FIX tag=value and ITCH or OUCH binary messages all live here."},
    {"n": 6, "name": "Presentation", "examples": "TLS, JSON, SBE",
     "pdu": "data",
     "job": "Decides how the data is represented: character encoding, serialisation, compression and encryption.",
     "header": {"proto": "TLS 1.3 record", "short": "TLS",
                "fields": [{"f": "content type", "b": 1}, {"f": "version", "b": 2}, {"f": "length", "b": 2}],
                "trailer": [{"f": "auth tag", "b": 16}]},
     "protocols": "TLS (encryption), UTF-8 and JSON, SBE, FAST, protobuf",
     "devices": "Hosts; TLS-terminating load balancers and reverse proxies",
     "note": "JSON is text that describes itself; ITCH and SBE are fixed-offset binary, decoded in place. "
             "The arena's ws:// carries no TLS; wss:// would add this record."},
    {"n": 5, "name": "Session", "examples": "TLS session, FIX session",
     "pdu": "data",
     "job": "Keeps a conversation alive between two programs: open it, authenticate, checkpoint, resume.",
     "header": {"proto": "", "fields": []},
     "protocols": "TLS handshake and resumption, the FIX session layer (Logon, Heartbeat, ResendRequest), SoupBinTCP, MoldUDP64",
     "devices": "Hosts only",
     "note": "In the Internet stack this layer adds no header of its own: FIX carries its session fields "
             "(34 MsgSeqNum, 52 SendingTime, 108 HeartBtInt) inside every message."},
    {"n": 4, "name": "Transport", "examples": "TCP, UDP",
     "pdu": "segment",
     "job": "Delivers bytes from one program to another by port, as a reliable ordered stream (TCP) or as independent datagrams (UDP).",
     "header": {"proto": "TCP header", "short": "TCP",
                "fields": [{"f": "src port", "b": 2}, {"f": "dst port", "b": 2}, {"f": "sequence", "b": 4},
                           {"f": "ack", "b": 4}, {"f": "offset + flags", "b": 2}, {"f": "window", "b": 2},
                           {"f": "checksum", "b": 2}, {"f": "urgent", "b": 2}]},
     "protocols": "TCP, UDP (whose PDU is the datagram, header 8 B), QUIC on top of UDP",
     "devices": "The hosts' kernels; stateful firewalls and NAT routers (they track ports); L4 load balancers",
     "note": "Order entry (FIX, OUCH, the arena's WebSocket) runs on TCP; market data on UDP multicast."},
    {"n": 3, "name": "Network", "examples": "IP, ICMP, ARP",
     "pdu": "packet",
     "job": "Moves a packet from host to host across networks, hop by hop, by IP address.",
     "header": {"proto": "IPv4 header", "short": "IPv4",
                "fields": [{"f": "version + IHL", "b": 1}, {"f": "DSCP / ECN", "b": 1}, {"f": "total length", "b": 2},
                           {"f": "identification", "b": 2}, {"f": "flags + fragment", "b": 2}, {"f": "TTL", "b": 1},
                           {"f": "protocol", "b": 1}, {"f": "checksum", "b": 2}, {"f": "source IP", "b": 4},
                           {"f": "destination IP", "b": 4}]},
     "protocols": "IPv4, IPv6, ICMP (ping, traceroute), IGMP (multicast joins); ARP maps IP to MAC between L2 and L3",
     "devices": "Routers, layer-3 switches, firewalls that filter by address",
     "note": "Every router decrements the TTL and recomputes the checksum; the addresses stay the same end to end unless NAT rewrites them."},
    {"n": 2, "name": "Data link", "examples": "Ethernet, Wi-Fi",
     "pdu": "frame",
     "job": "Moves a frame across one link to the next device, by MAC address, and drops frames that arrive damaged.",
     "header": {"proto": "Ethernet II header", "short": "Eth",
                "fields": [{"f": "dst MAC", "b": 6}, {"f": "src MAC", "b": 6}, {"f": "EtherType", "b": 2}],
                "trailer": [{"f": "FCS", "b": 4}]},
     "protocols": "Ethernet (802.3), Wi-Fi (802.11), VLAN tags (802.1Q)",
     "devices": "Switches, bridges, Wi-Fi access points, the NIC",
     "note": "A switch learns which MAC lives behind which port and forwards to that port only; "
             "a colo switch adds well under a microsecond per hop."},
    {"n": 1, "name": "Physical", "examples": "copper, fibre, radio",
     "pdu": "bits",
     "job": "Turns bits into signals on a medium and back: voltage on copper, light in fibre, radio in the air.",
     "header": {"proto": "Ethernet preamble", "short": "Pre",
                "fields": [{"f": "preamble", "b": 7}, {"f": "start delimiter", "b": 1}]},
     "protocols": "1000BASE-T, 10GBASE-SR, 802.11 radio (OFDM), line coding",
     "devices": "NIC transceiver, cables, fibre and optics, repeaters, hubs, media converters",
     "note": "Serialising a 1,518-byte frame takes 12.3 µs at 1 Gb/s and 1.2 µs at 10 Gb/s, before any distance."},
]

WIDGETS = [
    {
        "type": "osi-stack",
        "title": "The seven layers: click one, then send a message down one stack and up the other",
        "after": 2,
        "params": {"layers": OSI_LAYERS, "message": {"label": "JSON order", "bytes": 118}, "select": 4,
                   "step_ms": 900},
    },
    {
        "type": "tcp-vs-udp",
        "title": "TCP against UDP on one timeline: handshake, a lost packet, retransmission against fire-and-forget",
        "after": 3,
        "params": {"rtt": 20, "msgs": 6, "gap": 4, "loss": True, "seed": 33503},
    },
]

PITFALLS = [
    "Treating one recv() as one message. TCP is a byte stream: frame every message, for instance with a length "
    "prefix, loop until it is whole, and treat an empty read as the peer closing.",
    "Treating a UDP feed as reliable. Without sequence checks, A/B arbitration and a re-request or snapshot path, "
    "one lost datagram leaves a wrong book that no later message repairs.",
    "Blocking sockets with no timeout, and order sockets with Nagle on. Set a timeout or run non-blocking under an "
    "event loop, set TCP_NODELAY on order entry, and SO_REUSEADDR on servers.",
    "After a reconnect, resetting FIX sequence numbers, or resending an order without PossDupFlag and its original "
    "ClOrdID. Recover the gap instead: a blind retry can trade twice.",
]

CHECK = [
    {
        "q": "A frame from your laptop crosses a switch and then a router on its way to the venue. What does each device do to it?",
        "options": [
            "The switch rewrites the IP addresses; the router rewrites the TCP ports",
            "The switch forwards on the destination MAC and rewrites nothing; the router reads the IP address, "
            "builds a new layer-2 header and decrements the TTL",
            "Both decrypt the TLS record to find the destination",
            "Neither reads any header; only the two endpoints do",
        ],
        "answer": 1,
        "why": "A switch is a layer-2 device that learns and forwards by MAC. A router works at layer 3: new link header each hop, TTL minus one, addresses kept.",
    },
    {
        "q": "Why do exchanges publish market data over UDP multicast but take orders over TCP?",
        "options": [
            "UDP is encrypted and TCP is not",
            "One multicast datagram reaches every subscriber with no handshake and no head-of-line blocking, and "
            "sequence numbers expose losses; an order must arrive exactly once and in order, which TCP guarantees",
            "TCP cannot carry binary messages",
            "UDP guarantees delivery for packets under 1,500 bytes",
        ],
        "answer": 1,
        "why": "Stale market data is worth little and losses are recovered by sequence number; a lost or reordered order is a real position, so it needs TCP.",
    },
    {
        "q": "A server's handler does msg = json.loads(conn.recv(4096)). It passes every test on a laptop and fails in production with JSONDecodeError. Why, and what is the fix?",
        "options": [
            "4096 is too small: use recv(65536)",
            "The client should call send() rather than sendall()",
            "recv returns up to 4096 bytes of a byte stream, which may be part of a message or several glued "
            "together; frame messages with a length prefix and loop until exactly that many bytes are in",
            "Switch to UDP and change nothing else",
        ],
        "answer": 2,
        "why": "TCP keeps no message boundaries, as the echo snippet shows: one write may arrive in pieces, three may arrive as one. recv_exact plus a length prefix fixes it.",
    },
    {
        "q": "Your bot's WebSocket to the arena dies (close code 1006) and reconnects. A FIX client would send a ResendRequest. What does the arena's protocol rely on instead?",
        "options": [
            "Nothing: WebSocket retransmits lost frames across connections",
            "Ask the venue to replay messages by sequence number",
            "Send the handshake again and rebuild state from the next full book_snapshot, since the arena sends "
            "whole snapshots, not sequenced deltas",
            "Keep the old book, since only new trades matter",
        ],
        "answer": 2,
        "why": "Inside one TCP connection nothing is lost; across a reconnect the arena has no MsgSeqNum to resend, so full snapshots make the restart self-healing.",
    },
]

ASYNCIO_W4_TOPICS = [
    "asyncio: coroutines, tasks, gather and the event loop; concurrency is not parallelism",
    "asyncio.Queue: producer/consumer, backpressure and conflation; never block the loop",
    "races between awaits, locks, cancellation and reconnection with backoff",
]


def apply(WEEKS):
    """Replace week 3 with the networking week above, and move the asyncio week it used to hold
    (five concepts and the code-trace widget) to the front of week 4, whose WebSocket client,
    heartbeats and reconnection run on that event loop."""
    w3, w4 = WEEKS[2], WEEKS[3]
    assert w3["n"] == 3 and w4["n"] == 4
    asyncio_concepts = list(w3["concepts"])
    assert len(asyncio_concepts) == 5 and all("asyncio" in c["code"]["src"] for c in asyncio_concepts), \
        "expected the five asyncio concepts of gen_finm_33500.py's week 3"
    trace = w3["widget"]
    assert isinstance(trace, dict) and trace["type"] == "code-trace"
    asyncio_pitfalls = [w3["pitfalls"][0], w3["pitfalls"][3]]      # blocking the loop; reconnect hygiene

    # the asyncio concepts said "week 3" about what is now this same week 4, and "week 6" about processes (week 2 now)
    for c in asyncio_concepts:
        c["explain"] = (c["explain"]
                        .replace("which is why week 3 adds sequence numbers and snapshots",
                                 "which is why the last concept of this week adds sequence numbers and snapshots")
                        .replace("goes to processes (week 6)", "goes to processes (week 2)"))

    w4["title"] = ("Session 3 · asyncio and socket streaming: one event loop, typed WebSocket schemas, "
                   "heartbeats, reconnection")
    w4["topics"] = ASYNCIO_W4_TOPICS + [t for t in w4["topics"]
                                        if not t.startswith("the network stack in brief")]
    n_async = len(asyncio_concepts)
    w4["concepts"] = asyncio_concepts + w4["concepts"]
    w4_widgets = w4["widget"] if isinstance(w4["widget"], list) else [w4["widget"]]
    trace = dict(trace, after=n_async)                 # the loop trace sits right after the asyncio concepts
    w4["widget"] = [trace] + w4_widgets
    # SCHEMA.md caps pitfalls at 4: keep week 4's framing and bad-input pitfalls, add asyncio's two
    w4["pitfalls"] = [w4["pitfalls"][0], w4["pitfalls"][3]] + asyncio_pitfalls

    w3.clear()
    w3.update({"n": 3, "title": TITLE, "intro": INTRO, "topics": TOPICS, "concepts": CONCEPTS,
               "widget": WIDGETS, "pitfalls": PITFALLS, "check": CHECK})

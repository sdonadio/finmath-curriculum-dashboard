"""Run SRC snippets from the generator: stdout, stderr, runtime, determinism (2 runs)."""
import importlib.util, os, subprocess, sys, tempfile, time

GEN = os.path.expanduser("~/PycharmProjects/FinMathCurriculumArena/tools/gen_finm_33500.py")
spec = importlib.util.spec_from_file_location("gen", GEN)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

prefix = sys.argv[1] if len(sys.argv) > 1 else ""
quiet = "-q" in sys.argv
bad = 0
for key, src in gen.SRC.items():
    if not key.startswith(prefix):
        continue
    outs = []
    for _ in range(2):
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, "snip.py")
            open(p, "w").write(src)
            t = time.time()
            r = subprocess.run([sys.executable, "snip.py"], cwd=d, capture_output=True, text=True, timeout=60)
            dt = time.time() - t
        outs.append(r.stdout)
    status = "OK"
    if r.returncode or r.stderr:
        status = "FAIL"
    elif outs[0] != outs[1]:
        status = "NONDETERMINISTIC"
    if status != "OK" or dt > 8:
        bad += 1
    print(f"===== {key}  {status}  {dt:.2f}s")
    if not quiet or status != "OK":
        print(r.stdout)
    if r.stderr:
        print("STDERR:", r.stderr[-2000:])
    if status == "NONDETERMINISTIC":
        print("RUN2:", outs[0])
print("bad:", bad)

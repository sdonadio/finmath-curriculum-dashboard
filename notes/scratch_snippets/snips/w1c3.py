import numpy as np
np.seterr(all="ignore")
import os, tempfile

def run_fake_command():
    stdout_lines = ["checked 3 files", "0 errors"]
    stderr_lines = ["warning: unused import in utils.py"]
    return stdout_lines, stderr_lines

out, err = run_fake_command()

with tempfile.TemporaryDirectory() as d:
    out_path = os.path.join(d, "out.txt")
    err_path = os.path.join(d, "err.txt")
    both_path = os.path.join(d, "all.txt")

    with open(out_path, "w") as f:
        f.write("\n".join(out) + "\n")
    with open(err_path, "w") as f:
        f.write("\n".join(err) + "\n")

    with open(both_path, "w") as f:
        for line in out:
            f.write(line + "\n")
        for line in err:
            f.write(line + "\n")

    print("out.txt:", open(out_path).read().splitlines())
    print("err.txt:", open(err_path).read().splitlines())
    print("all.txt (2>&1):", open(both_path).read().splitlines())
    print()
    print("a pipeline (`cmd | next`) only ever connects stdout;",
          "stderr would still land on the terminal even when piped")

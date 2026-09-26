import numpy as np
np.seterr(all="ignore")

class FakeEnv:
    def __init__(self, name, packages):
        self.name = name
        self.packages = dict(packages)

    def import_(self, pkg):
        if pkg not in self.packages:
            raise ImportError(f"No module named '{pkg}' in env {self.name!r}")
        return f"{pkg}=={self.packages[pkg]}"

env_a = FakeEnv("service-a", {"pandas": "1.5.3", "numpy": "1.24.4"})
env_b = FakeEnv("service-b", {"pandas": "2.2.2", "numpy": "1.26.4"})

print("service-a imports:", env_a.import_("pandas"))
print("service-b imports:", env_b.import_("pandas"))
print("same interpreter host, two different pandas versions coexist:",
      env_a.import_("pandas") != env_b.import_("pandas"))

try:
    env_a.import_("polars")
except ImportError as exc:
    print("\nservice-a has not installed polars:", exc)

print("\nwithout isolation, a single global site-packages could only hold ONE",
      "version of pandas -- whichever was installed last wins for every project")

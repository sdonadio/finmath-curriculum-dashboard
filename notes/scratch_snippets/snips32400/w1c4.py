import numpy as np
np.seterr(all="ignore")  # this machine's BLAS emits spurious FP warnings on ordinary finite data

# Two "environments" that both claim to pin the exact same package versions.
ENV_A = {"packages": {"numpy": "1.26.4", "pandas": "2.2.0"}, "python": "3.11.6",
         "platform": "linux-x86_64"}
ENV_B = {"packages": {"numpy": "1.26.4", "pandas": "2.2.0"}, "python": "3.11.6",
         "platform": "linux-x86_64"}
ENV_C = {"packages": {"numpy": "1.26.4", "pandas": "2.2.0"}, "python": "3.9.2",
         "platform": "macos-arm64"}

print("all three environments pin identical package versions:")
for name, env in (("A", ENV_A), ("B", ENV_B), ("C", ENV_C)):
    print(f"  env {name}: packages={env['packages']}  python={env['python']}  "
          f"platform={env['platform']}")
same_packages = ENV_A["packages"] == ENV_B["packages"] == ENV_C["packages"]
print(f"\npackages identical across all three: {same_packages}")

# A pinned package list is necessary but not sufficient: the SAME values,
# summed in a DIFFERENT order, can land on a different floating-point result,
# because IEEE-754 addition is not associative once magnitudes differ a lot.
# This stands in for the kind of drift a different BLAS reduction order or a
# different thread count can actually introduce between two "identical" envs.
big, small = 1.0e16, 1.0
values = [big, small, small, small, small, small, small, small, -big]
order_env_a = values                        # small terms accumulate first-ish
order_env_c = [big, -big] + [small] * 7      # the two big terms cancel first


def naive_sum(xs):
    total = 0.0
    for x in xs:
        total += x
    return total


sum_a = naive_sum(order_env_a)
sum_c = naive_sum(order_env_c)
print(f"\nthe same nine floating-point values, summed in two different orders:")
print(f"  env A's order -> {sum_a!r}")
print(f"  env C's order -> {sum_c!r}")
print(f"  true mathematical total (exact integer arithmetic): "
      f"{sum(int(round(v)) for v in values)}")
print(f"  bit-for-bit identical: {sum_a == sum_c}")

print("\na requirements lock pins WHICH CODE runs; it does not pin the order")
print("floating-point addition happens in, which depends on the platform's")
print("BLAS build, thread count, and reduction strategy. Once a computation")
print("mixes very different magnitudes -- a large notional netted against a")
print("small one, say -- summing left-to-right silently loses the small")
print("terms entirely, while summing the large terms together first recovers")
print("the exact answer. 'Identical package versions' guarantees the same")
print("code runs; it does not guarantee the same arithmetic order, and a")
print("manifest that only records package versions will call these two runs")
print("'the same' when they provably are not.")

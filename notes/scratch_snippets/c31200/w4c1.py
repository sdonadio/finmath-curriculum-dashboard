import numpy as np
np.seterr(all="ignore")

# A constant-product AMM (Uniswap v2 style) holds a pool of two reserves
# x and y and enforces x * y = k on every trade: buying dx of token X in
# exchange for token Y moves the pool along that hyperbola, and the
# EXECUTION price is the average price paid across the whole trade, not
# the pool's current marginal price -- the gap between the two IS the
# slippage, and it grows nonlinearly with trade size relative to pool depth.

def swap_out(reserve_in, reserve_out, amount_in, fee=0.003):
    amount_in_after_fee = amount_in * (1 - fee)
    k = reserve_in * reserve_out
    new_reserve_in = reserve_in + amount_in_after_fee
    new_reserve_out = k / new_reserve_in
    amount_out = reserve_out - new_reserve_out
    return amount_out, new_reserve_in, new_reserve_out

reserve_x, reserve_y = 500_000.0, 1_000_000.0        # pool: 500k TOKEN, 1,000,000 USDC
spot_price = reserve_y / reserve_x                    # USDC per TOKEN, before the trade
print("pool reserves: %.0f TOKEN / %.0f USDC   spot price = %.4f USDC/TOKEN\n"
      % (reserve_x, reserve_y, spot_price))

print(" trade size (TOKEN sold)   USDC received   avg execution price   slippage vs spot")
for trade_size in (100, 1_000, 5_000, 25_000, 100_000):
    out, _, _ = swap_out(reserve_x, reserve_y, trade_size)
    avg_price = out / trade_size
    slippage = (spot_price - avg_price) / spot_price
    print("      %7d                %10.1f          %8.4f              %6.2f%%"
          % (trade_size, out, avg_price, 100 * slippage))

# The fee is charged on amount IN, so even an infinitesimally small trade
# never executes exactly at the spot price -- there is a floor to how
# little slippage can ever be, set purely by the fee tier.
out_tiny, _, _ = swap_out(reserve_x, reserve_y, 1.0)
floor_slippage = (spot_price - out_tiny / 1.0) / spot_price
print("\na 1-TOKEN trade (negligible size/depth ratio) still slips %.3f%% -- the 0.3%%"
      % (100 * floor_slippage))
print("fee tier's floor, below which no trade, however small, can ever price")

# Splitting one large trade into several smaller ones through the SAME pool
# saves nothing net -- the pool's state after all of them is identical --
# but it does change WHO ends up bearing the price impact if other trades
# land in between; show the total received is the same either way absent
# interleaving.
whole, _, _ = swap_out(reserve_x, reserve_y, 20_000)
rx, ry = reserve_x, reserve_y
split_total = 0.0
for chunk in [5_000] * 4:
    out_chunk, rx, ry = swap_out(rx, ry, chunk)
    split_total += out_chunk
print("\n20,000 TOKEN sold in one trade      : %.4f USDC received" % whole)
print("20,000 TOKEN sold as four 5,000 chunks: %.4f USDC received (same pool, no interleaving)"
      % split_total)
print("difference: %.6f USDC (rounds to zero -- splitting alone changes nothing without"
      % (whole - split_total))
print("someone ELSE trading in the gaps between your chunks)")

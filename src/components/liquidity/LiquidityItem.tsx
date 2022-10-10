import React, { useState } from "react";
import ethw from "../../assets/chains/ethw.png";
import arrow_down from "../../assets/down_arrow.svg";

const LiquidityItem = ({
  addLiquidityToggle,
  setAddLiquidityToggle,
  removeLiquidtyToggle,
  setRemoveLiquidityToggle,
  pool,
}: {
  addLiquidityToggle: boolean;
  setAddLiquidityToggle: any;
  removeLiquidtyToggle: boolean;
  setRemoveLiquidityToggle: any;
  pool: any;
}) => {
  const [dropdown, setDropDown] = useState(false);

  return (
    <section className="flex flex-col gap-4 w-full  px-2 py-4 border  rounded-xl">
      <section className="flex items-center w-full justify-between">
        <div className="flex items-center gap-2">
          <img src={ethw} alt="icon" className="w-10 h-10" />
          <span className="text-secondary font-bold">
            {pool.tokenA.symbol}/{pool.tokenB.symbol}
          </span>
        </div>
        <button
          className="flex items-center gap-2 text-center focus:outline-none"
          onClick={() => setDropDown(!dropdown)}
        >
          <span className="text-secondary font-bold ">Manage</span>
          <img
            src={arrow_down}
            alt="manage liquidity"
            className="w-3 h-3 mt-1 mr-2"
          />
        </button>
      </section>
      {dropdown && (
        <section className="flex flex-col items-start gap-3 font-bold text-secondary text-sm">
          <div className="flex itesm-center w-full justify-between">
            <span>Your total pool tokens</span>
            <span>{pool.signerBalance}</span>
          </div>
          <div className="flex itesm-center w-full justify-between">
            <span>Pooled {pool.tokenA.symbol}</span>
            <div className="flex gap-1 items-center">
              <span>{pool.reserveA}</span>
              <img src={ethw} alt="icon" className="w-4 h-4" />
            </div>
          </div>
          <div className="flex itesm-center w-full justify-between">
            <span>Pooled {pool.tokenB.symbol}</span>
            <div className="flex gap-1 items-center">
              <span>{pool.reserveB}</span>
              <img src={ethw} alt="icon" className="w-4 h-4" />
            </div>
          </div>
          <div className="flex itesm-center w-full justify-between">
            <span>Your pool share</span>
            <span>
              {pool.poolShare < 0
                ? pool.poolShare.toString().substring(0, 4)
                : pool.poolShare.toFixed(2)}
              %
            </span>
          </div>
          <div className="flex items-center gap-3 w-full">
            <button
              className="button_nogradient2 hover:border-[#5aa1ed] hover:text-[#5aa1ed] text-[#3685ed] font-bold rounded-2xl text-center w-1/2 py-2.5"
              onClick={() => setAddLiquidityToggle(!addLiquidityToggle)}
            >
              Add
            </button>
            <button
              className="button_nogradient2 hover:border-[#5aa1ed] hover:text-[#5aa1ed] text-[#3685ed] font-bold rounded-2xl text-center w-1/2 py-2.5"
              onClick={setRemoveLiquidityToggle}
            >
              Remove
            </button>
          </div>
        </section>
      )}
    </section>
  );
};

export default LiquidityItem;

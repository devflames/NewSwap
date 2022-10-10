import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import { TOKENS } from "../../constants/Tokens";
// import Input from "./Input";
import { BiArrowBack } from "react-icons/bi";
import plus from "../../assets/plus.svg";
import { removeLiquidity } from "../../hooks/liquidityHooks";
import { approveToken, checkTokenAllowance } from "../../hooks/generalHooks";

const RemoveLiquidity = ({
  toggle,
  callback,
  selectedPool,
}: {
  toggle: boolean;
  callback: any;
  selectedPool: any;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenOne, setTokenOne] = useState(TOKENS[0]);
  const [isAllowed, setIsAllowed] = useState(false);

  const [amount, setAmount] = useState(0);

  const handleRemoveLiquidity = () => {
    removeLiquidity(amount, selectedPool.tokenA, selectedPool.tokenB);
    callback(!toggle);
  };

  useEffect(() => {
    checkTokenAllowance(selectedPool.lpAddress).then((res) => {
      setIsAllowed(res);
    });
  }, [selectedPool.lpAddress]);

  const approve = () => {
    approveToken(selectedPool.lpAddress);
    setIsAllowed(true);
  };

  return (
    <section className="flex flex-col items-center  bg-primary text-secondary gap-4 px-5 py-3 pb-5 w-[27rem] min-h-[410px] rounded-3xl mb-6">
      <header className="flex w-full items-center justify-between pt-2">
        <BiArrowBack
          className=" text-secondary w-6 h-6 antialiased focus:outline-none cursor-pointer"
          onClick={() => callback(!toggle)}
        />

        <span className="font-bold text-xl text-gray-700 antialiased mr-6">
          Remove Liquidity
        </span>

        <div></div>
      </header>
      <main className="flex flex-col gap-3 items-center w-full antialiased">
        <section className="flex flex-col border px-5 py-3 gap-3 w-full rounded-2xl items-start">
          <span className="text-secondary font-bold">Amount</span>
          <label htmlFor="amount" className="text-secondary text-3xl font-bold">
            {amount}%
          </label>
          <input
            type="range"
            value={amount}
            className="slider w-full"
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <section className="w-full flex justify-between">
            <button
              className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-sm font-bold "
              onClick={() => {
                setAmount(25);
              }}
            >
              25%
            </button>
            <button
              className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-sm font-bold "
              onClick={() => {
                setAmount(50);
              }}
            >
              50%
            </button>
            <button
              className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-sm font-bold "
              onClick={() => {
                setAmount(75);
              }}
            >
              75%
            </button>
            <button
              className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-sm font-bold "
              onClick={() => {
                setAmount(100);
              }}
            >
              MAX
            </button>
          </section>
        </section>
        <span>
          <img
            src={plus}
            alt="plus"
            className="mt-3 mb-3 w-[20px] h-[20px] self-end"
          />
        </span>
        <section className="flex flex-col border px-5 py-3 gap-2 w-full rounded-2xl items-start">
          <section className="flex justify-between items-center w-full">
            <span>-</span>
            <span>OREO</span>
          </section>
          <section className="flex justify-between items-center w-full">
            <span>-</span>
            <span className="flex items-center gap-1">
              <img
                src={tokenOne.logoURI}
                alt={selectedPool.tokenA.symbol}
                className="w-6 h-6"
              />
              <span>{selectedPool.tokenA.symbol}</span>
            </span>
          </section>
          <section className="flex justify-between items-center w-full">
            <span></span>
            <span className="text-accent">
              Receive {selectedPool.tokenB.symbol}
            </span>
          </section>
        </section>
        <section className="py-3 mt-3 border-rounded-xl text-start flex w-full items-start justify-between">
          <span>Price</span>
          <span>
            {`1${selectedPool.tokenA.symbol} = ${"1"} ${
              selectedPool.tokenB.symbol
            }`}
            <br />
            {`1 ${selectedPool.tokenB.symbol}=${"1"} ${
              selectedPool.tokenA.symbol
            }`}
          </span>
        </section>
      </main>
      <section className="w-full flex gap-2">
        {/* <Button
          styles={"w-1/2 font-bold"}
          callback={() => {}}
          placeholder={"Approve"}
        /> */}
        <Button
          styles={"w-1/2 font-bold"}
          callback={isAllowed ? () => handleRemoveLiquidity() : () => approve()}
          placeholder={isAllowed ? "Remove Liquidity" : "Approve"}
        />
      </section>
    </section>
  );
};

export default RemoveLiquidity;

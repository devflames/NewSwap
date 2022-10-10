import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import { TOKENS } from "../../constants/Tokens";
import Input from "./Input";
import { BiArrowBack } from "react-icons/bi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useAccount, useConnect } from "wagmi";
import { ethers } from "ethers";
import contractAddresses from "../../utils/contractAddresses.json";
// import routerABI from "../../utils/ABIS/routerABI.json";
import erc20ABI from "../../utils/ABIS/erc20ABI.json";
// import factoryABI from "../../utils/ABIS/erc20ABI.json";
import {
  addLiquidity,
  addLiquidityETH,
  getLiquidityPoolShare,
} from "../../hooks/liquidityHooks";
import { getAmountOut } from "../../hooks/generalHooks";
import plus from "../../assets/plus.svg";

const CreatePair = ({
  toggle,
  callback,
}: {
  toggle: boolean;
  callback: any;
}) => {
  const [tokenOne, setTokenOne] = useState(TOKENS[0]);
  const [tokenTwo, setTokenTwo] = useState(TOKENS[1]);
  const [tokenOneValue, setTokenOneValue] = useState(0);
  const [tokenTwoValue, setTokenTwoValue] = useState(0);

  const [amounts1, setAmounts1] = useState(0 || "");
  const [amounts2, setAmounts2] = useState(0 || "");

  const [poolShare, setPoolShare] = useState(0 || "");
  const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address, isConnected } = useAccount();

  useEffect(() => {
    getAmountOut(1, tokenOne, tokenTwo).then((res) => {
      setAmounts1((res / Math.pow(10, 18)).toFixed(6));
    });
    getAmountOut(1, tokenTwo, tokenOne).then((res) => {
      setAmounts2((res / Math.pow(10, 18)).toFixed(6));
    });
  }, [tokenOne, tokenTwo]);

  useEffect(() => {
    getLiquidityPoolShare(tokenOne, tokenTwo).then((res) => {
      if (res < 0) {
        setPoolShare((prev) => (prev = res?.toString().substring(0, 4)));
      } else {
        setPoolShare((prev) => (prev = res?.toFixed(2)));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleTokenAValue = async (value: any) => {
    setTokenOneValue(value);
    if (value > 0) {
      const amount = await getAmountOut(value, tokenOne, tokenTwo);
      if (amount / Math.pow(10, 18) <= 0) {
        setInsufficientLiquidity(true);
      } else {
        setInsufficientLiquidity(false);
      }
      setTokenTwoValue(amount / Math.pow(10, 18));
    } else {
      setTokenTwoValue(0);
    }
  };

  const handleTokenBValue = async (value: any) => {
    setTokenTwoValue(value);
    if (value > 0) {
      const amount = await getAmountOut(value, tokenTwo, tokenOne);
      if (amount / Math.pow(10, 18) <= 0) {
        setInsufficientLiquidity(true);
      } else {
        setInsufficientLiquidity(false);
      }
      setTokenOneValue(amount / Math.pow(10, 18));
    } else {
      setTokenOneValue(0);
    }
  };

  const handleSetTokenOne = (value: any) => {
    setTokenOne(value);
    if (typeof window.ethereum !== "undefined") {
      getLiquidityPoolShare(value, tokenTwo).then((res) => {
        if (res < 0) {
          setPoolShare((prev) => (prev = res?.toString().substring(0, 4)));
        } else {
          setPoolShare((prev) => (prev = res?.toFixed(2)));
        }
      });
      getAmountOut(tokenTwoValue, tokenTwo, value).then((amount) => {
        if (amount / Math.pow(10, 18) <= 0) {
          setInsufficientLiquidity(true);
        } else {
          setInsufficientLiquidity(false);
        }
        setTokenOneValue(amount / Math.pow(10, 18));
      });
    }
  };

  const handleSetTokenTwo = (value: any) => {
    setTokenTwo(value);
    if (typeof window.ethereum !== "undefined") {
      getLiquidityPoolShare(value, tokenOne).then((res) => {
        if (res < 0) {
          setPoolShare((prev) => (prev = res?.toString().substring(0, 4)));
        } else {
          setPoolShare((prev) => (prev = res?.toFixed(2)));
        }
      });
      getAmountOut(tokenOneValue, tokenOne, value).then((amount) => {
        console.log(amount);

        if (amount / Math.pow(10, 18) <= 0) {
          setInsufficientLiquidity(true);
        } else {
          setInsufficientLiquidity(false);
        }
        setTokenTwoValue(amount / Math.pow(10, 18));
      });
    }
  };

  const handleAddLiquidity = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      if (isConnected && address) {
        const routerAddr = contractAddresses.routerAddress;
        const tokenA = new ethers.Contract(tokenOne.address, erc20ABI, signer);
        const tokenB = new ethers.Contract(tokenTwo.address, erc20ABI, signer);
        const allowanceA = await tokenA.allowance(
          signer.getAddress(),
          routerAddr
        );
        const allowanceB = await tokenB.allowance(
          signer.getAddress(),
          routerAddr
        );
        if (allowanceA / Math.pow(10, 18) < tokenOneValue) {
          await tokenA.approve(
            routerAddr,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        }
        if (allowanceB / Math.pow(10, 18) < tokenTwoValue) {
          await tokenB.approve(
            routerAddr,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        }
        if (tokenOne.symbol === "WETH") {
          addLiquidityETH(
            tokenTwo,
            tokenTwoValue,
            tokenOneValue,
            1,
            signer,
            20
          );
        } else if (tokenTwo.symbol === "WETH") {
          addLiquidityETH(
            tokenOne,
            tokenOneValue,
            tokenTwoValue,
            1,
            signer,
            20
          );
        } else {
          addLiquidity(
            tokenOne,
            tokenOneValue,
            tokenTwo,
            tokenTwoValue,
            1,
            signer,
            20
          );
        }
      }
    }
  };

  return (
    <section className="flex flex-col items-center  bg-primary text-secondary gap-4 px-5 py-3 pb-5 w-[27rem] min-h-[410px] rounded-3xl mb-6">
      <header className="flex w-full items-center justify-between pt-2">
        <BiArrowBack
          className=" text-secondary w-6 h-6 antialiased focus:outline-none cursor-pointer"
          onClick={() => callback(!toggle)}
        />

        <span className="font-bold text-xl text-gray-700 antialiased mr-6">
          Create Pair
        </span>

        <div></div>
      </header>
      <main className="flex flex-col gap-3 items-center w-full antialiased">
        <Input
          token={tokenOne}
          setToken={handleSetTokenOne}
          value={tokenOneValue}
          setter={handleTokenAValue}
          meta={{
            value1: tokenOne,
            value2: tokenTwo,
            setter1: setTokenOne,
            setter2: setTokenTwo,
            origin: "firstToken",
          }}
        />
        <span>
          <img
            src={plus}
            alt="plus"
            className="mt-3 mb-3 w-[20px] h-[20px] self-end"
          />
        </span>
        <Input
          token={tokenTwo}
          setToken={handleSetTokenTwo}
          value={tokenTwoValue}
          setter={handleTokenBValue}
          meta={{
            value1: tokenOne,
            value2: tokenTwo,
            setter1: setTokenOne,
            setter2: setTokenTwo,
            origin: "secondToken",
          }}
        />
        <section className="py-3 mt-3 rounded-xl text-start flex flex-col gap-3 w-full items-center">
          <section className="flex items-center gap-5">
            <div className="flex flex-col gap-1 items-center">
              <span className="font-bold">{amounts1}</span>
              <span>{`${tokenTwo.symbol} per ${tokenOne.symbol}`}</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <span className="font-bold">{amounts2}</span>
              <span>{`${tokenOne.symbol} per ${tokenTwo.symbol}`}</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <span className="font-bold">{poolShare}%</span>
              <span>Share of Pool</span>
            </div>
          </section>
        </section>
      </main>
      {isConnected && address ? (
        <Button
          styles={"w-full font-bold"}
          callback={() => handleAddLiquidity()}
          placeholder={`${
            insufficientLiquidity ? "Insufficient liquidity" : "Create Pair"
          }`}
        />
      ) : (
        <Button
          styles={"w-full font-bold"}
          callback={() => connect()}
          placeholder={"Connect Wallet"}
        />
      )}
    </section>
  );
};

export default CreatePair;

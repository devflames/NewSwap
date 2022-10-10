import React, { useEffect, useState } from "react";
import settings from "../../assets/settings.svg";
import history from "../../assets/history.svg";
import Input from "./Input";
import swap_card_button from "../../assets/swap_card_button.svg";
import { TOKENS } from "../../constants/Tokens";
import SettingsModal from "../modals/Settings";
import Button from "../../common/Button";
import RecentTxnModal from "../modals/RecentTxn";
import TxnCompleteModal from "../modals/TxnComplete";
import right_oreo from "../../assets/right_oreo.png";
import left_oreo from "../../assets/left_oreo.png";
import { useAccount, useConnect } from "wagmi";
import { ethers } from "ethers";
import contractAddresses from "../../utils/contractAddresses.json";
import routerABI from "../../utils/ABIS/routerABI.json";
import erc20ABI from "../../utils/ABIS/erc20ABI.json";
import {
  swapExactETHForTokens,
  swapExactTokensForETH,
  swapExactTokensForTokens,
  getAmountOut,
  getPath,
  getAmountAfterSlippage,
  approveToken,
  checkTokenAllowance,
} from "../../hooks/generalHooks";
import { InjectedConnector } from "wagmi/connectors/injected";
import arrow_down from "../../assets/down_arrow.svg";

const SwapCard = () => {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);

  // for modals

  const [showSettings, setShowSettings] = useState(false);
  const [showRecentTXN, setShowRecentTXN] = useState(false);
  const [showTXNComplete, setShowTXNComplete] = useState(false);

  // settings

  const [slippage, setSlippage] = useState(1);
  const [deadline, setDeadline] = useState(20);

  // errors

  const [slippageError, setSlippageError] = useState(false);

  // dropdown

  const [detailsDropDown, setDetailsDropDown] = useState(false);

  const [swap, setSwap] = useState(true);
  const [amountOut, setAmountOut] = useState(0 || "");
  const [amountOutMin, setAmountOutMin] = useState(0);
  const [insufficientLiquidity, setInsufficientLiquidity] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  // const [chain, setChain] = useState(CHAINS[0]);

  const { address, isConnected } = useAccount();

  // const wethAddr = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

  useEffect(() => {
    let from = fromToken;
    let to = toToken;
    let fromval = fromValue;
    let toval = toValue;
    setFromToken(to);
    setToToken(from);
    setFromValue(toval);
    setToValue(fromval);
  }, [swap]); //eslint-disable-line

  useEffect(() => {
    getPath(fromToken, toToken);
    getAmountOut(1, fromToken, toToken).then((res) => {
      setAmountOut((res / Math.pow(10, 18)).toFixed(6));
    });
  }, [fromToken, toToken, swap, slippage]);

  useEffect(() => {
    getAmountAfterSlippage(toValue, slippage).then((res) =>
      setAmountOutMin(res)
    );
  }, [fromValue, toValue, slippage]);

  useEffect(() => {
    checkTokenAllowance(fromToken.address).then((res) => {
      setIsAllowed(res);
    });
  }, [fromToken]);

  const swapTokens = async (
    fromToken: any,
    toToken: any,
    fromValue: any,
    toValue: any
  ) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      if (isConnected && address) {
        const router = new ethers.Contract(
          contractAddresses.routerAddress,
          routerABI,
          signer
        );
        const tokenIn = new ethers.Contract(
          fromToken.address,
          erc20ABI,
          signer
        );
        const allowance = await tokenIn.allowance(
          signer.getAddress(),
          router.address
        );
        if (allowance / Math.pow(10, 18) < fromValue) {
          await tokenIn.approve(
            router.address,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          );
        } else {
          if (fromToken.symbol === "WETH") {
            swapExactETHForTokens(
              toToken,
              fromValue,
              signer,
              router,
              slippage,
              deadline
            );
          } else if (toToken.symbol === "WETH") {
            swapExactTokensForETH(
              fromToken,
              fromValue,
              signer,
              router,
              slippage,
              deadline
            );
          } else {
            swapExactTokensForTokens(
              fromToken,
              toToken,
              fromValue,
              signer,
              router,
              slippage,
              deadline
            );
          }
        }
      }
    }
  };

  const handleTokenInValue = async (value: any) => {
    setFromValue(value);
    if (typeof window.ethereum !== "undefined") {
      if (value > 0) {
        const amount = await getAmountOut(value, fromToken, toToken);
        if (amount / Math.pow(10, 18) <= 0) {
          setInsufficientLiquidity(true);
        } else {
          setInsufficientLiquidity(false);
        }
        setToValue(amount / Math.pow(10, 18));
      } else {
        setToValue(0);
      }
    }
  };

  const handleTokenOutValue = async (value: any) => {
    setToValue(value);
    if (typeof window.ethereum !== "undefined" && value > 0) {
      if (value > 0) {
        const amount = await getAmountOut(value, toToken, fromToken);
        if (amount / Math.pow(10, 18) <= 0) {
          setInsufficientLiquidity(true);
        } else {
          setInsufficientLiquidity(false);
        }
        setFromValue(amount / Math.pow(10, 18));
      } else {
        setToValue(0);
      }
    }
  };

  const handleSetFromToken = async (token: any) => {
    setFromToken(token);
    const amount = await getAmountOut(fromValue, token, toToken);
    if (amount / Math.pow(10, 18) <= 0) {
      setInsufficientLiquidity(true);
    } else {
      setInsufficientLiquidity(false);
    }
    setToValue(amount / Math.pow(10, 18));
  };

  const handleSetToToken = async (token: any) => {
    setToToken(token);
    const amount = await getAmountOut(fromValue, fromToken, token);
    if (amount / Math.pow(10, 18) <= 0) {
      setInsufficientLiquidity(true);
    } else {
      setInsufficientLiquidity(false);
    }
    setToValue(amount / Math.pow(10, 18));
  };

  const approve = () => {
    approveToken(fromToken.address);
    setIsAllowed(true);
  };

  useEffect(() => {
    if (slippage < 0 || slippage >= 50) setSlippageError(true);
    else setSlippageError(false);
  }, [slippage]);

  return (
    <section className="flex items-center gap-10 font-primary h-full">
      <img
        src={left_oreo}
        alt="logo_left"
        className="object-contain w-[300px] h-[300px] self-end "
      />

      <section className="flex flex-col items-center  bg-primary gap-4 py-3 pb-5 w-[27rem] min-h-[410px] rounded-3xl mb-10">
        <header className="flex w-full items-center justify-between pt-2 px-5 ">
          <span className="font-bold text-xl text-gray-700 antialiased">
            Exchange
          </span>
          <div className="flex gap-4 items-center">
            <img
              src={settings}
              alt="settings"
              className="object-contain w-[24px] h-[24px] cursor-pointer"
              onClick={() => setShowSettings(!showSettings)}
            />
            <img
              src={history}
              alt="history"
              className="object-contain w-[24px] h-[24px] cursor-pointer"
              onClick={() => setShowRecentTXN(!showRecentTXN)}
            />
          </div>
        </header>
        <main className="flex flex-col items-center w-full antialiased px-5 ">
          <Input
            token={fromToken}
            setToken={handleSetFromToken}
            placeholder="From"
            value={fromValue}
            setter={handleTokenInValue}
            meta={{
              value1: fromToken,
              value2: toToken,
              setter1: setFromToken,
              setter2: setToToken,
              origin: "firstToken",
            }}
          />
          <img
            src={swap_card_button}
            alt="swap"
            className="object-contain w-24 h-24 py-4 cursor-pointer"
            onClick={() => setSwap(!swap)}
          />
          <Input
            token={toToken}
            setToken={handleSetToToken}
            placeholder="To"
            value={toValue}
            setter={handleTokenOutValue}
            meta={{
              value1: fromToken,
              value2: toToken,
              setter1: setFromToken,
              setter2: setToToken,
              origin: "secondToken",
            }}
          />
          <div
            className="cursor-pointer py-3 px-3 mt-4 rounded-lg bg-[#f4f5f5] text-sm flex flex-col gap-2 w-full"
            onClick={() => setDetailsDropDown(!detailsDropDown)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-secondary font-semibold">{`${amountOut} ${toToken.symbol} per ${fromToken.symbol}`}</span>
              <img
                src={arrow_down}
                alt="arrow down"
                className={`w-3 h-3 fill-accent ${
                  detailsDropDown && " transform rotate-180"
                }`}
              />
            </div>
            {detailsDropDown && (
              <div className="flex flex-col gap-1">
                <div className=" flex w-full items-center justify-between">
                  <span className="text-gray-400">Price Impact</span>
                  <span className="text-secondary font-semibold">
                    {slippage}%
                  </span>
                </div>
                <div className=" flex w-full items-center justify-between">
                  <span className="text-gray-400">Minimum received</span>
                  <span className="text-secondary font-semibold">
                    {" "}
                    {amountOutMin} {toToken.symbol}{" "}
                  </span>
                </div>

                <div className=" flex w-full items-center justify-between">
                  <span className="text-gray-400">Liquidity Provider Fee</span>
                  <span className="text-secondary font-semibold">
                    {" "}
                    {`0.27%`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>
        {isConnected && address ? (
          <Button
            styles={"w-full font-bold"}
            callback={
              isAllowed
                ? () => swapTokens(fromToken, toToken, fromValue, toValue)
                : () => approve()
            }
            placeholder={`${
              isAllowed === false
                ? "Approve"
                : insufficientLiquidity === true
                ? "Insufficient liquidity"
                : "Swap"
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

      <img
        src={right_oreo}
        alt="logo_right"
        className="object-contain w-[300px] h-[300px] self-end"
      />

      <SettingsModal
        modal={showSettings}
        toggleModal={setShowSettings}
        meta={{
          slippage: slippage,
          setSlippage: setSlippage,
          deadline: deadline,
          setDeadline: setDeadline,
          slippageError,
        }}
      />

      <RecentTxnModal modal={showRecentTXN} toggleModal={setShowRecentTXN} />

      <TxnCompleteModal
        modal={showTXNComplete}
        toggleModal={setShowTXNComplete}
      />
    </section>
  );
};

export default SwapCard;

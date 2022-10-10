import React from "react";
import TokenButton from "../../common/TokenButton";
import { TOKENS } from "../../constants/Tokens";
import { ethers } from "ethers";
import erc20ABI from "../../utils/ABIS/erc20ABI.json";
import contractAddresses from "../../utils/contractAddresses.json";

const Input = ({
  token,
  setToken,
  value,
  setter,
  meta,
}: {
  token: any;
  setToken: any;
  value: any;
  setter: any;
  meta: any;
}) => {
  const handleMaxTokenBalance = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        if (meta.origin === "firstToken") {
          if (token.address === contractAddresses.weth) {
            provider.getBalance(signer.getAddress()).then((balance) => {
              setter(Number(balance) / Math.pow(10, 18));
            });
          } else {
            const tokenContract = new ethers.Contract(
              token.address,
              erc20ABI,
              signer
            );
            const balance = await tokenContract.balanceOf(signer.getAddress());
            setter(balance);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="flex flex-col border pl-5 py-1.5 gap-1 w-full rounded-2xl items-start ">
      <span className="text-sm">Input</span>
      <section className="flex items-center w-full">
        <input
          type="number"
          min={0}
          name={`liquidity-${token}`}
          id={`liquidity-${token}`}
          value={value}
          onChange={(e) => {
            setter(e.target.value);
          }}
          className={`text-xl w-1/2 font-bold text-secondary focus:outline-none outline-none border-none ${
            String(value).length > 8 ? "text-md" : "text-xl"
          }`}
        />
        <section className="w-1/2 self-end flex items-center justify-end gap-2 pr-1">
          {meta.origin === "firstToken" && (
            <button
              className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-xs font-bold "
              onClick={() => handleMaxTokenBalance()}
            >
              MAX
            </button>
          )}
          <TokenButton
            value={token}
            setter={setToken}
            valueMap={TOKENS}
            styles={"w-24 "}
            from="liquidityinput"
            meta={meta}
          />
        </section>
      </section>
    </section>
  );
};

export default Input;

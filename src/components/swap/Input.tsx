import TokenButton from "../../common/TokenButton";
import { TOKENS } from "../../constants/Tokens";
import { ethers } from "ethers";
import erc20ABI from "../../utils/ABIS/erc20ABI.json";
import contractAddresses from "../../utils/contractAddresses.json";

const Input = ({
  token,
  setToken,
  placeholder,
  value,
  setter,
  meta,
}: {
  token: any;
  setToken: any;
  placeholder: string;
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
            setter(balance / Math.pow(10, 18));
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="flex border pl-5 py-3 w-full rounded-2xl items-center justify-between">
      <section className="flex flex-col gap-1 w-1/2">
        <span className="text-secondary text-sm">{placeholder}</span>
        <input
          type="number"
          min={0}
          name={placeholder}
          id={placeholder}
          value={value}
          onChange={(e) => {
            setter(e.target.value);
          }}
          className={`w-full font-bold text-secondary focus:outline-none outline-none border-none ${
            String(value).length > 8 ? "text-xl" : "text-3xl"
          }`}
        />
      </section>
      <section className="self-end w-1/2 flex gap-1 items-center justify-end pr-1">
        {meta.origin === "firstToken" && (
          <button
            className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-xs font-bold"
            onClick={() => {
              handleMaxTokenBalance();
            }}
          >
            MAX
          </button>
        )}
        <TokenButton
          value={token}
          setter={setToken}
          valueMap={TOKENS}
          styles={"w-24"}
          from="swapinput"
          meta={meta}
        />
      </section>
    </section>
  );
};

export default Input;

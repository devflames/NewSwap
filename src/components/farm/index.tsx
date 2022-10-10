import { useEffect, useState } from "react";
import FarmsTable from "./FarmsTable";
import farm_hero from "../../assets/farm_hero.svg";
import {
  getTokenPriceInUSD,
  getTokenBalance,
  getMarketCap,
  getFullyDilutedMarketCap,
} from "../../hooks/generalHooks";
import contractAddresses from "../../utils/contractAddresses.json";
import { ethers } from "ethers";
import { getTVL } from "../../hooks/farmHooks";

const FarmComponent = () => {
  const [tokenPrice, setTokenPrice] = useState(0);
  const [burnedOreo, setBurnedOreo] = useState(0);
  const [oreoBalance, setOreoBalance] = useState(0);
  const [tvl, setTvl] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [fullyDilutedmarketCap, setFullyDilutedMarketCap] = useState(0);

  useEffect(() => {
    getTokenPriceInUSD(contractAddresses.oreoTokenAddress).then((res) =>
      setTokenPrice((prev) => (prev = res[0]))
    );
    getTokenBalance(
      contractAddresses.oreoTokenAddress,
      "0x0000000000000000000000000000000000000000"
    ).then((res) => setBurnedOreo((prev) => (prev = res)));
    getTokenBalance(contractAddresses.oreoTokenAddress, "").then((res) =>
      setOreoBalance(res)
    );
    getTVL().then((res) => setTvl(res));
    getMarketCap().then((res) => setMarketCap(res));
    getFullyDilutedMarketCap().then((res) => setFullyDilutedMarketCap(res));
  }, []);

  return (
    <section className="flex flex-col gap-4 mt-7 w-full">
      <section className="flex items-center gap-5 w-full px-8">
        <img src={farm_hero} alt="farm" className="w-1/3 rounded-2xl" />
        <section className="flex flex-col w-2/3 h-full gap-3 justify-between">
          <section className="flex w-full h-1/2 items-center justify-between gap-5 bg-primary py-7 px-10 rounded-2xl">
            <div className="flex flex-col gap-3">
              <span className="text-secondary text-opacity-50">TVL</span>
              <span className="text-secondary font-bold">
                ${ethers.utils.formatUnits(tvl, 6)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-secondary text-opacity-50">Oreo Price</span>
              <span className="text-secondary font-bold">
                ${ethers.utils.formatUnits(tokenPrice.toString(), 6)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-secondary text-opacity-50">Market Cap</span>
              <span className="text-secondary font-bold">
                ${ethers.utils.formatUnits(marketCap.toString(), 6)}
              </span>
            </div>
          </section>
          <section className="flex items-center justify-between gap-5 bg-primary py-7 px-10 rounded-2xl">
            <div className="flex flex-col gap-3">
              <span className="text-secondary text-opacity-50">
                Fully Diluted MarketCap
              </span>
              <span className="text-secondary font-bold">
                ${ethers.utils.formatUnits(fullyDilutedmarketCap.toString(), 6)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-secondary text-opacity-50">
                Burned Oreo
              </span>
              <span className="text-secondary font-bold">
                {ethers.utils.formatEther(burnedOreo.toString())} OREO
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-accent">Your Oreo</span>
              <span className="text-secondary font-bold">
                {ethers.utils.formatUnits(oreoBalance, 18).substring(0, 8)} OREO
              </span>
            </div>
          </section>
        </section>
      </section>
      <section className="flex flex-col gap-2 w-full px-8  ">
        <span className="text-secondary text-lg ml-2">Farms</span>
        <section className="bg-primary rounded-3xl py-3 px-5 mb-8">
          <FarmsTable />
        </section>
      </section>
    </section>
  );
};

export default FarmComponent;

import { useEffect, useState } from "react";
import sidebar_primary from "../../assets/sidebar_primary.svg";
import { getTokenPriceInUSD } from "../../hooks/generalHooks";
import contractAddresses from "../../utils/contractAddresses.json";
import { ethers } from "ethers";

const Price = () => {
  const [tokenPrice, setTokenPrice] = useState(0);

  useEffect(() => {
    getTokenPriceInUSD(contractAddresses.oreoTokenAddress).then((res) =>
      setTokenPrice((prev) => (prev = res[0]))
    );
  }, []);

  return (
    <section className="flex gap-4 rounded-xl w-full bg-primary bg-opacity-25 items-center justify-start px-4 py-2 text-primary">
      <img
        src={sidebar_primary}
        alt="logo"
        className="object-contain w-8 h-8"
      />
      <div className="flex flex-col items-start text-center">
        <span className="font-bold">
          ${ethers.utils.formatUnits(tokenPrice.toString(), 6)}
        </span>
      </div>
    </section>
  );
};

export default Price;

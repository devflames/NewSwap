import { useState, useEffect } from "react";
import { getLpFarmDetails } from "../../hooks/farmHooks";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import StakeUnStake from "../modals/StakeUnStake";
import contractAddresses from "../../utils/contractAddresses.json";
import boostedMasterchefABI from "../../utils/ABIS/boostedMasterchefABI.json";

const FarmsTable = () => {
  const [stakeModal, setStakeModal] = useState(false);

  // staking
  const [stakeValue, setStakeValue] = useState(0);
  const stakedItems = [""];

  // unstake
  const [unstakeValue, setUnstakeValue] = useState(0);

  const [manageFarm, setManageFarm] = useState({});

  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState([]);

  const { address } = useAccount();

  useEffect(() => {
    setLoading(true);
    getLpFarmDetails().then((res) => {
      setFarms((prev) => (prev = res));
      setLoading(false);
    });
  }, [address]);

  const handleManageFarm = (farm: any) => {
    setStakeModal(!stakeModal);
    setManageFarm(farm);
  };

  const harvestRewards = async (farm: any) => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const boostedMasterchef = new ethers.Contract(
          contractAddresses.boostedMasterChefAddress,
          boostedMasterchefABI,
          signer
        );
        await boostedMasterchef.withdraw(
          farm.poolId,
          ethers.utils.parseEther("0")
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <table className=" table-fixed ">
      <thead className="px-4 bg-secondary bg-opacity-20">
        <tr className="text-sm">
          <th scope="col" className="">
            Name
          </th>
          <th scope="col" className="">
            Stake NFT
          </th>
          <th scope="col" className="">
            Multiplier
          </th>
          <th scope="col" className="">
            APR
          </th>
          <th scope="col" className="">
            Liquidity
          </th>
          <th scope="col" className="">
            Staked
          </th>
          <th scope="col" className="">
            Deposit Fee
          </th>
          <th scope="col" className="">
            Rewards
          </th>
          <th scope="col" className=""></th>
        </tr>
      </thead>
      <tbody className="">
        {loading
          ? "Loading..."
          : farms.map((farm) => {
              return (
                <tr className="">
                  <td className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent"></div>
                    <span>
                      {farm.token0.symbol}/{farm.token1.symbol}
                    </span>
                  </td>
                  <td>
                    <button className="mx-auto flex items-center w-10 h-16 border justify-center rounded-lg text-xl focus:outline-none">
                      +
                    </button>
                  </td>
                  <td className="">{farm.multiplier / 100}x</td>
                  <td className="text-accent">{farm.apr.toFixed()}%</td>
                  <td className="">
                    $
                    {ethers.utils.formatUnits(
                      ethers.utils.parseUnits(farm.tvl),
                      6
                    )}
                  </td>
                  <td className="">
                    {(farm.stakedAmount / Math.pow(10, 18)).toFixed()}LP
                  </td>
                  <td className="">{farm.depositFee / 100}%</td>
                  <td className="">{farm.pendingReward} OREO</td>
                  <td className="flex gap-2 items-center"> </td>
                  <button
                    className="px-3 py-2 border-2 border-button_secondary text-button_secondary rounded-xl"
                    onClick={() => handleManageFarm(farm)}
                  >
                    Manage
                  </button>
                  <button
                    className="px-3 py-2 border-2 bg-button_secondary text-primary rounded-xl"
                    onClick={() => harvestRewards(farm)}
                  >
                    Harvest
                  </button>
                </tr>
              );
            })}
      </tbody>
      <StakeUnStake
        toggleModal={setStakeModal}
        modal={stakeModal}
        meta={{
          stakeValue: stakeValue,
          setStakeValue: setStakeValue,
          unstakeValue: unstakeValue,
          setUnstakeValue: setUnstakeValue,
          stakedItems: stakedItems,
          farm: manageFarm,
        }}
      />
    </table>
  );
};

export default FarmsTable;

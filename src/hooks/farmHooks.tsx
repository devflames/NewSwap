import contractAddresses from "../utils/contractAddresses.json";
import factoryABI from "../utils/ABIS/factoryABI.json";
import pairABI from "../utils/ABIS/pairABI.json";
import erc20ABI from "../utils/ABIS/erc20ABI.json";
import boostedMasterchefABI from "../utils/ABIS/boostedMasterchefABI.json";
import { ethers, BigNumber } from "ethers";
import { getTokenValueInUSD, getTokenPriceInUSD } from "./generalHooks";

export const getFarmTVLAndApr = async (farmIndex: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const boostedMasterchef = new ethers.Contract(
      contractAddresses.boostedMasterChefAddress,
      boostedMasterchefABI,
      signer
    );

    // let startingTime;

    try {
      const totalAllocPoints = ethers.BigNumber.from(
        await boostedMasterchef.totalAllocPoint()
      );
      const oreoPerBlock = ethers.BigNumber.from(
        await boostedMasterchef.tokenPerBlock()
      );
      const rewardTokenPrice = await getTokenPriceInUSD(
        contractAddresses.oreoTokenAddress
      );

      try {
        // startingTime = new Date().getTime();
        const poolInfo = await boostedMasterchef.poolInfo(farmIndex);
        const farmAllocPoints = ethers.BigNumber.from(poolInfo.allocPoint);
        const lpTokenAddress = await poolInfo.lpToken;
        const blockPerYear = 60 * 60 * 24 * 365;
        const farmRewardsPerYear = oreoPerBlock
          .mul(blockPerYear)
          .mul(farmAllocPoints)
          .div(totalAllocPoints);

        const lpContract = new ethers.Contract(lpTokenAddress, pairABI, signer);
        const token0Address = await lpContract.token0();
        const token1Address = await lpContract.token1();
        const tokenReserves = await lpContract.getReserves();

        const token0Price = await getTokenPriceInUSD(token0Address);

        const token1Price = await getTokenPriceInUSD(token1Address);

        //LP Calculation
        const lpTVL =
          Number(ethers.utils.formatEther(tokenReserves["_reserve0"])) *
            Number(ethers.utils.formatEther(token0Price[0])) +
          Number(ethers.utils.formatEther(tokenReserves["_reserve1"])) *
            Number(ethers.utils.formatEther(token1Price[0]));

        //Base APR calculation
        const reserves = await lpContract.getReserves();
        const reserve1 = ethers.utils.formatEther(
          reserves["_reserve0"]["_hex"]
        );
        const reserve2 = ethers.utils.formatEther(
          reserves["_reserve1"]["_hex"]
        );
        const totalSupply = await lpContract.totalSupply();
        const totalLPValue =
          Number(reserve1) * Number(token0Price[0]) +
          Number(reserve2) * Number(token1Price[0]);
        const lpValue =
          totalLPValue / Number(ethers.utils.formatEther(totalSupply));
        const totalStaked = ethers.utils.formatEther(
          await lpContract.balanceOf(contractAddresses.boostedMasterChefAddress)
        );
        const total_value_of_reward_token =
          Number(farmRewardsPerYear) * Number(rewardTokenPrice[0]);
        const total_value_of_staked_token = Number(totalStaked) * lpValue;
        const baseAPR =
          ((total_value_of_reward_token / total_value_of_staked_token) * 100) /
          1e18;

        return { apr: baseAPR, tvl: lpTVL };
      } catch (error) {
        console.log(error);
        return {};
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  }
};

export const getLpFarmDetails = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const boostedMasterchef = new ethers.Contract(
        contractAddresses.boostedMasterChefAddress,
        boostedMasterchefABI,
        signer
      );
      let farms = [];
      //   let startingTime;

      try {
        const totalAllocPoints = ethers.BigNumber.from(
          await boostedMasterchef.totalAllocPoint()
        );
        const oreoPerBlock = ethers.BigNumber.from(
          await boostedMasterchef.tokenPerBlock()
        );
        const oreoLPLength = ethers.BigNumber.from(
          await boostedMasterchef.poolLength()
        ).toNumber();
        const rewardTokenPrice = await getTokenPriceInUSD(
          contractAddresses.oreoTokenAddress
        );

        for (let index = 0; index < oreoLPLength; index++) {
          try {
            // startingTime = new Date().getTime();
            const poolInfo = await boostedMasterchef.poolInfo(index);
            const userInfo = await boostedMasterchef.userInfo(
              index,
              signer.getAddress()
            );
            const stakedAmountInUSD = await getFarmValueInUSDForUser(index);
            const farmAllocPoints = ethers.BigNumber.from(poolInfo.allocPoint);
            const pendingReward = await boostedMasterchef.pendingToken(
              index,
              signer.getAddress()
            );
            const lpTokenAddress = await poolInfo.lpToken;
            const blockPerYear = 60 * 60 * 24 * 365;
            const farmRewardsPerYear = oreoPerBlock
              .mul(blockPerYear)
              .mul(farmAllocPoints)
              .div(totalAllocPoints);

            const lpContract = new ethers.Contract(
              lpTokenAddress,
              pairABI,
              signer
            );
            const token0Address = await lpContract.token0();
            const token1Address = await lpContract.token1();
            const tokenReserves = await lpContract.getReserves();

            const token0Contract = new ethers.Contract(
              token0Address,
              erc20ABI,
              signer
            );
            const token0Name = await token0Contract.name();
            const token0Symbol = await token0Contract.symbol();
            const token0Decimals = await token0Contract.decimals();
            const token0Price = await getTokenPriceInUSD(token0Address);

            const token1Contract = new ethers.Contract(
              token1Address,
              erc20ABI,
              signer
            );
            const token1Name = await token1Contract.name();
            const token1Symbol = await token1Contract.symbol();
            const token1Decimals = await token1Contract.decimals();
            const token1Price = await getTokenPriceInUSD(token1Address);

            //LP Calculation
            const lpTVL =
              Number(ethers.utils.formatEther(tokenReserves["_reserve0"])) *
                Number(ethers.utils.formatEther(token0Price[0])) +
              Number(ethers.utils.formatEther(tokenReserves["_reserve1"])) *
                Number(ethers.utils.formatEther(token1Price[0]));
            // const tvlInUSD = await getTokenValueInUSD(contractAddresses.oreoTokenAddress, lpTVL);

            // Base APR calculation
            const reserves = await lpContract.getReserves();
            const reserve1 = ethers.utils.formatEther(
              reserves["_reserve0"]["_hex"]
            );
            const reserve2 = ethers.utils.formatEther(
              reserves["_reserve1"]["_hex"]
            );
            const totalSupply = await lpContract.totalSupply();
            const totalLPValue =
              Number(reserve1) * Number(token0Price[0]) +
              Number(reserve2) * Number(token1Price[0]);

            const lpValue =
              totalLPValue / Number(ethers.utils.formatEther(totalSupply));
            const totalStaked = ethers.utils.formatEther(
              await lpContract.balanceOf(
                contractAddresses.boostedMasterChefAddress
              )
            );

            const total_value_of_reward_token =
              Number(farmRewardsPerYear) * Number(rewardTokenPrice[0]);
            const total_value_of_staked_token = Number(totalStaked) * lpValue;
            const baseAPR =
              ((total_value_of_reward_token / total_value_of_staked_token) *
                100) /
              1e18;

            const farmData: any = {
              masterchefAddress: contractAddresses.boostedMasterChefAddress,
              type: "LP",
              poolId: index,
              lpTokenAddress: lpTokenAddress,
              multiplier: farmAllocPoints,
              stakedAmount: userInfo.amount,
              stakedAmountInUSD: stakedAmountInUSD,
              depositFee: Number(poolInfo.depositFee),
              pendingReward: (pendingReward / Math.pow(10, 18)).toFixed(),
              token0: {
                address: token0Address,
                decimals: token0Decimals,
                name: token0Name,
                symbol: token0Symbol,
              },
              token1: {
                address: token1Address,
                decimals: token1Decimals,
                name: token1Name,
                symbol: token1Symbol,
              },
              apr: baseAPR,
              tvl: lpTVL.toFixed(12),
            };

            farms.push(farmData);
          } catch (error) {
            console.log(error);
          }
        }
        return farms;
      } catch (error) {
        console.log(error);
        return [];
      }
    } catch (e) {
      return [];
    }
  }
};

export const getFarmValueInUSDForUser = async (farmId: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const boostedMasterchef = new ethers.Contract(
      contractAddresses.boostedMasterChefAddress,
      boostedMasterchefABI,
      signer
    );
    const farmInfo = await boostedMasterchef.poolInfo(farmId);
    const lpToken = new ethers.Contract(farmInfo.lpToken, erc20ABI, signer);
    const pairValueInUSD = await getTotalPairValueInUSD(farmInfo.lpToken);
    const lpTokenBalance = await lpToken.balanceOf(signer.getAddress());
    const percentage = parseInt(
      ethers.utils.formatUnits(lpTokenBalance, 18).substring(0, 2)
    );
    return ethers.utils.formatEther(
      ((percentage / 100) * pairValueInUSD).toFixed().toString()
    );
  } else {
    return [];
  }
};

export const getTotalLiquidityInFarmInUSD = async (farmId: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const boostedMasterchef = new ethers.Contract(
      contractAddresses.boostedMasterChefAddress,
      boostedMasterchefABI,
      signer
    );
    const farmInfo = await boostedMasterchef.poolInfo(farmId);
    const lpToken = new ethers.Contract(farmInfo.lpToken, erc20ABI, signer);
    const pairValueInUSD = await getTotalPairValueInUSD(farmInfo.lpToken);
    const lpTokenBalance = await lpToken.balanceOf(
      contractAddresses.boostedMasterChefAddress
    );
    const percentage = parseInt(
      ethers.utils.formatUnits(lpTokenBalance, 18).substring(0, 2)
    );
    return ethers.utils.formatEther(
      ((percentage / 100) * pairValueInUSD).toFixed().toString()
    );
  } else {
    return 0;
  }
};

export const getTotalPairValueInUSD = async (pairAddr: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const pair = new ethers.Contract(pairAddr, pairABI, signer);
    const reserves = await pair.getReserves();
    const reserve0 = reserves[0];
    const reserve1 = reserves[1];
    const token0 = await pair.token0();
    const token1 = await pair.token1();
    const totalUsdValueToken0 = await getTokenValueInUSD(token0, reserve0);
    const totalUsdValueToken1 = await getTokenValueInUSD(token1, reserve1);
    const totalUsdInPair = BigNumber.from(totalUsdValueToken0[0])
      .add(totalUsdValueToken1[0])
      .toNumber();
    return totalUsdInPair;
  } else {
    return 0;
  }
};

export const getTVL = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const oreoFactory = new ethers.Contract(
      contractAddresses.factoryAddress,
      factoryABI,
      signer
    );
    const pairsLength = await oreoFactory.allPairsLength();
    for (let index = 0; index < pairsLength; index++) {
      const pairAddress = await oreoFactory.allPairs(index);
      let poolTvl = await getTotalPairValueInUSD(pairAddress);
      return poolTvl;
    }
  } else {
    return 0;
  }
};

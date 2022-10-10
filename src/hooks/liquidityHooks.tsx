import contractAddresses from "../utils/contractAddresses.json";
import factoryABI from "../utils/ABIS/factoryABI.json";
import routerABI from "../utils/ABIS/routerABI.json";
import pairABI from "../utils/ABIS/pairABI.json";
import erc20ABI from "../utils/ABIS/erc20ABI.json";
// import boostedMasterchefABI from "../utils/ABIS/boostedMasterchefABI.json";
import { ethers } from "ethers";
import { TOKENS } from "../constants/Tokens";

export const createPair = async (
  tokenA: string,
  tokenB: string,
  signer: any
) => {
  const factoryAddr = contractAddresses.factoryAddress;
  const factory = new ethers.Contract(factoryAddr, factoryABI, signer);
  await factory.createPair(tokenA, tokenB);
};

export const addLiquidityETH = async (
  token: any,
  amountToken: any,
  amountETH: any,
  slippage: any,
  signer: any,
  deadline: any
) => {
  const oreoRouter = new ethers.Contract(
    contractAddresses.routerAddress,
    routerABI,
    signer
  );
  await oreoRouter.addLiquidityETH(
    token.address,
    ethers.utils.parseEther(amountToken.toString()),
    0,
    0,
    signer.getAddress(),
    ethers.utils.parseUnits((deadline * 60).toString(), 18),
    { value: ethers.utils.parseEther(amountETH.toString()) }
  );
};

export const addLiquidity = async (
  tokenA: any,
  amountTokenA: any,
  tokenB: any,
  amountTokenB: any,
  slippage: any,
  signer: any,
  deadline: any
) => {
  const oreoRouter = new ethers.Contract(
    contractAddresses.routerAddress,
    routerABI,
    signer
  );
  await oreoRouter.addLiquidity(
    tokenA.address,
    tokenB.address,
    ethers.utils.parseEther(amountTokenA.toString()),
    ethers.utils.parseEther(amountTokenB.toString()),
    0,
    0,
    signer.getAddress(),
    ethers.utils.parseUnits((deadline * 60).toString(), 18)
  );
};

export const getLiquidityPools = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const oreoFactory = new ethers.Contract(
        contractAddresses.factoryAddress,
        factoryABI,
        signer
      );

      const pairsLength = await oreoFactory.allPairsLength();
      const pairs = [];
      for (let index = 0; index < pairsLength; index++) {
        const pairAddress = await oreoFactory.allPairs(index);
        const pairContract = new ethers.Contract(pairAddress, pairABI, signer);
        const tokenAAddr = await pairContract.token0();
        const tokenBAddr = await pairContract.token1();
        // eslint-disable-next-line eqeqeq
        const tokenA = TOKENS.find((token) => token.address == tokenAAddr);
        // eslint-disable-next-line eqeqeq
        const tokenB = TOKENS.find((token) => token.address == tokenBAddr);
        const totalSupply = await pairContract.totalSupply();
        const reserves = await pairContract.getReserves();
        const lpBalance = await pairContract.balanceOf(signer.getAddress());
        pairs.push({
          tokenA: tokenA,
          tokenB: tokenB,
          totalSupply: totalSupply / Math.pow(10, 18),
          reserveA: reserves[0] / Math.pow(10, 18),
          reserveB: reserves[1] / Math.pow(10, 18),
          signerBalance: lpBalance / Math.pow(10, 18),
          poolShare:
            (100 * (lpBalance / Math.pow(10, 18))) /
            (totalSupply / Math.pow(10, 18)),
          lpAddress: pairContract.address,
        });
      }

      return pairs;
    } catch (error) {
      return [];
    }
  }
};

export const getLiquidityPoolShare = async (tokenB: any, tokenA: any) => {
  try {
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
        const pairContract = new ethers.Contract(pairAddress, pairABI, signer);
        const tokenAAddr = await pairContract.token0();
        const tokenBAddr = await pairContract.token1();
        if (tokenAAddr === tokenA.address && tokenBAddr === tokenB.address) {
          const totalSupply = await pairContract.totalSupply();
          const lpBalance = await pairContract.balanceOf(signer.getAddress());

          return (
            (100 * (lpBalance / Math.pow(10, 18))) /
            (totalSupply / Math.pow(10, 18))
          );
        }
      }
    }
  } catch (error) {
    return 0;
  }
};

export const removeLiquidity = async (
  percentage: any,
  tokenA: any,
  tokenB: any
) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      console.log("IN REMOVE LIQUIDITY FUNCTION");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const oreoRouter = new ethers.Contract(
        contractAddresses.routerAddress,
        routerABI,
        signer
      );
      const oreoFactory = new ethers.Contract(
        contractAddresses.factoryAddress,
        factoryABI,
        signer
      );
      const lpAddress = await oreoFactory.getPair(
        tokenA.address,
        tokenB.address
      );
      const lpToken = new ethers.Contract(lpAddress, erc20ABI, signer);
      const lpBalance = await lpToken.balanceOf(signer.getAddress());
      const amountToRemove = (Number(lpBalance) / 100) * percentage;
      const allowance = await lpToken.allowance(
        signer.getAddress(),
        oreoRouter.address
      );
      if (allowance / Math.pow(10, 18) < amountToRemove) {
        await lpToken.approve(
          oreoRouter.address,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      }
      const amountFormatted = ethers.utils.formatUnits(
        amountToRemove.toString()
      );
      if (tokenA.address === contractAddresses.weth) {
        await oreoRouter.removeLiquidityETHSupportingFeeOnTransferTokens(
          tokenB.address,
          ethers.utils.parseUnits(amountFormatted),
          0,
          0,
          signer.getAddress(),
          999999999999
        );
      } else if (tokenB.address === contractAddresses.weth) {
        console.log("WETH");
        await oreoRouter.removeLiquidityETH(
          tokenA.address,
          ethers.utils.parseUnits(amountFormatted),
          0,
          0,
          signer.getAddress(),
          999999999999
        );
      } else {
        await oreoRouter.removeLiquidity(
          tokenA.address,
          tokenB.address,
          ethers.utils.parseUnits(amountFormatted),
          0,
          0,
          signer.getAddress(),
          999999999999
        );
      }
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
};

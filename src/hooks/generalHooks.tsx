import contractAddresses from "../utils/contractAddresses.json";
import routerABI from "../utils/ABIS/routerABI.json";
import { ethers, BigNumber } from "ethers";
import pairABI from "../utils/ABIS/pairABI.json";
import factoryABI from "../utils/ABIS/factoryABI.json";
import erc20ABI from "../utils/ABIS/erc20ABI.json";

const wethAddr = contractAddresses.weth;

export const truncateAddress = (address: string) => {
  const truncatedAddress = `${address.substring(0, 2)}...${address.substring(
    address.length - 1,
    address.length - 4
  )}`;
  return truncatedAddress;
};

export const truncateHash = (address: string) => {
  const truncatedHash = `${address.substring(0, 10)}...${address.substring(
    address.length - 1,
    address.length - 4
  )}`;
  return truncatedHash;
};

export const getAmountOut = async (
  amount: any,
  tokenIn: any,
  tokenOut: any
) => {
  const path = await getPath(tokenIn, tokenOut);
  try {
    if (typeof window.ethereum !== "undefined" && amount > 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const router = new ethers.Contract(
        contractAddresses.routerAddress,
        routerABI,
        signer
      );
      const amounts = await router.getAmountsOut(
        ethers.utils.parseEther(amount.toString()),
        path
      );
      return amounts[amounts.length - 1];
    }
  } catch (error) {
    return 0;
  }
};

export const getTokenBalance = async (tokenAddr: any, accountAddr: any) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const token = new ethers.Contract(tokenAddr, erc20ABI, signer);
      let balance;
      if (accountAddr === "") {
        balance = await token.balanceOf(signer.getAddress());
      } else {
        balance = await token.balanceOf(accountAddr);
      }
      return balance;
    }
  } catch (error) {
    return 0;
  }
};

export const getTokenBalanceInUSD = async (tokenAddr: any) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const token = new ethers.Contract(tokenAddr, erc20ABI, signer);
      const balance = await token.balanceOf(signer.getAddress());
      const price = await getTokenPriceInUSD(tokenAddr);
      return BigNumber.from(price[0]).mul(BigNumber.from(balance)).toNumber();
    }
  } catch (error) {
    return 0;
  }
};

const getAmountOutInternal = async (amount: any, path: any) => {
  try {
    if (typeof window.ethereum !== "undefined" && amount > 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const router = new ethers.Contract(
        contractAddresses.routerAddress,
        routerABI,
        signer
      );
      const amounts = await router.getAmountsOut(
        ethers.utils.parseEther(amount.toString()),
        path
      );
      return amounts[amounts.length - 1];
    }
  } catch (error) {
    return 0;
  }
};

export const getAmountAfterSlippage = async (amountOut: any, slippage: any) => {
  const slippageAmount = (amountOut / 100) * slippage;
  const amountOutMin = amountOut - slippageAmount;
  return amountOutMin;
};

export const getTokenPriceInUSD = async (tokenAddr: string) => {
  const routerAddr = contractAddresses.routerAddress;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const sushiRouterAddr = "0x633e494C22D163F798b25b0264b92Ac612645731"; // temporary

  const oreoRouter = new ethers.Contract(routerAddr, routerABI, signer);
  const sushiRouter = new ethers.Contract(sushiRouterAddr, routerABI, signer); // temporary
  const usdcAddr = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  try {
    if (tokenAddr !== wethAddr) {
      const priceInETHW = await oreoRouter.getAmountsOut(
        ethers.utils.parseEther("1"),
        [tokenAddr, wethAddr]
      );
      const priceInUSD = await sushiRouter.getAmountsOut(priceInETHW[1], [
        wethAddr,
        usdcAddr,
      ]);
      return [priceInUSD[1], priceInUSD[1] / Math.pow(10, 18)];
    } else {
      const priceInUSD = await sushiRouter.getAmountsOut(
        ethers.utils.parseEther("1"),
        [wethAddr, usdcAddr]
      );
      return [priceInUSD[1], priceInUSD[1] / Math.pow(10, 18)];
    }
  } catch (error) {
    return [0, 0];
  }
};

export const getTokenValueInUSD = async (
  tokenAddr: string,
  tokenValue: any
) => {
  const routerAddr = contractAddresses.routerAddress;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const sushiRouterAddr = "0x633e494C22D163F798b25b0264b92Ac612645731"; // temporary

  const oreoRouter = new ethers.Contract(routerAddr, routerABI, signer);
  const sushiRouter = new ethers.Contract(sushiRouterAddr, routerABI, signer); // temporary
  const usdcAddr = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  try {
    if (tokenAddr !== wethAddr) {
      const priceInETHW = await oreoRouter.getAmountsOut(tokenValue, [
        tokenAddr,
        wethAddr,
      ]);
      const priceInUSD = await sushiRouter.getAmountsOut(priceInETHW[1], [
        wethAddr,
        usdcAddr,
      ]);
      return [priceInUSD[1], priceInUSD[1] / Math.pow(10, 18)];
    } else {
      const priceInUSD = await sushiRouter.getAmountsOut(tokenValue, [
        wethAddr,
        usdcAddr,
      ]);
      return [priceInUSD[1], priceInUSD[1] / Math.pow(10, 18)];
    }
  } catch (error) {
    return [0, 0];
  }
};

export const swapExactETHForTokens = async (
  toToken: any,
  fromValue: any,
  signer: any,
  router: any,
  slippage: any,
  deadline: any
) => {
  const path = await getPath({ address: wethAddr }, toToken);
  const amountOut = await getAmountOutInternal(fromValue, path);
  if (amountOut !== undefined) {
    const amountOutMin = await getAmountAfterSlippage(amountOut, slippage);
    try {
      const tx = await router
        .connect(signer)
        .swapExactETHForTokens(
          BigInt(parseInt(amountOutMin.toString())),
          path,
          signer.getAddress(),
          ethers.utils.parseUnits((deadline * 60).toString(), 18),
          { value: ethers.utils.parseEther(fromValue.toString()) }
        );
      tx.wait();
    } catch (error) {
      console.log("Transaction error", error);
    }
  }
};

export const swapExactTokensForTokens = async (
  fromToken: any,
  toToken: any,
  fromValue: any,
  signer: any,
  router: any,
  slippage: any,
  deadline: any
) => {
  const path = await getPath(fromToken, toToken);
  const amountOut = await getAmountOutInternal(fromValue, path);
  if (amountOut !== undefined) {
    const amountOutMin = await getAmountAfterSlippage(amountOut, slippage);
    try {
      const tx = await router
        .connect(signer)
        .swapExactTokensForTokensSupportingFeeOnTransferTokens(
          ethers.utils.parseEther(fromValue.toString()),
          BigInt(parseInt(amountOutMin.toString())),
          path,
          signer.getAddress(),
          ethers.utils.parseUnits((deadline * 60).toString(), 18)
        );
      tx.wait();
    } catch (error) {
      // console.log("Transaction error", error);
      alert("Increase slippage !");
    }
  }
};

export const swapExactTokensForETH = async (
  fromToken: any,
  fromValue: any,
  signer: any,
  router: any,
  slippage: any,
  deadline: any
) => {
  const path = await getPath(fromToken, { address: wethAddr });
  const amountOut = await getAmountOutInternal(fromValue, path);
  if (amountOut !== undefined) {
    const amountOutMin = await getAmountAfterSlippage(amountOut, slippage);
    try {
      await router
        .connect(signer)
        .swapExactTokensForETHSupportingFeeOnTransferTokens(
          ethers.utils.parseEther(fromValue.toString()), // amountIn
          BigInt(parseInt(amountOutMin.toString())), // amountOutMin
          path, // path
          await signer.getAddress(), // to
          ethers.utils.parseUnits((deadline * 60).toString(), 18) // deadline
        );
    } catch (error) {
      // console.log("Transaction error", error);
      alert("Increase slippage !");
    }
  }
};

export const getTransactionHistory = async () => {
  // does not work for ETHW
  try {
    let etherscanProvider = new ethers.providers.EtherscanProvider(
      "goerli",
      "WJNCG3PB7XZ6CAAEXZRG39BPXQZG3HMXQ8"
    );
    let txs = [];
    etherscanProvider
      .getHistory("0x82fcAD9CE4C8137916Ac574714efDB05deBa6aCe")
      .then((history) => {
        history.slice(-5).forEach((tx) => {
          txs.push(tx);
        });
      });
    return txs;
  } catch (error) {
    return []; // temporary
  }
};

export const getPath = async (tokenA: any, tokenB: any) => {
  let path = [];
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const oreoFactory = new ethers.Contract(
      contractAddresses.factoryAddress,
      factoryABI,
      signer
    );
    const pairAddr = await oreoFactory.getPair(tokenA.address, tokenB.address);
    if (pairAddr === "0x0000000000000000000000000000000000000000") {
      const pairsLength = await oreoFactory.allPairsLength();
      for (let index = 0; index < pairsLength; index++) {
        const pairAddress = await oreoFactory.allPairs(index);
        const pairContract = new ethers.Contract(pairAddress, pairABI, signer);
        const tokenAAddr = await pairContract.token0();
        const tokenBAddr = await pairContract.token1();
        if (tokenAAddr === tokenA.address) {
          const pair2 = await oreoFactory.getPair(tokenB.address, tokenBAddr);
          if (pair2 !== "0x0000000000000000000000000000000000000000") {
            path.push(tokenA.address, tokenBAddr, tokenB.address);
          }
        } else if (tokenBAddr === tokenA.address) {
          const pair2 = await oreoFactory.getPair(tokenAAddr, tokenB.address);
          if (pair2 !== "0x0000000000000000000000000000000000000000") {
            path.push(tokenA.address, tokenAAddr, tokenB.address);
          }
        }
      }
      return path;
    } else {
      return [tokenA.address, tokenB.address];
    }
  }
};

export const isPair = async (tokenA: any, tokenB: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const oreoFactory = new ethers.Contract(
      contractAddresses.factoryAddress,
      factoryABI,
      signer
    );
    const pairAddr = await oreoFactory.getPair(tokenA.address, tokenB.address);
    if (pairAddr === "0x0000000000000000000000000000000000000000") {
      return false;
    }
    return true;
  }
};

export const getMarketCap = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const oreoToken = new ethers.Contract(
        contractAddresses.oreoTokenAddress,
        erc20ABI,
        signer
      );
      const totalSupply = await oreoToken.totalSupply();
      const totalValueInUSD = await getTokenValueInUSD(
        oreoToken.address,
        totalSupply
      );
      return totalValueInUSD[0];
    } catch (error) {
      const customProvider = new ethers.providers.JsonRpcProvider(
        "https://goerli.infura.io/v3/"
      );
      const signer = new ethers.VoidSigner(
        "0x0000000000000000000000000000000000000000",
        customProvider
      );
      const oreoToken = new ethers.Contract(
        contractAddresses.oreoTokenAddress,
        erc20ABI,
        signer
      );
      const totalSupply = await oreoToken.totalSupply();
      const totalValueInUSD = await getTokenValueInUSD(
        oreoToken.address,
        totalSupply
      );
      return totalValueInUSD[0];
    }
  }
};

export const getFullyDilutedMarketCap = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const oreoToken = new ethers.Contract(
      contractAddresses.oreoTokenAddress,
      erc20ABI,
      signer
    );
    const maxSupply = await oreoToken.MAX_SUPPLY();
    const totalValueInUSD = await getTokenValueInUSD(
      oreoToken.address,
      maxSupply
    );
    return totalValueInUSD[0];
  }
};

export const approveToken = async (tokenAddr: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = new ethers.Contract(tokenAddr, erc20ABI, signer);
    const allowance = await token.allowance(
      signer.getAddress(),
      contractAddresses.routerAddress
    );
    if (allowance / Math.pow(10, 18) <= 0) {
      await token.approve(
        contractAddresses.routerAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
    }
  }
};

export const approveTokens = async (tokenAddrArr: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    for (let index = 0; index < tokenAddrArr.length; index++) {
      const token = new ethers.Contract(tokenAddrArr[index], erc20ABI, signer);
      const allowance = await token.allowance(
        signer.getAddress(),
        contractAddresses.routerAddress
      );
      if (allowance / Math.pow(10, 18) <= 0) {
        await token.approve(
          contractAddresses.routerAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      }
    }
  }
};

export const checkTokenAllowance = async (tokenAddr: any) => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = new ethers.Contract(tokenAddr, erc20ABI, signer);
    const allowance = await token.allowance(
      signer.getAddress(),
      contractAddresses.routerAddress
    );
    if (allowance / Math.pow(10, 18) <= 0) {
      return false;
    } else {
      return true;
    }
  }
};

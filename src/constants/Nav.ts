import swaps from "../assets/swap.svg";
import liquidity from "../assets/liquidity.svg";
import bridge from "../assets/bridges.svg";
import farms from "../assets/farms.svg";
import pools from "../assets/pools.svg";
import docs from "../assets/docs.svg";

export const NAV_ITEMS = [
  {
    placeholder: "Swap",
    image: swaps,
    active: true,
    link: "/swap",
    ishyperlink: false,
  },
  {
    placeholder: "Liquidity",
    image: liquidity,
    active: true,
    link: "/liquidity",
    ishyperlink: false,
  },
  {
    placeholder: "Bridge",
    image: bridge,
    active: false,
    link: "",
    ishyperlink: false,
  },
  {
    placeholder: "Farms",
    image: farms,
    active: false,
    link: "/farm",
    ishyperlink: false,
  },
  {
    placeholder: "Pools",
    image: pools,
    active: false,
    link: "",
    ishyperlink: false,
  },
  {
    placeholder: "Docs",
    image: docs,
    active: true,
    link: "https://docs.oreoswap.finance",
    ishyperlink: true,
  },
];

import { useState, useEffect } from "react";
import right_oreo from "../../assets/right_oreo.png";
import left_oreo from "../../assets/left_oreo.png";
import AddLiquidity from "./AddLiquidity";
import { getLiquidityPools } from "../../hooks/liquidityHooks";
import { useAccount } from "wagmi";
import LiquidityItem from "./LiquidityItem";
import CreatePair from "./CreatePair";
import RemoveLiquidity from "./RemoveLiquidity";

const LiquidityCard = () => {
  const [addLiquidityToggle, setAddLiquidityToggle] = useState(false);
  const [removeLiquidityToggle, setRemoveLiquidityToggle] = useState(false);
  const [createPairToggle, setCreatePairToggle] = useState(false);
  const [liquidityPools, setLiquidityPools] = useState(undefined || []);
  const [loading, setLoading] = useState(false);
  const [selectedPool, setSelectedPool] = useState({});
  const { address } = useAccount();

  useEffect(() => {
    setLoading(true);
    getLiquidityPools().then((res) => {
      setLiquidityPools((prev) => (prev = res));
      setLoading(false);
    });
  }, [address, addLiquidityToggle]);

  const handleRemoveLiquidity = (toggle: boolean, pool: {}) => {
    setRemoveLiquidityToggle(toggle);
    setSelectedPool(pool);
    console.log(pool);
  };

  return (
    <section className="flex items-center gap-10 font-primary">
      <img
        src={left_oreo}
        alt="logo_left"
        className="object-contain w-[300px] h-[300px] self-end "
      />
      {addLiquidityToggle ? (
        <AddLiquidity
          toggle={addLiquidityToggle}
          callback={setAddLiquidityToggle}
        />
      ) : createPairToggle ? (
        <CreatePair toggle={createPairToggle} callback={setCreatePairToggle} />
      ) : removeLiquidityToggle ? (
        <RemoveLiquidity
          toggle={removeLiquidityToggle}
          callback={setRemoveLiquidityToggle}
          selectedPool={selectedPool}
        />
      ) : (
        <section className="flex flex-col items-center  bg-primary gap-4 py-3 pb-5 w-[27rem]  rounded-3xl mb-10 ">
          <header className="flex w-full items-center justify-between pt-2  px-5">
            <span className="font-bold text-xl text-gray-700 antialiased">
              Your Liquidity
            </span>
            <div></div>
          </header>
          <main className="flex flex-col items-center w-full antialiased gap-5">
            <section className="flex w-full items-center justify-end px-5">
              {/* <h2 className="text-secondary font-bold"></h2> */}
              <div className="flex items-center gap-2">
                <button
                  className="button_nogradient hover:bg-[#5aa1ed] text-primary font-bold rounded-2xl py-2 px-3"
                  onClick={() => setCreatePairToggle(!createPairToggle)}
                >
                  Create Pair
                </button>
                <button
                  className="button_nogradient hover:bg-[#5aa1ed] text-primary font-bold rounded-2xl py-2 px-3"
                  onClick={() => setAddLiquidityToggle(!addLiquidityToggle)}
                >
                  Add Liquidity
                </button>
              </div>
            </section>
            <section className="w-full flex flex-col gap-3 pl-5 pr-4">
              {loading === true
                ? "Loading pools..."
                : liquidityPools.map((pool) => (
                    <LiquidityItem
                      addLiquidityToggle={addLiquidityToggle}
                      setAddLiquidityToggle={setAddLiquidityToggle}
                      removeLiquidtyToggle={removeLiquidityToggle}
                      setRemoveLiquidityToggle={() =>
                        handleRemoveLiquidity(!removeLiquidityToggle, pool)
                      }
                      pool={pool}
                    />
                  ))}
            </section>
          </main>
        </section>
      )}
      <img
        src={right_oreo}
        alt="logo_right"
        className="object-contain w-[300px] h-[300px] self-end"
      />
    </section>
  );
};

export default LiquidityCard;

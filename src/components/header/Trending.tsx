import React from "react";
import trending from "../../assets/trending.svg";

const Trending = () => {
  return (
    <section className="flex bg-primary w-full py-3 px-2 rounded-2xl">
      <div className="flex items-center gap-2 border-r-inherit border-r-[0.5px] px-5">
        <img src={trending} alt="trending" className="w-5 h-5" />
        <span className="text-secondary text-opacity-60 font-bold px-2 antialiased">
          Trending
        </span>
      </div>
      <section className="overflow-hidden flex-1 relative">
        <ul className="flex items-center flex-1 carousel">
          <li className="flex items-center gap-1 px-5">
            <span className="text-secondary text-opacity-40 font-bold">#1</span>
            <span className="text-secondary font-bold antialiased">ETHW</span>
          </li>
          <li className="flex items-center gap-1 px-5">
            <span className="text-secondary text-opacity-40 font-bold">#2</span>
            <span className="text-secondary font-bold antialiased">OREO</span>
          </li>
          <li className="flex items-center gap-1 px-5">
            <span className="text-secondary text-opacity-40 font-bold">#3</span>
            <span className="text-secondary font-bold">CAKEW</span>
          </li>
          <li className="flex items-center gap-1 px-5">
            <span className="text-secondary text-opacity-40 font-bold">#4</span>
            <span className="text-secondary font-bold">USDC</span>
          </li>
          <li className="flex items-center gap-1 px-5">
            <span className="text-secondary text-opacity-40 font-bold">#5</span>
            <span className="text-secondary font-bold">BUNYW</span>
          </li>
        </ul>
      </section>
    </section>
  );
};

export default Trending;

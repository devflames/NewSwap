import React from "react";
import hero from "../../assets/hero.svg";
import SwapCard from "./SwapCard";

const SwapComponent = () => {
  return (
    <section className=" flex flex-col  w-full h-full items-center -mt-8">
      <img
        src={hero}
        alt="hero logo"
        className="object-contain w-[300px] h-[300px] "
      />
      <SwapCard />
    </section>
  );
};

export default SwapComponent;

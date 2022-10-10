import React from "react";
import hero from "../../assets/hero.svg";
import LiquidityCard from "./LiquidityCard";

const LiquidityComponent = () => {
  return (
    <section className=" flex flex-col  w-full items-center ">
      <img
        src={hero}
        alt="hero logo"
        className="object-contain w-[300px] h-[300px] "
      />
      <LiquidityCard />
    </section>
  );
};

export default LiquidityComponent;

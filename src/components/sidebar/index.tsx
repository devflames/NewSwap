import React from "react";
import sidebar_primary from "../../assets/sidebar_primary.png";
// import sidebar_secondary from "../../assets/sidebar_secondary.png";
import Navigation from "./Navigation";
import Price from "./Price";
import Social from "./Social";
import sidebar_bg from "../../assets/sidebar_bg.png";

const SideBar = () => {
  return (
    <section
      className="absolute top-0 left-0 flex flex-col gap-4 items-center justify-between w-[320px] bg-accent py-2 px-3 pt-4 h-full bg-no-repeat"
      style={{ backgroundImage: `url(${sidebar_bg})` }}
    >
      <section className="flex flex-col gap-5 items-center w-full ">
        <img
          src={sidebar_primary}
          alt="oreswap  logo"
          className=" object-contain max-w-[190px] max-h-[125px]"
        />
        <Navigation />
      </section>

      <section className="flex flex-col gap-4 items-center w-full px-5">
        {/* <section className="flex flex-col rounded-xl bg-primary bg-opacity-25 items-center">
          <img
            src={sidebar_secondary}
            alt="oreo logo"
            className="object-cover  w-[180px] h-[180px]"
          />
        </section> */}

        <Price />
        <Social />
      </section>
    </section>
  );
};

export default SideBar;

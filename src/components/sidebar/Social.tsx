import React from "react";
import telegram from "../../assets/telegram.svg";
import twitter from "../../assets/twitter.svg";
import discord from "../../assets/discord.svg";
import github from "../../assets/discord.svg";

const Social = () => {
  return (
    <section className="w-full flex mt-2 mb-4 items-center">
      <a href="https://t.me/OreoSwap" target={"_blank"} rel="noreferrer">
        <img src={telegram} alt="telegram" className="w-10 h-10 pl-2" />
      </a>
      <a href="https://twitter.com/oreoswap" target={"_blank"} rel="noreferrer">
        <img src={twitter} alt="twitter" className="w-10 h-10 pl-2" />
      </a>
      <a href="/" target={"_blank"} rel="noreferrer">
        <img src={discord} alt="discord" className="w-10 h-10 pl-2" />
      </a>
      <a href="/" target={"_blank"} rel="noreferrer">
        <img src={github} alt="discord" className="w-10 h-10 pl-2" />
      </a>
    </section>
  );
};

export default Social;

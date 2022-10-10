import React from "react";
import theme from "../../assets/theme.svg";

const Theme = () => {
  return (
    <section className="py-3 px-5 bg-primary rounded-2xl ">
      <img src={theme} alt="theme" className="object-contain w-5 h-5" />
    </section>
  );
};

export default Theme;

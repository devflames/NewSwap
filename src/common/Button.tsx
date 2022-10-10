import React from "react";

const Button = ({
  styles,
  callback,
  placeholder,
}: {
  styles?: string;
  callback: any;
  placeholder?: string;
}) => {
  return (
    <button
      className={`button_gradient px-3 py-3 text-primary rounded-2xl text-center font-bold antialiased hover:bg-violet-600 ${styles}`}
      onClick={() => callback()}
      disabled={placeholder === "Insufficient liquidity" ? true : false}
    >
      {placeholder ? placeholder : "Connect Wallet"}
    </button>
  );
};

export default Button;

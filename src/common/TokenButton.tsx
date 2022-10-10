import React, { useState } from "react";
import arrow_down from "../assets/down_arrow.svg";
import TokenModal from "../components/modals/Token";

interface TokenProps {
  value: any;
  setter: any;
  valueMap: Array<Object>;
  styles: any;
  from: any;
  meta: any;
}

const TokenButton = ({
  value,
  setter,
  valueMap,
  styles,
  from,
  meta,
}: TokenProps) => {
  const [tokenModal, setTokenModal] = useState(false);

  return (
    <>
      <button
        className={`flex items-center justify-center gap-2 antialiased ${styles} `}
        disabled={from === "header"}
        onClick={() => setTokenModal(!tokenModal)}
      >
        <img src={value.logoURI} alt={value.name} className="w-5 h-5" />
        <span className="flex flex-start text-secondary font-semibold">
          {value.symbol}
        </span>
        {from !== "header" && (
          <img
            src={arrow_down}
            alt="select chain"
            className="h-3 w-3 text-secondary self-center"
          />
        )}
      </button>
      <TokenModal
        modal={tokenModal}
        toggleModal={setTokenModal}
        setter={setter}
        valueMap={valueMap}
        value={value}
        meta={meta}
      />
    </>
  );
};

export default TokenButton;

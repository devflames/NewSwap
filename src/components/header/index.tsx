import React, { useState } from "react";
import Chain from "../../common/TokenButton";
// import Theme from "./Theme";
import Trending from "./Trending";
import Button from "../../common/Button";
import { useAccount, useConnect, useEnsName, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { truncateAddress } from "../../hooks/generalHooks";
import ethw from "../../assets/chains/ethw.png";

const TOKENS = [
  {
    name: "Wrapped ETH",
    symbol: "ETHW",
    logoURI: ethw,
  },
];

const Header = () => {
  const [chain, setChain] = useState(TOKENS[0]);

  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <section className="flex items-center gap-4 justify-between  w-full font-primary pl-8 pr-10">
      <section className=" w-3/5">
        <Trending />
      </section>
      <section className="flex items-center gap-4 w-2/5 justify-end">
        <Chain
          value={chain}
          setter={setChain}
          valueMap={TOKENS}
          styles={"w-30 rounded-2xl bg-primary py-3 px-4"}
          from="header"
          meta={{ value1: chain, value2: chain }}
        />
        {isConnected ? (
          <Button
            styles={"font-bold"}
            callback={() => disconnect()}
            placeholder={`Disconnect ${truncateAddress(address || "")}`}
          />
        ) : (
          <Button
            styles={"font-bold"}
            callback={() => connect()}
            placeholder={isConnected ? address : "Connect Wallet"}
          />
        )}
      </section>
    </section>
  );
};

export default Header;

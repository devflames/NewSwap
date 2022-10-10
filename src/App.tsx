import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SwapPage from "./pages/Swap";
import LiquidityPage from "./pages/Liquidity";
import { chain, WagmiConfig, createClient, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import FarmPage from "./pages/Farm";
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const { chains, provider, webSocketProvider } = configureChains([chain.mainnet], [
  alchemyProvider({ apiKey: 'GQYKILqxvgOfxW1kDtyWb12fl3Ya8S_T' }),
  publicProvider(),
])


const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ 
      chains: [chain.mainnet, chain.optimism], 
      }),
    new CoinbaseWalletConnector({
      chains: [chain.mainnet, chain.optimism, chain.goerli],
      options: {
      appName: 'wagmi.sh',
      jsonRpcUrl: 'https://eth-goerli.g.alchemy.com/v2/GQYKILqxvgOfxW1kDtyWb12fl3Ya8S_T',
  },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
        
      },
    }),
  ],
  provider,
  webSocketProvider,
})

function App() {
  return (
    <WagmiConfig client={client}>
      <main className="App">
        <Router>
          <Routes>
            <Route path="/" element={<SwapPage />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/liquidity" element={<LiquidityPage />} />
            <Route path="/farm" element={<FarmPage />} />
            <Route path="/pools" element={<SwapPage />} />
          </Routes>
        </Router>
      </main>
    </WagmiConfig>
  );
}

export default App;

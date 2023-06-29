import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThirdwebProvider,
  safeWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnectV1,
 } from "@thirdweb-dev/react";
import "./styles/globals.css";

if (typeof process === 'undefined') {
  window.process = { nextTick: function(callback) { setTimeout(callback, 0); } };
}

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "polygon";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider
      // supportedWallets={[
      //   safeWallet({
      //     // this is the default
      //     personalWallets: [metamaskWallet(), coinbaseWallet(), walletConnectV1()],
      //   }),
      // ]}
    activeChain={activeChain}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
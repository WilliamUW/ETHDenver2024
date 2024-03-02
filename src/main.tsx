import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react";  
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@rainbow-me/rainbowkit/styles.css";
import {  RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black"
      },
    },
  },
});

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '4cffda32b43c03295d4dd84e8efbeb63',
  chains: [polygon],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "white",
              accentColorForeground: "black",
              // borderRadius: "small",
              // fontStack: "system",
              // overlayBlur: "small",
            })}
          >
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  </React.StrictMode>
);

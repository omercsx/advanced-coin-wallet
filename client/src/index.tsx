import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import WalletProvider from "./providers/WalletProvider";
import DashboardProvider from "./providers/DashboardProvider";
import ExchangeProvider from "./providers/ExchangeProvider";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <WalletProvider>
        <ExchangeProvider>
          <DashboardProvider>
            <BrowserRouter>
              <MantineProvider
                theme={{
                  colorScheme: "dark",
                  colors: {
                    // override dark colors here to change them for all components
                    dark: [
                      // '#d5d7e0',
                      // '#acaebf',
                      // '#8c8fa3',
                      // '#666980',
                      // '#4d4f66',
                      // '#34354a',
                      // '#2b2c3d',
                      // '#1d1e30',
                      // '#0c0d21',
                      // '#01010a',
                      "#f3f4f5",
                      "#e6eaeb",
                      "#c1cacd",
                      "#9ba9af",
                      "#516974",
                      "#062938",
                      "#052532",
                      "#051f2a",
                      "#041922",
                      "#03141b",
                    ],
                  },
                }}
                withGlobalStyles
              >
                <App />
              </MantineProvider>
            </BrowserRouter>
          </DashboardProvider>
        </ExchangeProvider>
      </WalletProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

import { createContext, useContext, useState } from "react";

const MetaContext = createContext();

function MetaProvider(props) {
  const [initialized, setInit] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [market, setMarket] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [currentAccount, setCurrentAccounts] = useState(null);
  const [blindContract, setBlindContract] = useState(null);

  const values = {
    initialized,
    setInit,
    web3,
    setWeb3,
    market,
    setMarket,
    currentAccount,
    setCurrentAccounts,
    blindContract,
    setBlindContract,
    accounts,
    setAccounts,
  };

  return (
    <MetaContext.Provider value={values} {...props}></MetaContext.Provider>
  );
}

function useMeta() {
  const context = useContext(MetaContext);
  if (typeof context === "undefined")
    throw new Error("useMeta must be used within MetaProvider!");
  return context;
}

export { MetaProvider, useMeta };

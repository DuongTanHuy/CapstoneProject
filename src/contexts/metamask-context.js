// import useLocalStorage from "hooks/useLocalStorage";
import { createContext, useContext, useState } from "react";

const MetaContext = createContext();

function MetaProvider(props) {
  const [initialized, setInitS] = useState(false);
  const [web3, setWeb3S] = useState(null);
  // const [market, setMarketS] = useState(null);
  const [accounts, setAccountsS] = useState(null);
  const [currentAccount, setCurrentAccountsS] = useState(null);
  const [blindContract, setBlindContractS] = useState(null);

  // const { storedValue, setStorageValue } = useLocalStorage("accountInfo", {
  //   initialized: false,
  //   web3: "",
  //   currentAccount: "",
  //   blindContract: "",
  //   accounts: "",
  // });

  const setWeb3 = (value) => {
    setWeb3S(value);
  };
  const setInit = (value) => {
    setInitS(value);
    // setStorageValue({
    //   ...storedValue,
    //   initialized: value,
    // });
  };
  const setCurrentAccounts = (value) => {
    setCurrentAccountsS(value);
    // setStorageValue({
    //   ...storedValue,
    //   currentAccount: value,
    // });
  };
  const setBlindContract = (value) => {
    setBlindContractS(value);
    // setStorageValue({
    //   ...storedValue,
    //   blindContract: value,
    // });
  };
  const setAccounts = (value) => {
    setAccountsS(value);
    // setStorageValue({
    //   ...storedValue,
    //   accounts: value,
    // });
  };

  const values = {
    initialized,
    setInit,
    web3,
    setWeb3,
    currentAccount,
    setCurrentAccounts,
    blindContract,
    setBlindContract,
    accounts,
    setAccounts,
    // storedValue,
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

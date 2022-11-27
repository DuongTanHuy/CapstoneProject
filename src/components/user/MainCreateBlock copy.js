import BlindAuction from "../../contracts/BlindAuction.json";
import React, { useEffect } from "react";
import getWeb3 from "getWeb3";
import { useMeta } from "contexts/metamask-context";

const MainCreateBlock = () => {

  const {
    web3,
    initialized,
    setInit,
    setWeb3,
    setAccounts,
    setCurrentAccounts,
    setBlindContract,
  } = useMeta();

  const init = async () => {
    if (initialized === false) return;
    const accounts = await web3?.eth.getAccounts();
    setAccounts(accounts);
  };

  useEffect(() => {
    const render = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork2 = BlindAuction.networks[networkId];
        const instance2 = await new web3.eth.Contract(
          BlindAuction.abi,
          deployedNetwork2 && deployedNetwork2.address
        );
        instance2.options.address = deployedNetwork2?.address;
        setWeb3(web3);
        setAccounts(accounts);
        setBlindContract(instance2);
        setInit(true);
        setCurrentAccounts(accounts[0]);
        init();
      } catch (error) {
        console.error(error);
      }
    };
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
};

export default MainCreateBlock;

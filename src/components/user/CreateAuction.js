import { useMeta } from "contexts/metamask-context";
import React from "react";

const CreateAuction = (props) => {
  //   const [web3, setWeb3] = useState(null);
  // //   const [accounts, setAccounts] = useState(null);
  // //   const [currentAccount, setCurrentAccounts] = useState(null);
  //   const [blindContract, setBlindContract] = useState(null);

    // useEffect(() => {
    //   setBlindContract(props.blind_contract);
    //   setWeb3(props.web3);
    //   setCurrentAccounts(props.account);
    // }, [props.blind_contract, props.web3]);

  const { web3, blindContract } = useMeta();

  const createAuction = async () => {
    console.log(web3);
    console.log(blindContract);
    const accounts = await web3?.eth.getAccounts();
    // setAccounts(accounts);

    let bidding_time = parseInt(new Date() / 1000);
    let reveal_time = parseInt(new Date() / 1000) - bidding_time;

    await blindContract?.methods
      .auctionItem(
        "item_name",
        "item_description",
        1,
        bidding_time,
        reveal_time
      )
      .send({ from: accounts[0] });
  };

  return (
    <div>
      <button onClick={createAuction}>Click me!</button>
    </div>
  );
};

export default CreateAuction;

import { useMeta } from "contexts/metamask-context";
import React from "react";

const CreateAuction = (props) => {

  const { web3, setAccounts, blindContract } = useMeta();

  const createAuction = async () => {
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts);

    let bidding_time = parseInt(new Date() / 1000);
    let reveal_time = parseInt(new Date() / 1000) - bidding_time;

    await blindContract.methods
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

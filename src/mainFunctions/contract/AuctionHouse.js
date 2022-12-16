import React, { Component } from "react";
import { Table, Button, InputGroup } from "react-bootstrap";
import { get_secret } from "../../pub_pvt";
import EthCrypto from "eth-crypto";
class AuctionHouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      currentAccount: null,
      market: null,
      blind_contract: null,
      vickrey_contract: null,
      average_contract: null,
      listings: [],
      makebid: false,
      formData: {},
      decrypted: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.makeBid = this.makeBid.bind(this);
    this.endAuction = this.endAuction.bind(this);
    this.sellItem = this.sellItem.bind(this);
    this.verify = this.verify.bind(this);
    this.confirm = this.confirm.bind(this);
    this.revealBid = this.revealBid.bind(this);
  }
  componentDidMount = async () => {
    try {
      this.setState({
        blind_contract: this.props.blind_contract,
        market: this.props.market,
        web3: this.props.web3,
        currentAccount: this.props.account,
      });
      let offSet = 1000;
      let marketListings = await this.props.market.methods
        .fetchactivelistings()
        .call({ from: this.props.account });
      console.log(marketListings);
      for (let i = 0; i < marketListings.length; ++i) {
        console.log(i);
        marketListings[i]["type"] = "Normal Listing";
        marketListings[i]["new_auction_id"] =
          parseInt(marketListings[i]["auction_id"]) + offSet;
        marketListings[i]["bidding_deadline"] = "NA";
        marketListings[i]["reveal_deadline"] = "NA";
      }
      offSet += marketListings.length;
      let blindAuctions = await this.props.blind_contract.methods
        .getactiveauctions()
        .call({ from: this.props.account });
      for (let i = 0; i < blindAuctions.length; ++i) {
        console.log(i);
        blindAuctions[i]["type"] = "Blind Auction";
        blindAuctions[i]["new_auction_id"] =
          parseInt(blindAuctions[i]["auction_id"]) + offSet;
        blindAuctions[i]["bidding_deadline"] = new Date(
          blindAuctions[i]["biddingEnd"] * 1000
        );
        blindAuctions[i]["reveal_deadline"] = new Date(
          blindAuctions[i]["revealEnd"] * 1000
        );
        blindAuctions[i]["price"] = parseInt(blindAuctions[i]["start_price"]);
      }
      offSet += blindAuctions.length;
      let auctions = [].concat(marketListings, blindAuctions);
      this.setState({ listings: auctions });
    } catch (error) {
      alert(error);
    }
  };

  verify = (auction_id) => async (e) => {
    e.preventDefault();
    const { blind_contract, currentAccount } = this.state;
    try {
      let marketListings = await blind_contract.methods
        .getallauctions()
        .call({ from: currentAccount });
      let key = marketListings[auction_id].H;
      let cipher = EthCrypto.cipher.parse(key);
      //decrypt using the private key offchain
      let buyer_private_key = this.state.formData.pvtkey;
      let decrypted = await EthCrypto.decryptWithPrivateKey(
        buyer_private_key,
        cipher
      );
      this.setState({ decrypted });
    } catch (err) {
      console.log(err);
      alert(`Error in decrypting key`);
    }
  };

  confirm = (auction_id) => async (e) => {
    e.preventDefault();
    const { blind_contract, currentAccount } = this.state;
    try {
      await blind_contract.methods
        .confirmDelivery(auction_id)
        .send({ from: currentAccount });
    } catch (error) {
      alert(`Error! Could not confirm: ${error}`);
    }
  };

  makeBid = (auction_id) => async (e) => {
    e.preventDefault();
    const { blind_contract, currentAccount, web3 } = this.state;
    this.setState({ makebid: !this.state.makebid });
    try {
      const { value, secret_key, deposit, publickey } = this.state.formData;
      await blind_contract.methods
        .bid(
          web3.utils.keccak256(
            web3.eth.abi.encodeParameters(
              ["uint256", "string"],
              [value, secret_key]
            )
          ),
          parseInt(auction_id),
          publickey
        )
        .send({
          from: currentAccount,
          value: deposit,
        });
      // window.location.reload(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  revealBid = (auction_id) => async (e) => {
    e.preventDefault();
    const { value, secret_key } = this.state.formData;
    const { blind_contract, currentAccount } = this.state;
    try {
      await blind_contract.methods
        .reveal(value, secret_key, parseInt(auction_id))
        .send({
          from: currentAccount,
        });

      window.location.reload(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  sellItem = (auction_id) => async (e) => {
    try {
      let marketListings = await this.state.blind_contract.methods
        .getallauctions()
        .call({ from: this.state.currentAccount });
      let pubkey = marketListings[auction_id].pubkey;
      let secret = await get_secret(pubkey, this.state.formData.unique_string);
      let value = marketListings[auction_id].finalBid * 2;
      await this.state.blind_contract.methods
        .sellItem(auction_id, secret)
        .send({
          from: this.state.currentAccount,
          value,
        });
    } catch (error) {
      alert(`Sell Item Error: ${error}`);
    }
  };

  endAuction = (auction_id) => async (e) => {
    e.preventDefault();
    const {  blind_contract } =
      this.state;
    try {
      await blind_contract.methods.auctionEnd(parseInt(auction_id)).send({
        from: this.state.currentAccount,
      });
    } catch (error) {
      alert(`End Auction Error: ${error.message}`);
    }
  };

  handleChange(e) {
    e.preventDefault();
    const formData = Object.assign({}, this.state.formData);
    formData[e.target.id] = e.target.value;
    this.setState({ formData: formData });
  }

  render() {
    return (
      <>
        <h2>The active listings are:</h2>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Auction ID</td>
                <td>Auction Type</td>
                <td>Item Name</td>
                <td>Item Description</td>
                <td>Item Price</td>
                <td>Bidding Deadline</td>
                <td>Bid Reveal Deadline</td>
                <td>Manage</td>
              </tr>
            </thead>
            <tbody>
              {this.state.listings.map((listing) => {
                let status = "Active";
                let type = "Normal";
                if (listing.type === "Normal Listing") {
                  if (listing.buyer_alloted) {
                    status = "Requested";
                  }
                  if (listing.H) {
                    status = "Sold";
                  }
                  if (listing.sold_or_withdrawn) {
                    status = "Done";
                  }
                } else {
                  type = "Not";
                  if (Date.now() > listing.bidding_deadline) {
                    status = "Bidding Over";
                  }
                  if (Date.now() > listing.reveal_deadline) {
                    status = "Reveal Over";
                  }
                  if (listing.ended) {
                    status = "Ended";
                  }
                  if (listing.H) {
                    status = "Sold";
                  }
                  if (listing.sold) {
                    status = "Done";
                  }
                }
                console.log(status);
                return (
                  <tr key={listing.new_auction_id}>
                    <td>{listing.new_auction_id}</td>
                    <td>{listing.type}</td>
                    <td>{listing.item_name}</td>
                    <td>{listing.item_description}</td>
                    <td>
                      {listing.type !== "Normal Listing" ? "NA" : listing.price}
                    </td>
                    <td>
                      {listing.type !== "Normal Listing"
                        ? listing.bidding_deadline.toString()
                        : listing.bidding_deadline}
                    </td>
                    <td>
                      {listing.type !== "Normal Listing"
                        ? listing.reveal_deadline.toString()
                        : listing.reveal_deadline}
                    </td>
                    <td>
                      {listing.beneficiary === this.state.currentAccount ? (
                        // Seller
                        type === "Normal" ? (
                          status === "Active" ? (
                            <Button variant="outline-success" disabled>
                              Active
                            </Button>
                          ) : status === "Requested" ? (
                            <>
                              <p>
                                Item requested. <br /> Buyer:{" "}
                                {listing.buyer ? listing.buyer : "None"} <br />{" "}
                                Selling Price: {listing.price}
                              </p>
                              <input
                                type="string"
                                className="form-control"
                                id="unique_string"
                                required
                                onChange={this.handleChange}
                                placeholder="Unique String"
                              />
                              <Button
                                variant="success"
                                onClick={this.sellItem(
                                  listing.auction_id,
                                  listing.type
                                )}
                              >
                                Sell Item
                              </Button>
                            </>
                          ) : status === "Sold" ? (
                            <>
                              <Button variant="outline-info" disabled>
                                Out for Delivery
                              </Button>
                              <p>
                                <br /> Buyer:{" "}
                                {listing.buyer ? listing.buyer : "None"} <br />{" "}
                                Selling Price: {listing.price}
                              </p>
                            </>
                          ) : (
                            <></>
                          )
                        ) : // Auctions
                        status === "Active" || status === "Bidding Over" ? (
                          <Button variant="outline-success" disabled>
                            Active
                          </Button>
                        ) : status === "Reveal Over" ? (
                          <Button
                            onClick={this.endAuction(
                              listing.auction_id,
                              listing.type
                            )}
                            variant="danger"
                          >
                            End Auction
                          </Button>
                        ) : status === "Ended" ? (
                          <>
                            <p>
                              Auction Ended Successfully. <br /> Winner:{" "}
                              {listing.winner ? listing.winner : "None"} <br />{" "}
                              Winning Bid:{" "}
                              {listing.finalBid > 0 ? listing.finalBid : "NA"}
                            </p>
                            <input
                              type="string"
                              className="form-control"
                              id="unique_string"
                              required
                              onChange={this.handleChange}
                              placeholder="Unique String"
                            />
                            <Button
                              variant="success"
                              onClick={this.sellItem(
                                listing.auction_id,
                                listing.type
                              )}
                            >
                              Sell Item
                            </Button>
                          </>
                        ) : status === "Sold" ? (
                          <>
                            <Button variant="outline-info" disabled>
                              Out for Delivery
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline-success" disabled>
                            Delivered
                          </Button>
                        )
                      ) : // Buyer
                      type === "Normal" ? (
                        // Market
                        status === "Active" ? (
                          <>
                            <InputGroup>
                              <input
                                type="string"
                                className="form-control"
                                id="publickey"
                                required
                                onChange={this.handleChange}
                                placeholder="Public Key"
                              />
                            </InputGroup>
                            <Button
                              variant="primary"
                              onClick={this.makeBid(
                                listing.auction_id,
                                listing.type,
                                listing.price
                              )}
                            >
                              Buy Item
                            </Button>
                          </>
                        ) : // Requested to Buy
                        status === "Requested" ? (
                          <>
                            {listing.buyer === this.state.currentAccount ? (
                              <Button variant="info" disabled>
                                Requested to Buy
                              </Button>
                            ) : (
                              <Button variant="outline-danger" disabled>
                                Buyer has been Alloted
                              </Button>
                            )}
                          </>
                        ) : // Sold by owner
                        status === "Sold" ? (
                          <>
                            {this.state.decrypted ? (
                              <>
                                <p>Decrypted string: {this.state.decrypted}</p>
                                <Button
                                  variant="primary"
                                  onClick={this.confirm(
                                    listing.auction_id,
                                    listing.type
                                  )}
                                >
                                  Confirm Delivery
                                </Button>
                              </>
                            ) : (
                              <>
                                <InputGroup>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="pvtkey"
                                    required
                                    onChange={this.handleChange}
                                    placeholder="Private Key"
                                  />
                                </InputGroup>
                                <Button
                                  variant="warning"
                                  onClick={this.verify(
                                    listing.auction_id,
                                    listing.type
                                  )}
                                >
                                  Decrypt Item String
                                </Button>
                              </>
                            )}
                          </>
                        ) : (
                          // Delivered
                          <Button variant="outline-success" disabled>
                            Delivered
                          </Button>
                        )
                      ) : // Auctions
                      status === "Active" ? (
                        <>
                          {listing.bidplaced === true ? (
                            <Button variant="info" disabled>
                              Bid Placed
                            </Button>
                          ) : (
                            <>
                              <InputGroup>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="value"
                                  required
                                  onChange={this.handleChange}
                                  placeholder="Bid Amount"
                                />
                                <input
                                  type="password"
                                  className="form-control"
                                  id="secret_key"
                                  required
                                  onChange={this.handleChange}
                                  placeholder="Secret Key"
                                />
                              </InputGroup>
                              <InputGroup>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="deposit"
                                  required
                                  onChange={this.handleChange}
                                  placeholder="Deposit Amount (>2*Bid Amount)"
                                />
                                <input
                                  type="string"
                                  className="form-control"
                                  id="publickey"
                                  required
                                  onChange={this.handleChange}
                                  placeholder="Public Key"
                                />
                              </InputGroup>
                              <Button
                                variant="primary"
                                onClick={this.makeBid(
                                  listing.auction_id,
                                  listing.type
                                )}
                              >
                                Place Bid
                              </Button>
                            </>
                          )}
                        </>
                      ) : // Bidding Time ended
                      status === "Bidding Over" ? (
                        <>
                          {listing.bidplaced === true ? (
                            listing.revealed ? (
                              <Button variant="info" disabled>
                                Revealed
                              </Button>
                            ) : (
                              <>
                                <InputGroup>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="value"
                                    required
                                    onChange={this.handleChange}
                                    placeholder="Bid Amount"
                                  />
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="secret_key"
                                    required
                                    onChange={this.handleChange}
                                    placeholder="Secret Key"
                                  />
                                </InputGroup>
                                <Button
                                  variant="info"
                                  onClick={this.revealBid(
                                    listing.auction_id,
                                    listing.type
                                  )}
                                >
                                  Reveal Bid
                                </Button>
                              </>
                            )
                          ) : (
                            <Button variant="danger" disabled>
                              Bidding Time Over
                            </Button>
                          )}
                        </>
                      ) : // Auction reveal deadline
                      status === "Reveal Over" ? (
                        <Button variant="danger" disabled>
                          Reveal Time Over. <br />
                          Wait for auction end.
                        </Button>
                      ) : // Auction ended
                      status === "Ended" ? (
                        <>
                          {listing.winner === this.state.currentAccount ? (
                            <>
                              <Button variant="success" disabled>
                                Auction Won! <br />
                                Bid Price:{" "}
                                {listing.finalBid > 0
                                  ? listing.finalBid
                                  : "NA"}{" "}
                              </Button>
                            </>
                          ) : (
                            <Button variant="info" disabled>
                              Auction Ended. <br />
                              Won by: {listing.winner
                                ? listing.winner
                                : "None"}{" "}
                              <br />
                              Winning Bid:{" "}
                              {listing.finalBid > 0 ? listing.finalBid : "NA"}
                            </Button>
                          )}
                        </>
                      ) : // Sold by owner
                      status === "Sold" ? (
                        <>
                          {listing.winner === this.state.currentAccount ? (
                            <>
                              <Button variant="success" disabled>
                                Auction Won! <br />
                                Bid Price:{" "}
                                {listing.finalBid > 0
                                  ? listing.finalBid
                                  : "NA"}{" "}
                              </Button>
                              <br />
                              <InputGroup>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="pvtkey"
                                  required
                                  onChange={this.handleChange}
                                  placeholder="Private Key"
                                />
                              </InputGroup>
                              <Button
                                variant="primary"
                                onClick={this.confirm(
                                  listing.auction_id,
                                  listing.type
                                )}
                              >
                                Confirm Delivery
                              </Button>
                            </>
                          ) : (
                            <Button variant="info" disabled>
                              Auction Ended. <br />
                              Won by: {listing.winner
                                ? listing.winner
                                : "None"}{" "}
                              <br />
                              Winning Bid:{" "}
                              {listing.finalBid > 0 ? listing.finalBid : "NA"}
                            </Button>
                          )}
                        </>
                      ) : // Delivered
                      status === "Done" ? (
                        <Button variant="success" disabled>
                          Delivered{" "}
                        </Button>
                      ) : (
                        <> Wait for Auction End </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}

export default AuctionHouse;

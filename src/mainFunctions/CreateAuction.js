import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

class CreateAuctions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      accounts: null,
      currentAccount: null,
      blind_contract: null,
      formData: {
        auctionType: ""
      },
      eventfails: ["ItemUnsold", "DepositNotEnough", "BidRevealFailed", "Aborted"]
    }
    this.handleChange = this.handleChange.bind(this);
    this.createAuction = this.createAuction.bind(this);
  }
  componentDidMount = async () => {
    this.setState({
      blind_contract: this.props.blind_contract,
      web3: this.props.web3,
      currentAccount: this.props.account
    });
  }
  handleChange(e) {
    e.preventDefault();
    const formData = Object.assign({}, this.state.formData);
    formData[e.target.id] = e.target.value;
    this.setState({ formData: formData });
  }

  createAuction = async (e) => {
    e.preventDefault();
    const accounts = await this.state.web3?.eth.getAccounts();
    this.setState({ accounts });
    const {blind_contract} = this.state;
    
      const { auctionType, item_name, item_description, start_price, bidding_deadline, reveal_deadline } = this.state.formData;
      let bidding_time = parseInt(((new Date(bidding_deadline)).getTime() - Date.now()) / 1000);
      let reveal_time = parseInt(((new Date(reveal_deadline)).getTime() - Date.now()) / 1000) - bidding_time;
      if (bidding_time <= 0) {
        alert("Invalid Bidding Deadline");
        return false;
      }
      if (reveal_time <= 0) {
        alert("Invalid Reveal Deadline");
        return false;
      }
      if (auctionType === "Blind Auction") {
        await blind_contract?.methods.auctionItem(item_name, item_description, start_price, bidding_time, reveal_time).send({ from: accounts[0] });
        console.log(auctionType, item_name, item_description, start_price, bidding_deadline, reveal_deadline);
      }
    
  };


  render() {
    return (
      <>
        <div className="form-group">
          <form onSubmit={this.createAuction}>
            <h2>Add your listing</h2>
            <br />
            <div className="mb-3">
              <label className="form-label">Listing Type</label>
              <select className="form-select" id="auctionType" placeholder="Select Auction Type" required onChange={this.handleChange}>
                <option value="Select Type" disabled="disabled" selected>Select Type</option>
                <option value="Normal Listing">Public Auction</option>
                <option value="Blind Auction">Blind Auction</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Item Name</label>
              <input type="item_name" className="form-control" id="item_name" required onChange={this.handleChange} placeholder="Phone" />
            </div>
            <div className="mb-3">
              <label className="form-label">Item description</label>
              <input type="item_description" className="form-control" id="item_description" required onChange={this.handleChange} placeholder="IPhone11" />
            </div>
            {this.state.formData.auctionType === "" ?
              <></>
              :
              <>
                {
                  <>
                    <div className="mb-3">
                      <label className="form-label">Start Price</label>
                      <input type="number" className="form-control" id="start_price" required onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Bidding Deadline</label>
                      <input type="datetime-local" className="form-control" id="bidding_deadline" required onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Reveal Deadline</label>
                      <input type="datetime-local" className="form-control" id="reveal_deadline" required onChange={this.handleChange} />
                    </div>
                    </>
                }
              </>
            }
            <Button type="submit">Create Auction</Button>
          </form>
        </div>
      </>
    );
  }
}
export default CreateAuctions;
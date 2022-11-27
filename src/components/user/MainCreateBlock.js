import getWeb3 from "getWeb3";
import CreateAuctions from "mainFunctions/CreateAuction";
import { Component, Fragment } from "react";
import { Spinner } from "react-bootstrap";
import BlindAuction from "../../contracts/BlindAuction.json";

class MainCreateBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      web3: null,
      accounts: null,
      currentAccount: null,
      blind_contract: null,
      listings: [],
      formData: {},
    };
  }

  componentDidMount = async () => {
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
      console.log(instance2);
      this.setState(
        {
          web3,
          accounts,
          blind_contract: instance2,

          initialized: true,
          currentAccount: accounts[0],
        },
        this.init
      );
    } catch (error) {
      console.error(error);
    }
  };

  init = async () => {
    if (this.state.initialized === false) return;
    const { web3 } = this.state;
    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts });
    const response = await web3.eth.getBalance(accounts[0]);
    console.log(response);
  };

  render() {
    if (!this.state.web3) {
      return (
        <div className="spinner" style={{ marginLeft: 10, marginTop: 10 }}>
          <Spinner animation="border" />
          <br />
        </div>
      );
    }
    return (
      <Fragment>
        <CreateAuctions
          web3={this.state.web3}
          account={this.state.currentAccount}
          blind_contract={this.state.blind_contract}
        />
      </Fragment>
    );
  }
}

export default MainCreateBlock;

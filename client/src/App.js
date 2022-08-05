import React, { Component } from "react";
import CadastralContract from "./contracts/CadastralContract.json";
// import pages
import CreateEstate from "./pages/CreateEstate";        // 建立土地
import SplitEstate from "./pages/SplitEstate";          // 分割土地
import NowEstateList from "./pages/NowEstateList";      // 土地現況
import SearchFromChain from "./pages/SearchFromChain";  // 土地驗證
import Version from "./pages/Version";                  // 版本查詢
import MergeEstate from "./pages/MergeEstate";          // 合併土地
import Update from "./pages/Update";                    // 測試

import { ContextProvider } from "./Context";
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";
import Web3 from 'web3';

class App extends Component {
  state = { 
    web3: null, 
    accounts: null, 
    contract: null ,
    selectedPage: 0,
  };

  componentDidMount = async () => {
    try {
      const web3 = new Web3("http://localhost:8545");

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CadastralContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CadastralContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <ContextProvider>
        <Router>
          <div className="linkList">
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
              <Link to="/" className="navbar-brand">首頁</Link><br/>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  {/* <a className="nav-item nav-link active" href="www.google.com">Home <span className="sr-only">(current)</span></a>
                  <a className="nav-item nav-link" href="#">Features</a> */}

                  <NavLink to="/createEstate" activeClassName="nav-item nav-link active" className="nav-item nav-link">建立土地</NavLink>
                  <NavLink to="/splitEstate" activeClassName="nav-item nav-link active" className="nav-item nav-link">分割土地</NavLink>
                  <NavLink to="/nowEstateList" activeClassName="nav-item nav-link active" className="nav-item nav-link">土地現況</NavLink>
                  <NavLink to="/searchFromChain" activeClassName="nav-item nav-link active" className="nav-item nav-link">土地驗證</NavLink>
                  <NavLink to="/versionSearch" activeClassName="nav-item nav-link active" className="nav-item nav-link">版本查詢</NavLink>
                  <NavLink to="/mergeEstate" activeClassName="nav-item nav-link active" className="nav-item nav-link">合併土地</NavLink>
                  <NavLink to="/update" activeClassName="nav-item nav-link active" className="nav-item nav-link">測試</NavLink>
                </div>
              </div>
            </nav>
            <div className="jumbotron">
              <h4 className="display-4">使用TWD97 121分帶 <span className="badge badge-secondary">EPSG 3826</span></h4>
              <p className="lead">採用區塊鏈技術，永久保存地籍變更土地資訊，實作事件溯源讀寫分離機制</p>
              <p>Your account: {this.state.accounts[0]}</p>
            </div>
          </div>
          <div style={{
            minHeight: '500px',
            paddingBottom: '50px',
          }}>
            <Switch>
              <Route exact path="/"><Home /></Route>
              <Route path="/createEstate"><CreateEstate web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} /></Route>
              <Route path="/splitEstate"><SplitEstate web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} /></Route>
              <Route path="/nowEstateList"><NowEstateList /></Route>
              <Route path="/searchFromChain"><SearchFromChain web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} /></Route>
              <Route path="/versionSearch"><Version /></Route>
              <Route path="/mergeEstate"><MergeEstate web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} /></Route>
              <Route path='/update'><Update /></Route>
            </Switch> 
          </div>
        </Router>
        <nav className="navbar navbar-dark bg-dark" style={{height: 100}}>
          
        </nav>
        <nav className="navbar navbar-dark bg-dark" style={{
          height: 50, 
          display: 'felx', 
          justifyContent: 'space-around'
        }}>
          <p className="navbar-brand font-italic" style={{
            fontSize: 15,
          }}>
            Copyright © 2022 mozixreality at CF Lab in NCCU All right reserved
          </p>
        </nav>
      </ContextProvider>
    );
  }
}

function Home(){
  return (
      <div style={{
        paddingLeft: '20px',
        boxSizing: 'content-box',
      }}>
      <h1>Home!</h1>
      </div>
  );
}

export default App;

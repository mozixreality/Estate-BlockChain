import React, { Component } from "react";
import EstateFormat from "../components/EstateFormat.js";
import { Context } from "../Context";

class CreateEstate extends Component {
  state = { web3: null, accounts: null, contract: null };

  static contextType = Context

  componentDidMount = async () => {
    this.setState({
      web3: this.props.web3,
      accounts: this.props.accounts,
      contract: this.props.contract
    });
    console.log(this.context.Operation.Create)
  };

  page = async () => {
    const { accounts, contract } = this.state;
    var form = document.getElementById("createForm");
    let dataForm = EstateFormat.getCreatForm(form);
    let dataObject = dataForm.DFormat;
    let eventData = ""
    let becomeList = new Array(1);
    becomeList[0] = dataObject.json;
    eventData = EstateFormat.getEventFormat([], becomeList, 0, form[5].value);
    eventData = JSON.stringify(eventData);
    //console.log(dataObject.id,dataObject.blockChain,dataForm.PFormat.blockChain,[],0,eventData,[])
    console.log("create!");
    
    const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
    var operationID = 0
    await fetch(backendServer + `/operation_id?operation_type=${this.context.Operation.Create}`)
      .then(response => response.json())
      .then(json => operationID = json.insertId)
    
    await contract.methods.create({
        id: dataObject.id,
        data: dataObject.blockChain,
        poly: dataForm.PFormat.blockChain,
        pa: [],
        functional: 0,
        eventdata: eventData,
        other: []
      },
      operationID,
      this.context.Operation.Create,
    ).send({
      from: accounts[0],
      gas: 100000000
    }, function (error, transactionHash) {
      console.log(error, transactionHash)
    }).on('error', function (error) {
      console.log(error)
    }).on('transactionHash', function (transactionHash) {
      console.log(transactionHash)
    }).on('receipt', function (receipt) {
      console.log("YA", receipt) // contains the new contract address
    });
    console.log("success");
  };


  render() {
    if (!this.state.web3) {
      return <div>shit</div>
    }
    return (
      <div id="creatEstate" style={{
        paddingLeft: '20px',
        paddingBottom: '20px',
        boxSizing: 'content-box',
      }}>
        <h1>新增一筆土地</h1>
        <form id="createForm">
          <label>PMNO</label><br />
          <input type="text" id="pmno" placeholder="4位數字" size="10"></input><br />
          <label>PCNO</label><br />
          <input type="text" id="pcno" placeholder="4位數字" size="10"></input><br />
          <label>SCNO</label><br />
          <input type="text" id="scno" placeholder="4位數字" size="10"></input><br />
          <label>County</label><br />
          <input type="text" id="county" placeholder="taipei" size="10"></input><br />
          <label>Township</label><br />
          <input type="text" id="townShip" placeholder="2位數字" size="10"></input><br />
          <label>記錄日期</label><br />
          <input type="text" id="begD" placeholder="20200217" size="10"></input><br />
          <label>PointList</label><br />
          <input type="text" id="pointList" placeholder="順時鐘輸入 [x1,y1],[x2,y2]..." size="40"></input><br />
          <button type="button" onClick={this.page}>送出</button>
        </form>
      </div>
    );
  };
}



export default CreateEstate;

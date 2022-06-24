import React, { Component, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Context } from "../Context";

let Web3 = require('web3')

export async function importEstate(form) {

  const context = useContext(Context)

  try {
    //const web3 = await getWeb3();
    const web3 = new Web3("http://localhost:8000");

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
  let pmno = form.pmno, pcno = form.pcno, scno = form.scno, county = form.county, townShip = form.townShip, begDate = form.begDate, pointList = form.pointList;
  let PFormat = this.polygonFormat(pointList);
  let DFormat = this.dataFormat(pmno + pcno + scno + begDate, pmno, pcno, scno, county, 0, begDate, begDate, [], [], townShip, 0, PFormat.json);
  let dataForm = { PFormat, DFormat };
  let dataObject = dataForm.DFormat;
  let eventData = ""
  let becomeList = new Array(1);
  becomeList[0] = dataObject.json;
  eventData = EstateFormat.getEventFormat([], becomeList, 0, form[5].value);
  eventData = JSON.stringify(eventData);
  param = {
    
  }
  const backendServer = context.BackendServer + ":" + context.BackendServerPort
  var operationID = 0
  await fetch(backendServer + `/operation_id?operation_type=${context.Operation.Create}`)
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
    context.Operation.Create
  ).send({ from: accounts[0] });
}

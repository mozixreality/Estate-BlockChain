import React, { Component } from "react";
import { NextFunctionTable, PreFunctionTable} from "../components/EventFunctionTable.js";
import EstateFormat from '../components/EstateFormat.js';
import createMap from '../components/CadastralMap.js';
import createTree from '../components/TreeView.js';

import { Context } from "../Context";
import { json } from "d3";

class Version extends Component{
    state = {
    //     estateList:[],
    //     eventList:[],
    //     historyEventList:[],
    //     date:null,
        estates: [],
        estateInfo: null,
    //     width:800,
    //     height:600,
    //     tree:[],
    //     leaves:[]
    };
    
    static contextType = Context

    // showGraph = (estateList) => {
    //     const {width,height} = this.state;
    //     let polyList = [];
    //     estateList.map((val,k) => (
    //         polyList.push({poly:EstateFormat.getPointFormat(val.polygon),id:val.id})
    //     ))
    //     createMap(height,width,this,polyList);
    // }

    // page = async () => {
    //     let date = document.getElementById("dataSearch").value;
    //     date = date.slice(0,4) + "-" + date.slice(4,6) + "-" + date.slice(6,8);
    //     //抓現在還在的地籍資料
    //     const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
    //     let nowData = await fetch(backendServer + `/searchFromNow?date=${date}`).then((response) => {
    //         return response.json();
    //     }).then((myjson) => {
    //         return myjson;
    //     });
    //     //抓該日期舊有地籍資料
    //     let oldData = await fetch(backendServer + `/searchFromOld?date=${date}`).then((response) => {
    //         return response.json();
    //     }).then((myjson) => {
    //         return myjson;
    //     });
        
    //     let estateList = [];
    //     console.log(nowData.length);
    //     if(nowData.length === 0){
    //         alert("輸入其他日期");
    //         return;
    //     }

    //     for(let i = 0;i < nowData.length;i++){
    //         estateList.push(JSON.parse(nowData[i].EstateData));
    //     }
    //     for(let i = 0;i < oldData.length;i++){
    //         estateList.push(JSON.parse(oldData[i].EstateData));
    //     }

    //     let eventList = await fetch(backendServer + `/searchFromEvent?date=${date}`).then((response) => {
    //         return response.json();
    //     }).then((myjson) => {
    //         return myjson;
    //     });
    //     eventList.map((val,key) => (
    //         val.EstateEvent = JSON.parse(val.EstateEvent)
    //     ));

    //     let historyEventList =  [];
    //     date = new Date(date);
    //     this.showGraph(estateList);
    //     this.generateTree(estateList);
    //     this.setState({estateList,eventList,historyEventList,date});
    // };

    // showTreeGraph = (treeNode,leaves) => {
    //     const {width,height} = this.state;
    //     createTree(treeNode,leaves,width,height);
    // }
    
    // generateTree = async (estateList) => {
    //     let { leaves } = this.state;
    //     let treeNode = [];
    //     if(estateList[0].data.children.length === 1){
    //         let ele = estateList[0];
    //         let node = {name:ele.id,parents:[],children:[]}
    //         treeNode.push(node);
    //         leaves.push(node);
    //     }
    //     else{
    //         estateList.forEach((ele) => {
    //             let node = {name:ele.id,parents:[],children:[]}
    //             treeNode.push(node);
    //             leaves.push(node);
    //         })
    //     }

    //     for(let i = 0;i < estateList.length;i++){
    //         let tmpList = [];
    //         let children = estateList[i].data.children;
    //         //console.log(children);
    //         const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
    //         for(let j = 0;j < children.length;j++){
    //             let es = await fetch(backendServer + `/searchUniverse?id=${children[j]}`).then((response) => {
    //                 return response.json();
    //             }).then((myjson) => {
    //                 return myjson;
    //             });
    //             //console.log(es);
    //             tmpList.push(JSON.parse(es[0].EstateData));
    //         }
    //         leaves = EstateFormat.parseLeaf(leaves,tmpList);
    //     }
    //     this.showTreeGraph(treeNode,leaves);
    // }

    // preEvent = () => {
    //     let {estateList,eventList,historyEventList,date} = this.state;
    //     if(historyEventList.length === 0){
    //         alert("This is the first one.")
    //         return;
    //     }
    //     let localDate = date.toJSON().slice(0,10).split('-').join("");
    //     //ReactDOM.render(date.toJSON().slice(0,10), document.getElementById('mapdate'));
    //     let localEventList = [];
    //     let length = 0;
    //     for(let i = 0;i < historyEventList.length;i++){
    //         if(historyEventList[i].EstateEvent.changeDate !== localDate){
    //             localEventList = historyEventList.slice(0,i);
    //             historyEventList = historyEventList.slice(i);
    //             break;
    //         }
    //         if(i === historyEventList.length - 1){
    //             localEventList = historyEventList.slice();
    //             historyEventList = [];
    //             length += 1;
    //             break;
    //         }
    //         length += 1;
    //     }
    //     for(let i = 0;i < length;i++){
    //         let ev = localEventList.shift();
    //         estateList = PreFunctionTable[ev.EstateEvent.changeReason](ev,estateList);
    //         eventList.unshift(ev);
    //     }
    //     date.setDate(date.getDate() - 1);
    //     this.showGraph(estateList);
    //     this.generateTree(estateList);
    //     this.setState({estateList,eventList,historyEventList,date});
    // }

    // nextEvent = () => {
    //     let {estateList,eventList,historyEventList,date} = this.state;
    //     //console.log("next event")
    //     if(eventList.length === 0){
    //         alert("This is the last one.")
    //         //console.log("no more event");
    //         return;
    //     }
    //     date.setDate(date.getDate() + 1);
    //     let localDate = date.toJSON().slice(0,10).split('-').join("");
    //     let localEventList = [];
    //     let length = 0;
    //     for(let i = 0;i < eventList.length;i++){
    //         if(eventList[i].EstateEvent.changeDate !== localDate){
    //             localEventList = eventList.slice(0,i);
    //             eventList = eventList.slice(i);
    //             break;
    //         }
    //         if(i === eventList.length - 1){
    //             localEventList = eventList.slice();
    //             eventList = [];
    //             length += 1;
    //             break;
    //         }
    //         length += 1;
    //     }
    //     for(let i = 0;i < length;i++){
    //         let ev = localEventList.shift();
    //         estateList = NextFunctionTable[ev.EstateEvent.changeReason](ev,estateList);
    //         historyEventList.unshift(ev);
    //     }
    //     this.showGraph(estateList);
    //     this.generateTree(estateList);
    //     this.setState({estateList,eventList,historyEventList,date});
    // };

    componentDidMount = async () => {   
        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        
        let latestEstates = await fetch(backendServer + "/getlatestEstate").then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson;
        }).then();

        latestEstates = latestEstates[0]['estate_datas']
        latestEstates = JSON.parse(latestEstates)

        let polyList = [];
        Object.keys(latestEstates).forEach(function(estateId) {
            
            polyList.push({
                id: estateId,
                poly: EstateFormat.getPointArrFormat(latestEstates[estateId]['Points'])
            })
        })

        
        //畫圖//in cadastral資料夾
        createMap(600,800,this,polyList);
        this.setState({estates: latestEstates});
        console.log(latestEstates)
    };

    d3CLick = async (id) => {
        const {estates} = this.state;
        this.setState({
            estateInfo: estates[id]
        })
    }

    showEstateInfo = () => { //查看該地地籍資料
        const {estateInfo} = this.state;

        if (estateInfo == null){
            return (
                <div>
                    Click estate to get the detail information.
                </div>
            )
        } else {
            console.log(estateInfo)

            let date = estateInfo.Date;
            date = date.slice(0,4) + "-" + date.slice(4,6) + "-" + date.slice(6);

            return (
                <div>
                <div id="id">ID: {estateInfo.EstateID}</div>
                <div id="pmno">PMNO: {estateInfo.PMNO}</div>
                <div id="pcno">PCNO: {estateInfo.PCNO}</div>
                <div id="scno">SCNO: {estateInfo.SCNO}</div>
                <div id="Date">Date: {date}</div>
                <div id="County">County: {estateInfo.Country}</div>
                <div id="TownShip">TownShip: {estateInfo.TownShip}</div>
                <div id="reason">Reason: {estateInfo.Reason}</div>
                {/*<div id="from">From:<br /> */}
                {/* {    
                    data.parents.map((val,k) => {
                        return <p key={k}>ID: {val}</p>
                    })   
                }
                </div>
                <div id="to">To:<br />
                {
                    data.children.map((val,k) => {
                        return <p key={k}>ID: {val}</p>
                    })
                } 
                </div>
                */}
                </div>
            )
        }
    }

    // showList = () => {
    //     // const { date } = this.state;
    //     // if(date === null){
    //     //     return <h3>等待輸入日期</h3>
    //     // }

    //     return(
    //         <div id="versionResult">
    //         {/* <button type="button" onClick={this.preEvent}>上一個事件</button>
    //         <button type="button" onClick={this.nextEvent}>下一個事件</button> */}
    //         </div>
    //     );
    // };

    render(){
        return (
            <div id="version" style={{
                paddingTop: '20px',
                paddingLeft: '20px',
                paddingBottom: '300px',
                boxSizing: 'content-box',
              }}>
                <div id="treeLayOut">
                </div>
                <div style={{
                paddingBottom: '20px',
                boxSizing: 'content-box',
              }}>
                    <form>
                        <label>依據時間搜尋</label><br />
                        <input type="text" id="dataSearch" size="20"></input><br />
                        <button type="button" onClick={this.page}>查詢</button><br />
                    </form>
                    <div> 
                        <div id = "mapdate"></div>
                    </div>
                </div>      
                <div id="esSvg"></div>
                <div style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <button type="button" onClick={this.page}>Next Event</button><br />
                    <button type="button" onClick={this.page}>Pre Event</button><br />
                </div>
                <div>
                {
                    this.showEstateInfo()
                }
                </div>
                <div>
                {/* {
                    this.showList()
                }     */}
                </div>
                
            </div>
        )
    };

    
}


export default Version;

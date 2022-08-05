import React, { Component } from "react";
import { NextFunctionTable, PreFunctionTable} from "../components/EventFunctionTable.js";
import EstateFormat from '../components/EstateFormat.js';
import createMap from '../components/CadastralMap.js';
import createTree from '../components/TreeView.js';

import { Context } from "../Context";
import { json } from "d3";

class Version extends Component{
    static contextType = Context

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 800,
    
            searchDate:'',
            estates: [],
            polyList: [],
            estateInfo: null,
            latestEvent: 0,
            currentEvent: 0
        };
        this.handleResize = this.handleResize.bind(this);
    }

    searchEstate = async () => {
        if (this.state.searchDate.length !== 10) { // check if current event is the first one or not
            alert("invalid search date format");
            return;
        }

        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        
        let searchEstates = await fetch(backendServer + `/getNearestEstate?date=${this.state.searchDate}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson;
        }).then();

        let searchEventId = searchEstates[0]['latest_event']
        searchEstates = searchEstates[0]['estate_datas']
        searchEstates = JSON.parse(searchEstates)

        let polyList = [];
        Object.keys(searchEstates).forEach(function(estateId) {
            polyList.push({
                id: estateId,
                poly: EstateFormat.getPointArrFormat(searchEstates[estateId]['Points'])
            })
        })

        this.setState({
            currentEvent: searchEventId,
            estates: searchEstates,
            polyList: polyList
        });
        //畫圖 in cadastral資料夾
        createMap(600,this.state.windowWidth,this,polyList);

    }

    preEvent = async () => {
        if (this.state.currentEvent <= 1) { // check if current event is the first one or not
            alert("no previous event QQ.");
            return;
        }

        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        
        let preEvent = await fetch(backendServer + `/getPreviousEvent?event_id=${this.state.currentEvent}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson;
        }).then();

        let preEventId = preEvent[0]['event_id']
        preEvent = preEvent[0]['event_data']
        preEvent = JSON.parse(preEvent)
        console.log(preEventId)
        console.log(preEvent)

        switch (preEvent['event']) {
            case 'eventCreate':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    estate_id: preEvent['returnValues'][0][0],
                    points: preEvent['returnValues'][0][7]
                })
                break;
            case 'eventDelete':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    estate_id: preEvent['returnValues'][0],
                })
                break;
            case 'eventMerge':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    parent: preEvent['returnValues']['parentId'],
                    child: preEvent['returnValues']['childId']
                })
                break;
            case 'eventSplit':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    parent: preEvent['returnValues']['parentId'],
                    child: preEvent['returnValues']['childId']
                })
                break;
            default:
                console.log("something go wrong ...")
        }

        this.setState({
            currentEvent: preEventId
        })
        console.log(this.state.currentEvent)

        // latestEstates = latestEstates[0]['estate_datas']
        // latestEstates = JSON.parse(latestEstates)

        // let polyList = [];
        // Object.keys(latestEstates).forEach(function(estateId) {
            
        //     polyList.push({
        //         id: estateId,
        //         poly: EstateFormat.getPointArrFormat(latestEstates[estateId]['Points'])
        //     })
        // })

    }

    nextEvent = async () => {
        if (this.state.currentEvent >= this.state.latestEvent) { // check if current event is the first one or not
            alert("no Next event QQ.");
            return;
        }

        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        
        let preEvent = await fetch(backendServer + `/getNextEvent?event_id=${this.state.currentEvent}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson;
        }).then();

        let preEventId = preEvent[0]['event_id']
        preEvent = preEvent[0]['event_data']
        preEvent = JSON.parse(preEvent)
        console.log(preEventId)
        console.log(preEvent)

        switch (preEvent['event']) {
            case 'eventCreate':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    estate_id: preEvent['returnValues'][0][0],
                    points: preEvent['returnValues'][0][7]
                })
                break;
            case 'eventDelete':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    estate_id: preEvent['returnValues'][0],
                })
                break;
            case 'eventMerge':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    parent: preEvent['returnValues']['parentId'],
                    child: preEvent['returnValues']['childId']
                })
                break;
            case 'eventSplit':
                console.log({
                    event_type: preEvent['event'],
                    operation_id: preEvent['returnValues']['operationId'],
                    operation_type: preEvent['returnValues']['operationType'],
                    parent: preEvent['returnValues']['parentId'],
                    child: preEvent['returnValues']['childId']
                })
                break;
            default:
                console.log("something go wrong ...")
        }

        this.setState({
            currentEvent: preEventId
        })
        console.log(this.state.currentEvent)

        // let {estateList,eventList,historyEventList,date} = this.state;
        // //console.log("next event")
        // if(eventList.length === 0){
        //     alert("This is the last one.")
        //     //console.log("no more event");
        //     return;
        // }
        // date.setDate(date.getDate() + 1);
        // let localDate = date.toJSON().slice(0,10).split('-').join("");
        // let localEventList = [];
        // let length = 0;
        // for(let i = 0;i < eventList.length;i++){
        //     if(eventList[i].EstateEvent.changeDate !== localDate){
        //         localEventList = eventList.slice(0,i);
        //         eventList = eventList.slice(i);
        //         break;
        //     }
        //     if(i === eventList.length - 1){
        //         localEventList = eventList.slice();
        //         eventList = [];
        //         length += 1;
        //         break;
        //     }
        //     length += 1;
        // }
        // for(let i = 0;i < length;i++){
        //     let ev = localEventList.shift();
        //     estateList = NextFunctionTable[ev.EstateEvent.changeReason](ev,estateList);
        //     historyEventList.unshift(ev);
        // }
        // this.showGraph(estateList);
        // this.generateTree(estateList);
        // this.setState({estateList,eventList,historyEventList,date});
    };

    componentDidMount = async () => {   
        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        
        let latestEstates = await fetch(backendServer + "/getlatestEstate").then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson;
        }).then();

        let latestEventId = latestEstates[0]['latest_event']
        latestEstates = latestEstates[0]['estate_datas']
        latestEstates = JSON.parse(latestEstates)

        let polyList = [];
        Object.keys(latestEstates).forEach(function(estateId) {
            polyList.push({
                id: estateId,
                poly: EstateFormat.getPointArrFormat(latestEstates[estateId]['Points'])
            })
        })

        this.setState({
            windowWidth: window.innerWidth - 50,
            latestEvent: latestEventId,
            currentEvent: latestEventId,
            estates: latestEstates,
            polyList: polyList
        });
        console.log(latestEventId, latestEstates)
        //畫圖 in cadastral資料夾
        createMap(600,this.state.windowWidth,this,polyList);

        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.setState({ windowWidth: window.innerWidth - 50});
        //畫圖 in cadastral資料夾
        createMap(600,this.state.windowWidth,this,this.state.polyList);
    }

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

    render(){
        return (
            <div id="version" style={{
                paddingTop: '20px',
                paddingLeft: '20px',
                paddingRight: '20px',
                boxSizing: 'content-box',
              }}>
                <div id="treeLayOut">
                </div>
                <div style={{
                    display: 'flex',
                    paddingBottom: '20px',
                    width: '300px',
                    boxSizing: 'content-box',
                }}>
                    <input className="form-control mr-sm-2" type="search" placeholder="依據時間搜尋" aria-label="Search" onChange={(e) => {
                        let date = e.target.value;
                        date = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8)
                        this.setState({searchDate: date})
                    }}></input>
                    <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.searchEstate}>查詢</button>
                </div>      
                <div id="esSvg"></div>
                <div style={{
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <button type="button" className="btn btn-info" onClick={this.preEvent}>前一個事件</button>
                    <button type="button" className="btn btn-info" onClick={this.nextEvent}>下一個事件</button>
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

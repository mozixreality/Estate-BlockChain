import React, { Component } from "react";
import EstateFormat from '../components/EstateFormat.js';
import createMap from '../components/CadastralMap.js';

import { Context } from "../Context";

class Version extends Component{
    static contextType = Context

    constructor(props) {
        super(props);
        this.state = {    
            searchDate:'',
            estates: [],
            polyList: [],
            estateInfo: null,

            curEvent: null,
            nextEvent: null,
        };
    }

    searchEstate = async () => {
        if (this.state.searchDate.length !== 10) { // check search date format valid
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

        let curEvent = await fetch(backendServer + `/getEvent?event_id=${searchEventId}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson[0];
        }).then();

        let nextEvent = await fetch(backendServer + `/getEvent?event_id=${searchEventId + 1}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson[0];
        }).then();

        this.setState({
            curEvent: curEvent,
            nextEvent: nextEvent,
            estates: searchEstates,
            polyList: polyList
        });
        //畫圖 in cadastral資料夾
        createMap(600,700,this,polyList);

    }

    preEvent = async () => {
        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        const {curEvent, estates, polyList} = this.state
        if (curEvent == null) { // check if current event is the first one or not
            alert("no previous event QQ.");
            return;
        }

        let curEventId = curEvent['event_id']
        let curEventData = curEvent['event_data']
        curEventData = JSON.parse(curEventData)

        switch (curEventData['event']) {
            case 'eventCreate':
                let eventCreate = {
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    estate_id: curEventData['returnValues'][0][0],
                    points: curEventData['returnValues'][0][7]
                }
                delete estates[eventCreate.estate_id]
                for( var i = 0; i < polyList.length; i++){ 
                    if (polyList[i].id === eventCreate.estate_id) { 
                        polyList.splice(i, 1); 
                    }
                
                }
                createMap(600,700,this,polyList);
                break;
            case 'eventDelete':
                let eventDelete = {
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    estate_id: curEventData['returnValues'][0],
                }
                let estate_id = eventDelete.estate_id
                let estate = await fetch(backendServer + `/getOldEstate?estate_id=${estate_id}`).then((response) => {
                    return response.json();
                }).then((myjson) => {
                    return JSON.parse(myjson[0]['EstateData']);
                }).then();
                polyList.push({
                    id: estate_id,
                    poly: EstateFormat.getPointArrFormat(estate.polygon.points)
                })
                estates[estate_id] = EstateFormat.getEstateInfoFormat(estate)
                // //畫圖 in cadastral資料夾
                createMap(600,700,this,polyList);
                break;
            case 'eventMerge':
                console.log({
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    parent: curEventData['returnValues']['parentId'],
                    child: curEventData['returnValues']['childId']
                })
                break;
            case 'eventSplit':
                console.log({
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    parent: curEventData['returnValues']['parentId'],
                    child: curEventData['returnValues']['childId']
                })
                break;
            default:
                console.log("something go wrong ...")
        }

        let event = await fetch(backendServer + `/getEvent?event_id=${curEventId - 1}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson[0];
        }).then();
        this.setState({
            curEvent: event,
            nextEvent: curEvent
        })
    }

    nextEvent = async () => {
        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        const {nextEvent, estates, polyList} = this.state
        if (nextEvent == null) { // check if current event is the first one or not
            alert("no Next event QQ.");
            return;
        }

        let curEventId = nextEvent['event_id']
        let curEventData = nextEvent['event_data']
        curEventData = JSON.parse(curEventData)

        switch (curEventData['event']) {
            case 'eventCreate':
                let eventCreate = {
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    estate_id: curEventData['returnValues'][0][0],
                    points: curEventData['returnValues'][0][7]
                }
                polyList.push({
                    id: eventCreate.estate_id,
                    poly: EstateFormat.getPointArrFormat(eventCreate.points)
                })
                estates[eventCreate.estate_id] = EstateFormat.getEventEstateInfoFormat(curEventData['returnValues'])
                //畫圖 in cadastral資料夾
                createMap(600,700,this,polyList);
                break;
            case 'eventDelete':
                let eventDelete = {
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    estate_id: curEventData['returnValues'][0],
                }
                delete estates[eventDelete.estate_id]
                for( var i = 0; i < polyList.length; i++){ 
                    if (polyList[i].id === eventDelete.estate_id) { 
                        polyList.splice(i, 1); 
                    }
                
                }
                createMap(600,700,this,polyList);
                break;
            case 'eventMerge':
                console.log({
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    parent: curEventData['returnValues']['parentId'],
                    child: curEventData['returnValues']['childId']
                })
                break;
            case 'eventSplit':
                console.log({
                    event_type: curEventData['event'],
                    operation_id: curEventData['returnValues']['operationId'],
                    operation_type: curEventData['returnValues']['operationType'],
                    parent: curEventData['returnValues']['parentId'],
                    child: curEventData['returnValues']['childId']
                })
                break;
            default:
                console.log("something go wrong ...")
        }

        let event = await fetch(backendServer + `/getEvent?event_id=${curEventId + 1}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson[0];
        }).then();
        this.setState({
            curEvent: nextEvent,
            nextEvent: event
        })
    };

    componentDidMount = async () => {   
        const backendServer = this.context.BackendServer + ":" + this.context.BackendServerPort
        
        let latestEstates = await fetch(backendServer + "/getlatestEstate").then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson;
        }).then();

        console.log(latestEstates)
        if (latestEstates.length === 0) {
            return
        }

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

        let curEvent = await fetch(backendServer + `/getEvent?event_id=${latestEventId}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson[0];
        }).then();

        let nextEvent = await fetch(backendServer + `/getEvent?event_id=${latestEventId + 1}`).then((response) => {
            return response.json();
        }).then((myjson) => {
            return myjson[0];
        }).then();
    
        this.setState({
            estates: latestEstates,
            polyList: polyList,
            curEvent: curEvent,
            nextEvent: nextEvent,
        });
        //畫圖 in cadastral資料夾
        createMap(600,700,this,polyList);
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
                <div style={{
                    marginTop: '60px',
                }}>
                    <div className="alert alert-info" role="alert">
                        Click estate to get the detail information.
                    </div>
                    <div className="card">
                        <div className="card-body" style={{
                            minHeight: '200px',
                        }}>
                        </div>
                    </div>
                </div>
            )
        } else {
            let date = estateInfo.Date;
            date = date.slice(0,4) + "-" + date.slice(4,6) + "-" + date.slice(6);

            return (
                <div className="card" style={{
                    marginTop: '60px',
                }}>
                    <h5 className="card-header" id="id">ID: {estateInfo.EstateID}</h5>
                    <div className="card-body">
                        <div id="pmno">PMNO: {estateInfo.PMNO}</div>
                        <div id="pcno">PCNO: {estateInfo.PCNO}</div>
                        <div id="scno">SCNO: {estateInfo.SCNO}</div>
                        <div id="Date">Date: {date}</div>
                        <div id="County">County: {estateInfo.Country}</div>
                        <div id="TownShip">TownShip: {estateInfo.TownShip}</div>
                        <div id="reason">Reason: {estateInfo.Reason}</div>
                    </div>
                </div>
            )
        }
    }

    showEvent = (event) => {
        var eventId = null
        var eventData = null
        if (event != null) {
            eventId = event['event_id']
            console.log(eventId)
            eventData = event['event_data']
            eventData = JSON.parse(eventData)
            switch (eventData['event']) {
                case 'eventCreate':
                    return (
                        <ul className="list-group d-flex justify-content-between align-items-center" style={{flexDirection: 'column'}}>
                            <li className="list-group-item list-group-item-action list-group-item-success">Event Create</li>
                            <li className="list-group-item list-group-item-action">Operation ID: {eventData['returnValues']['operationId']}</li>
                            <li className="list-group-item list-group-item-action">Operation Type: {eventData['returnValues']['operationType']}</li>
                            <li className="list-group-item list-group-item-action">Estate ID: {eventData['returnValues'][0][0]}</li>
                        </ul>
                    )
                case 'eventDelete':
                    return (
                        <ul className="list-group d-flex justify-content-between align-items-center" style={{flexDirection: 'column'}}>
                            <li className="list-group-item list-group-item-action list-group-item-danger">Event Delete</li>
                            <li className="list-group-item list-group-item-action">Operation ID: {eventData['returnValues']['operationId']}</li>
                            <li className="list-group-item list-group-item-action">Operation Type: {eventData['returnValues']['operationType']}</li>
                            <li className="list-group-item list-group-item-action">Estate ID: {eventData['returnValues'][0]}</li>
                        </ul>
                    )
                case 'eventMerge':
                    let parents = eventData['returnValues']['parentId']
                    let parentsStr = ""
                    for(let i=0;i<parents.length;i++) {
                        parentsStr += parents[i] + ", "
                    }
                    return (
                        <ul className="list-group d-flex justify-content-between align-items-center" style={{flexDirection: 'column'}}>
                            <li className="list-group-item list-group-item-action list-group-item-primary">Event Merge</li>
                            <li className="list-group-item list-group-item-action">Operation ID: {eventData['returnValues']['operationId']}</li>
                            <li className="list-group-item list-group-item-action">Operation Type: {eventData['returnValues']['operationType']}</li>
                            <li className="list-group-item list-group-item-action">Parent ID: {parentsStr}</li>
                            <li className="list-group-item list-group-item-action">Child ID: {eventData['returnValues']['childId']}</li>
                        </ul>
                    )
                case 'eventSplit':
                    let childs = eventData['returnValues']['childId']
                    let childsStr = ""
                    for(let i=0;i<childs.length;i++) {
                        childsStr += childs[i] + ", "
                    }
                    return (
                        <ul className="list-group d-flex justify-content-between align-items-center" style={{flexDirection: 'column'}}>
                            <li className="list-group-item list-group-item-action list-group-item-warning">Event Split</li>
                            <li className="list-group-item list-group-item-action">Operation ID: {eventData['returnValues']['operationId']}</li>
                            <li className="list-group-item list-group-item-action">Operation Type: {eventData['returnValues']['operationType']}</li>
                            <li className="list-group-item list-group-item-action">Parent ID: {eventData['returnValues']['parentId']}</li>
                            <li className="list-group-item list-group-item-action">Child ID: {childsStr}</li>
                        </ul>
                    )
                default:
                    return (
                        <ul className="list-group d-flex justify-content-between align-items-center">
                            <li className="list-group-item list-group-item-action list-group-item-dark">something is going wrong ...</li>
                        </ul>
                    )
            }
        } else {
            return (
                <ul className="list-group d-flex justify-content-between align-items-center">
                    <li className="list-group-item list-group-item-action list-group-item-dark">No more event</li>
                </ul>
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
                <div style={{
                    paddingBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>
                    <div>
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
                    </div>
                    <div>
                        { this.showEstateInfo() }
                        <div style={{
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <button type="button" className="btn btn-info" onClick={this.preEvent}>前一個事件</button>
                            <button type="button" className="btn btn-info" onClick={this.nextEvent}>下一個事件</button>
                        </div>
                        <div style={{
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            minWidth: 600,
                            minHeight: 300,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <ul className="list-group" style={{minWidth: '200px', maxWidth: 300}}>
                                { this.showEvent(this.state.curEvent) }
                            </ul>
                            <ul className="list-group" style={{minWidth: '200px', maxWidth: 300}}>
                                { this.showEvent(this.state.nextEvent) }
                            </ul>
                        </div>
                    </div>
                </div>                 
            </div>
        )
    };

    
}


export default Version;

import React, { Component } from "react";
import {BrowserRouter as Router, Switch, Route, useParams} from "react-router-dom";
import EstateFormat from './EstateFormat.js';
import createMap from './CadastralMap.js';


class NowEstateList extends Component {

    constructor(props){
        super(props);

        this.state = { nowEstateList:[],path:null,searchItem:null,width:800,height:600};
    }

        componentDidMount = async () => {          
            let nowList = await fetch("http://localhost:4001/getNowEstate").then((response) => {
                return response.json();
            }).then((myjson) => {
                return myjson;
            });
            for(let i = 0;i < nowList.length;i++){
                nowList[i] = JSON.parse(nowList[i].EstateData);
            }
            let polyList = [];
            nowList.map((val,k) => {
                polyList.push({poly:EstateFormat.getPointFormat(val.polygon),id:val.id});
            })
            //console.log(polyList);
            //畫圖//in cadastral資料夾
            createMap(600,800,this,polyList);
            //App();
            this.setState({nowEstateList: nowList});
        };

    d3CLick = async (id) => {
        const {nowEstateList} = this.state;
        let item = nowEstateList.find((ele) => ele.id === id);
        this.setState({searchItem:item});
    }

    createWin = () => {
        if(this.state.searchItem === null){
            return <div><p>點擊地圖獲得地籍資訊</p></div>
        }
        const {searchItem} = this.state;
        let data = searchItem.data;
        let date = data.begDate;
        date = date.slice(0,4) + "-" + date.slice(4,6) + "-" + date.slice(6);
        return (
            <div>
            <div id="id">ID: {searchItem.id}</div>
            <div id="pmno">PMNO: {data.pmno}</div>
            <div id="pcno">PCNO: {data.pcno}</div>
            <div id="scno">SCNO: {data.scno}</div>
            <div id="Date">Date: {date}</div>
            <div id="County">County: {data.county}</div>
            <div id="TownShip">TownShip: {data.townShip}</div>
            <div id="reason">Reason: {data.reason}</div>
            <div id="from">From:<br />
            {    
                    data.parents.map((val,k) => {
                        return <p key={k}>ID: {val}</p>
                    })   
            }
            </div>
            </div>
        )
    }


        render(){
            return(
                //<Router></Router>
                <div style={{
                    paddingLeft: '20px',
                    paddingBottom: '20px',
                    boxSizing: 'content-box',
                  }}> 
                    <div>
                        <h3>Map</h3>
                        <p>How to use?</p>
                        <ul>
                            <li><p>右上滑縮小 左下滑放大</p></li>
                            <li><p>拖曳游標看完整地圖</p></li>
                        </ul>
                    </div>
                    <div id="nowEstateList">  
                    </div>
                    <div id="esSvg">
                    </div>
                    <div >
                        {
                            this.createWin()//印出地籍資訊
                        }
                    </div>
                    {/* <Switch>
                        <Route exact path="/nowEstateList"><h3>Test</h3></Route>
                    </Switch> */}
                </div>
            );
        };

}
                        //<Route exact path="/nowEstateList/:id" children={<Info list={this.state.nowEstateList}/>} />
/*
                    {
                        this.state.nowEstateList.map((obj,key) => {
                            return <li key={key}><Link to={"/nowEstateList/"+ key}>{obj.EstateId}</Link></li>
                        })
                    }
*/

function Info(props){
    let {id} = useParams();
    let obj = props.list[id];
    let data;
    //let data = JSON.parse(obj.EstateData);
    console.log(data);
    /*return (
        <div id="dataInfo">
            ID: {obj.EstateId}<br />
            建立日期: {obj.CreateDate}<br />
            County: {data.county} <br />
            TownShip: {data.townShip}<br />
            PMNO: {data.pmno}<br />
            PCNO: {data.pcno}<br />
            SCNO: {data.scno}<br />
        </div>
    )*/
    return (
        <h3>幹</h3>
    )
}

export default NowEstateList;

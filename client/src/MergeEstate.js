import React, { Component } from "react";
import EstateFormat from "./EstateFormat";

class MergeEstate extends Component{
    state = {web3:null, accounts:null,contract:null,id:[],list:[]};
    constructor(props){
        super(props);
    };

    componentDidMount = async () => {
        this.setState({web3:this.props.web3, accounts:this.props.accounts, contract: this.props.contract});
    }

    merge = async () => {
        console.log("merge!");
        const {web3,accounts,contract,id,list } = this.state;
        let form = document.getElementById("mergeForm")
        let mergedIdList = [];
        form[0].value.split(",").map((val,k) => {
            mergedIdList.push(val);
        })
        console.log(mergedIdList);
        let formatData = EstateFormat.getMergeForm(form,mergedIdList);
        let fromList = [];
        let oldDataList = [];
        let date = formatData.DFormat.json.data.endDate;
        for(let i = 0;i < mergedIdList.length;i++){
            let data = await fetch(`http://localhost:4001/getOne?id=${mergedIdList[i]}`).then((response) => {
                return response.json();
            }).then((myjson) => {
                return myjson;
            });
            data = data[0].EstateData;
            let data1 = JSON.parse(data);
            data1.data.endDate = date;
            data1.data.children = [formatData.DFormat.id];
            fromList.push(data1);
            oldDataList.push(JSON.stringify(data1));
            await contract.methods.delete2(data1.id,data1.data.begDate,data1.data.endDate,JSON.stringify(data1)).send({from:accounts[0]});
        }

        let eventData = EstateFormat.getEventFormat(fromList,[formatData.DFormat.json],2,date);          
        eventData = JSON.stringify(eventData);
        console.log(mergedIdList);
        await contract.methods.merge(mergedIdList,formatData.DFormat.id,formatData.DFormat.blockChain,formatData.PFormat.blockChain,mergedIdList.length,2,eventData).send({from:accounts[0]});

    }

    render () {
        if(!this.state.web3){
            return <h3>loading...</h3>
        }
        return (
            <div id="mergeEstate" style={{
                paddingTop: '20px',
                paddingLeft: '20px',
                paddingBottom: '20px',
                boxSizing: 'content-box',
              }}>
                <div id="mergeId">
                    <form id="mergeForm">
                        <label>被合併土地ID</label><br />
                        <input type="text" size="40" placeholder="esid1,esid2..."></input><br />
                        <hr />
                        <label>合併新土地資料</label><br /> 
                        <label>PMNO</label><br />
                        <input type="text" placeholder="4位數字" size="10"></input><br />
                        <label>PCNO</label><br />
                        <input type="text" placeholder="4位數字" size="10"></input><br />
                        <label>SCNO</label><br />
                        <input type="text" placeholder="4位數字" size="10"></input><br />
                        <label>County</label><br />
                        <input type="text" placeholder="taipei" size="10"></input><br />
                        <label>Township</label><br />
                        <input type="text" placeholder="2位數字" size="10"></input><br />
                        <label>記錄日期</label><br />
                        <input type="text" placeholder="20200217" size="10"></input><br />
                        <label>PointList</label><br />
                        <input type="text" placeholder="[x1,y1],[x2,y2]..." size="40"></input><br />
                        <button type="button" onClick={this.merge}>送出</button>
                    </form>
                </div>
            </div>
        )
    }

}

export default MergeEstate;


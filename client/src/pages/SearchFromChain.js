import React, { Component } from "react";
class SearchFromChain extends Component{
    state = {web3:null, accounts: null, contract:null, estate:null};

    componentDidMount = async () => {
        this.setState({web3:this.props.web3, accounts:this.props.accounts, contract: this.props.contract});
    };

    page = async () => {
        console.log("查詢成功！");
        const {contract} = this.state;
        let id = document.getElementById("searchId").value;
        let ret = await contract.methods.getEstateData(id).call();
        this.setState({estate:ret});
    };

    show = () => {
        const {estate} = this.state;
        console.log(estate);
        if(estate == null){
            return <div>null</div>
        }
        let data = estate[0];
        console.log(data);
        return (
            <div id="show">
                PMNO: {data.pmno}<br />
                PCNO: {data.pcno}<br />
                SCNO: {data.scno}<br />
                County: {data.county}<br />
                TownShip: {data.townShip}<br />
                BegingDate: {data.begDate.slice(0,4) + "-" + data.begDate.slice(4,6) + "-" + data.begDate.slice(6,8)}<br />
                EndDate: {data.endDate.slice(0,4) + "-" + data.endDate.slice(4,6) + "-" + data.endDate.slice(6,8)}<br />
                Reason: {data.reason}<br />
            </div>
        )
    };

    render(){
        if(!this.state.web3){
            return <h1> no!</h1>
        }
        return(
            <div id="search" style={{
                paddingTop: '20px',
                paddingLeft: '20px',
                paddingBottom: '20px',
                boxSizing: 'content-box',
              }}>
                <form>
                    <label>搜尋的土地ID</label><br />
                    <input type="text" id="searchId" size="30"></input><br />
                    <button type="button" onClick={this.page}>查詢</button>
                </form>
                {
                    this.show()
                }
            </div>
        );
    };
}

export default SearchFromChain

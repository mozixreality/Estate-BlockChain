// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;

import "./DataStruct.sol";
import "./EsToken.sol";


contract CadastralContract{
    mapping(string => EsToken) nowEstateList;
    uint esCount;
    uint totalCount;
    uint flag;
    string [] temp;
    uint tes;

    constructor() public{
        esCount = 0;
        totalCount = 0;
        flag = 0;
    }

    event eventSplit(
        string [] parentId,
        string [] childId,
        string changeDate
    );

    event eventCreate(
        string Id,
        string createDate,
        string endDate,
        string county,
        uint townShip,
        uint reason,
        uint changedTag,
        Point [100] pList,
        uint numOfPoint,
        uint functional,
        string eventdata,
        string [] other
    );

    event eventMerge(
        string childId,
        string [] parentId,
        string changeDate
    );

    event eventDelete(
        string Id,
        string begDate,
        string endDate,
        string data
    );

    // function create(string memory id,Data memory data,Polygon memory poly,string [] memory pa) public  payable{
    function create(
        string memory id,
        Data memory data,
        Polygon memory poly,
        string [] memory pa,
        uint functional,
        string memory eventdata,
        string [] memory other
    ) 
        public  
        payable
    {
        EsToken estate = new EsToken(id,data,poly,pa);
        nowEstateList[id] = estate;
        esCount += 1;
        totalCount += 1;
        if(flag == 0){
            emit eventCreate(id,data.begDate,data.endDate,data.county,data.townShip,data.reason,data.changeTag,poly.pList,poly.numOfPoint,functional,eventdata,other);
        }
    }


    function deleteEst(
        string memory Id,
        string memory begDate,
        string memory endDate,
        string memory data
    ) 
        public
        payable
    {
        esCount -=1;
        emit eventDelete(Id,begDate,endDate,data);
    }


    function split(
        string [] memory sId,
        string [] memory newIdList,
        Data [] memory newDataList,
        Polygon [] memory polygonList,
        uint numOfnewEstate,
        uint functional,
        string memory eventdata
    )
        public
        payable
    {
        EsToken estate = nowEstateList[sId[0]];
        estate.setEndDate(newDataList[0].begDate);
        estate.setChildren(newIdList);

        for(uint i = 0;i < numOfnewEstate;i++){
            create(newIdList[i],newDataList[i],polygonList[i],temp,functional,eventdata,sId);
        }

        emit eventSplit(sId,newIdList,newDataList[0].begDate);
    }

    function merge(
        string [] memory mIdList,
        string memory newId,
        Data memory data,
        Polygon memory polygon,
        uint numOfMergeEstate,
        uint functional,
        string memory eventdata
    ) 
        public
        payable
    {
        EsToken estate;
        tes = numOfMergeEstate;
        for(uint i = 0;i < numOfMergeEstate;i++){
            estate = nowEstateList[mIdList[i]];
            estate.setEndDate(data.begDate);
            estate.setChildren(temp);
        }
        create(newId,data,polygon,mIdList,functional,eventdata,mIdList);
        emit eventMerge(newId,mIdList,data.begDate);
    }

    // function getEstateAddress(string memory id) public view returns(address){
    //     string memory tmp = "";
    //     if(keccak256(abi.encodePacked(changeIdList[id])) != keccak256(abi.encodePacked(tmp))){
    //         return address(nowEstateList[changeIdList[id]]);
    //     }
    //     else{
    //         return address(nowEstateList[id]);
    //     }
    // }
    function getEstateData(string memory Id)
        public 
        view 
        returns(
            Data memory,
            Polygon memory,
            string [] memory,
            string [] memory
        )
    {
        EsToken estate = nowEstateList[Id];
        Data memory data = estate.getData();
        Polygon memory poly = estate.getPolygon();
        string [] memory pa = estate.getParents();
        string [] memory chi = estate.getChildren();
        return (
            data,
            poly,
            pa,
            chi
        );
    }    
}
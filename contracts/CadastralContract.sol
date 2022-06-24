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

    constructor() {
        esCount = 0;
        totalCount = 0;
        flag = 0;
    }

    event eventSplit(
        string [] parentId,
        string [] childId,
        string changeDate,
        uint operationId,
        uint operationType
    );

    event eventCreate(
        EventCreateParam param,
        uint operationId,
        uint operationType
    );

    event eventMerge(
        string childId,
        string [] parentId,
        string changeDate,
        uint operationId,
        uint operationType
    );

    event eventDelete(
        string Id,
        string begDate,
        string endDate,
        string data,
        uint operationId,
        uint operationType
    );

    function create(
        FunctionCreateParam memory param,
        uint operationId,
        uint operationType
    ) 
        public  
        payable
    {
        EsToken estate = new EsToken(param.id, param.data, param.poly, param.pa);
        nowEstateList[param.id] = estate;
        esCount += 1;
        totalCount += 1;
        if(flag == 0){
            emit eventCreate(
                EventCreateParam(
                    param.id,
                    param.data.begDate,
                    param.data.endDate,
                    param.data.county,
                    param.data.townShip,
                    param.data.reason,
                    param.data.changeTag,
                    param.poly.pList,
                    param.poly.numOfPoint,
                    param.functional,
                    param.eventdata,
                    param.other
                ),
                operationId,
                operationType
            );
        }
    }


    function deleteEst(
        string memory id,
        string memory begDate,
        string memory endDate,
        string memory data,
        uint operationId,
        uint operationType
    ) 
        public
        payable
    {
        esCount -=1;
        emit eventDelete(
            id, 
            begDate, 
            endDate,
            data, 
            operationId,
            operationType
        );
    }


    function split(
        string [] memory sId,
        string [] memory newIdList,
        Data [] memory newDataList,
        Polygon [] memory polygonList,
        uint numOfnewEstate,
        uint functional,
        string memory eventdata,
        uint operationId,
        uint operationType
    )
        public
        payable
    {
        EsToken estate = nowEstateList[sId[0]];
        estate.setEndDate(newDataList[0].begDate);
        estate.setChildren(newIdList);

        for(uint i = 0;i < numOfnewEstate;i++){
            create(
                FunctionCreateParam(
                    newIdList[i], 
                    newDataList[i], 
                    polygonList[i], 
                    temp, 
                    functional, 
                    eventdata, 
                    sId
                ),
                operationId,
                operationType
            );
        }

        emit eventSplit(
            sId,
            newIdList,
            newDataList[0].begDate,
            operationId,
            operationType    
        );
    }

    function merge(
        string [] memory mIdList,
        string memory newId,
        Data memory data,
        Polygon memory polygon,
        uint numOfMergeEstate,
        uint functional,
        string memory eventdata,
        uint operationId,
        uint operationType
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
        create(
            FunctionCreateParam(
                newId, 
                data, 
                polygon, 
                mIdList, 
                functional, 
                eventdata, 
                mIdList
            ),
            operationId,
            operationType
        );
        emit eventMerge(
            newId,
            mIdList,
            data.begDate,
            operationId,
            operationType    
        );
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
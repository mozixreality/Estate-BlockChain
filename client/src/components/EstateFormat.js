var EstateFormat = {
    dataFormat : function (id,pmno,pcno,scno,county,reason,begDate,endDate,parents,children,townShip,changeTag,polygon) {
        return {id,json:{id,data:{pmno,pcno,scno,county,townShip,reason,begDate,endDate,parents,children,changeTag},polygon},blockChain: [pcno,pmno,scno,county,townShip,begDate,endDate,reason,changeTag]};
    },
    
    polygonFormat : function (pointInput) {
        let rawPointList = JSON.parse('[' + pointInput + ']');
        for(var i=0 ;i < rawPointList.length;i++){
            if(rawPointList[i][0] >10000){
                rawPointList[i][0] = rawPointList[i][0]-270000;
                rawPointList[i][1] = (-1)*(rawPointList[i][1]-2774624);
            }
        }
        let pointList = new Array(100);
        pointList.fill(["n","n"]);
        rawPointList.forEach((ele, key) => {
            let ary = new Array(2);
            ele.map((val,i) => (
                ary[i] = val.toString()
            ));
            pointList[key] = ary;
        });
        //console.log(pointList)
        return {json:{points:pointList,length:rawPointList.length},blockChain:[pointList,rawPointList.length]};
    },

    getCreatForm : function (form) {
        let pmno = form[0].value, pcno = form[1].value, scno = form[2].value, county = form[3].value, townShip = form[4].value, begDate = form[5].value, pointList = form[6].value;
        let PFormat = this.polygonFormat(pointList);
        let DFormat = this.dataFormat(pmno + pcno + scno + begDate,pmno,pcno,scno,county,0,begDate,begDate,[],[],townShip,0,PFormat.json);
        return {PFormat,DFormat};
    },
    //dataFormat : function (id,pmno,pcno,scno,county,reason,begDate,endDate,parents,children,townShip,changeTag,polygon) {

    getSplitForm : function (formInd,formCom,parents) {
        let pmno = formInd[0].value, pcno = formInd[1].value, scno = formInd[2].value, county = formCom[0].value, townShip = formCom[1].value, begDate = formCom[2].value, pointList = formInd[3].value;
        let PFormat = this.polygonFormat(pointList);
        let DFormat = this.dataFormat(pmno + pcno + scno + begDate,pmno,pcno,scno,county,1,begDate,begDate,parents,[],townShip,0,PFormat.json);
       return {PFormat,DFormat};
    },

    getMergeForm : function (form,parents) {
        let pmno = form[1].value, pcno = form[2].value, scno = form[3].value, county = form[4].value, townShip = form[5].value, begDate = form[6].value, pointList = form[7].value;
        let PFormat = this.polygonFormat(pointList);
        let DFormat = this.dataFormat(pmno + pcno + scno + begDate,pmno,pcno,scno,county,2,begDate,begDate,parents,[],townShip,0,PFormat.json);
        return {PFormat,DFormat};
    },

    getEventFormat : function (fromList,becomList,changeReason,changeDate) {
        return {from:fromList,to:becomList,changeReason,changeDate};
    },

    getPointFormat : function (obj) {
        let poly = [];
        //console.log(obj.points[0]);
        for(let i = 0;i < obj.length;i++){
            poly.push({"x":parseInt(obj.points[i][0]),"y":parseInt(obj.points[i][1])});
        }
        return poly;
    },

    getPointArrFormat : function (pointsArr) {
        let poly = [];
        for(let i = 0;i < pointsArr.length;i++){
            if(isNaN(parseInt(pointsArr[i][0])))
                break
            poly.push({"x":parseInt(pointsArr[i][0]),"y":parseInt(pointsArr[i][1])});
        }
        return poly;
    },

    treeNodeFormat: function(parents,node){
        //parents is object(has built to tree)
        //node is new tree node who would be insert into the tree
        let treeNode = {name:node.id,parents:node.data.parents,children:[]};
        parents.forEach((ele) => {
            ele.children.push(treeNode);
        });
        return treeNode;
    },

    parseLeaf: function(leaves,children){
        let newLeaves = leaves.slice();
        let tmpList = [];
        children.forEach((ele) => {
            let tmpParent = [];
            for(let i = 0;i < ele.data.parents.length;i++){
                let val = ele.data.parents[i];
                let p = leaves.find(ele => ele.name === val);
                if(p){
                    tmpParent.push(p);
                }
                newLeaves = newLeaves.filter( ele => ele.name !== val );
            }
            let node = this.treeNodeFormat(tmpParent,ele);
            tmpList.push(node);
        })
        newLeaves = newLeaves.concat(tmpList);
        return newLeaves;
        //leaves = leaves.filter((ele) => ele.name != children[0].data.parents[0]);
    }
}


export default EstateFormat;

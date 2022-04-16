var NextFunctionTable = {};
var PreFunctionTable = {};


NextFunctionTable[0] = function(ev,estateList) {
    //console.log("create event!");
    estateList = estateList.concat(ev.EstateEvent.to);
    return estateList;
}

NextFunctionTable[1] = function (ev,estateList) {
    //console.log("split event!");
    estateList = estateList.filter((obj) => {
        return obj.id !== ev.EstateEvent.from[0].id;
    }).concat(ev.EstateEvent.to);
    //console.log(estateList);
    return estateList;
}

NextFunctionTable[2] = function (ev,estateList) {
    //console.log("merge event!");
    ev.EstateEvent.from.forEach((val,i) => {
        estateList = estateList.filter((obj) => {
            return val.id !== obj.id;
        })
    })
    estateList = estateList.concat(ev.EstateEvent.to);
    return estateList;
}

PreFunctionTable[0] = function (ev,estateList) {
    estateList = estateList.filter((obj) => {
        return obj.id !== ev.EstateEvent.to[0].id;
    })
    return estateList;
}

PreFunctionTable[1] = function (ev,estateList) {
    ev.EstateEvent.to.forEach((val,i) => {
        estateList = estateList.filter((obj) => {
            return val.id !== obj.id;
        })
    });
    console.log(ev.EstateEvent.from,"f2");
    estateList = estateList.concat(ev.EstateEvent.from);
    return estateList;
}

PreFunctionTable[2] = function (ev,estateList) {
    estateList = estateList.filter((obj) => {
        return obj.id !== ev.EstateEvent.to[0].id;
    }).concat(ev.EstateEvent.from);
    return estateList;
}

export { NextFunctionTable, PreFunctionTable};

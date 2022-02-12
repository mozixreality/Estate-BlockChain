var buffer;

function pushBuffer(newData){
    buffer = newData;
    console.log(buffer);
}

function getBuffer(){
    console.log(buffer,"circle");
    return buffer;
}

module.exports = { pushBuffer, getBuffer, buffer };

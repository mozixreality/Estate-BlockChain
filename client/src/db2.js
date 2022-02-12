const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();

var buffer = "";

const SELECT_QUERY = "SELECT * FROM city";

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hwl0319chu',
    database: 'blockchaindata'
});

con.connect(function(err){
    if(err) throw err;
    console.log("Connected!");
});

app.use(cors());

app.get('/',(req,res) => {
    res.send('go to test')
});

app.get('/event',(req,res) => {
    const {estateId,changeDate,changeReason,ev} = req.query;
    let date = changeDate.slice(0,4) + "-" + changeDate.slice(4,6) + "-" + changeDate.slice(6,8);
    const INSERT_EVENT_QUERY = `INSERT INTO eventtable (EstateId,ChangeDate,ChangeReason,EstateEvent) VALUES ('${estateId}','${date}',${changeReason},'${ev}')`;
    con.query(INSERT_EVENT_QUERY, (err,results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send("event success!");
        }
    })
})

app.get('/old',(req,res) => {
    const {id,begDate,endDate,data} = req.query;
    let obj = JSON.parse(data);

    let begD = begDate.slice(0,4) + "-" + begDate.slice(4,6) + "-" + begDate.slice(6,8);
    let endD = endDate.slice(0,4) + "-" + endDate.slice(4,6) + "-" + endDate.slice(6,8);

    const INSERT_OLD_QUERY = `INSERT INTO olddatatable (EstateId,BeginDate,EndDate,PCNO,PMNO,SCNO,County,TownShip,Reason,ChangeTag,EstateData) VALUES ('${id}','${begD}','${endD}',${obj.data.pcno},${obj.data.pmno},${obj.data.scno},'${obj.data.county}','${obj.data.townShip}',${obj.data.reason},${obj.data.changeTag},'${data}')`;
    con.query(INSERT_OLD_QUERY, (err,results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send("insert old!");
        }
    });
})

app.get('/create',(req,res) => {
    let {data} = req.query ;
    let dataP = JSON.parse(data);
    let obj = dataP.data;
    let date = obj.begDate;
    date = date.slice(0,4) + '-' + date.slice(4,6) + '-' + date.slice(6,8);
    const INSERT_DATA_QUERY = `INSERT INTO nowestatetable (EstateId,CreateDate,PCNO,PMNO,SCNO,TownShip,County,Reason,ChangeTag,EstateData) VALUES ('${dataP.id}','${date}',${obj.pcno},${obj.pmno},${obj.scno},'${obj.townShip}','${obj.county}',${obj.reason},${obj.changeTag},'${data}')`;
    con.query(INSERT_DATA_QUERY, (err,results) => {
        if(err){
            return res.send(err);
        }
        else{
            return res.send("ya");
        }
    });
})

app.get('/delete',(req,res) => {
    const {deleteId} = req.query;
    console.log({deleteId});
    const DELETE_QUERY = `DELETE FROM nowestatetable WHERE EstateId='${deleteId}'`;
    con.query(DELETE_QUERY, (err,results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send("delete success!");
        }
    });
})

app.get('/getOne',(req,res) => {
    const {id} = req.query;
    const SELECT_QUERY = `SELECT EstateData FROM nowestatetable WHERE EstateId='${id}'`;
    con.query(SELECT_QUERY,(err,results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send(results);
        }
    });
})

app.get('/getNowEstate',(req,res) => {
    const SELECT_NOW_QUERY = "SELECT EstateData FROM nowestatetable";
    con.query(SELECT_NOW_QUERY, (err, results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send(results);
        }
    })
})

app.get('/getOldEstate',(req,res) => {
    const SELECT_NOW_QUERY = "SELECT EstateData FROM olddatatable";
    con.query(SELECT_NOW_QUERY, (err, results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send(results);
        }
    })
})

app.get('/searchFromNow', (req,res) => {
    const { date } = req.query;
    const SEARCH_QUERY = `SELECT EstateData FROM nowestatetable WHERE CreateDate <= '${date}'`;
    con.query(SEARCH_QUERY, (err, results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send(results);
        }
    })
})

app.get('/searchFromOld', (req,res) => {
    const { date } = req.query;
    const SEARCH_QUERY = `SELECT EstateData FROM olddatatable WHERE BeginDate <= '${date}' and EndDate > '${date}'`;
    con.query(SEARCH_QUERY, (err, results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send(results);
        }
    })
})

app.get('/searchUniverse', (req,res) => {
    const { id } = req.query;
    const SEARCHFROMOLD = `SELECT EstateData FROM olddatatable WHERE EstateId='${id}'`;
    const SEARCHFROMNOW = `SELECT EstateData FROM nowestatetable WHERE EstateId='${id}'`;
    con.query(SEARCHFROMOLD, (err,results) => {
        if(err){
            return res.send(err);
        }
        else{
            if(results.length === 0){
                con.query(SEARCHFROMNOW,(err,results) => {
                    if(err){
                        return res.send(err);
                    }
                    else{
                        return res.send(results);
                    }
                })
            }
            else{
                return res.send(results);
            }
        }
    })
})

app.get('/searchFromEvent', (req,res) => {
    const { date } = req.query;
    const SEARCH_QUERY = `SELECT EstateId, EstateId, EstateEvent FROM eventtable WHERE ChangeDate > '${date}'`;
    con.query(SEARCH_QUERY, (err, results) => {
        if(err){
            return console.log(err);
        }
        else{
            return res.send(results);
        }
    })
})

app.listen(4001,() => {
    console.log("listen 4001!");
});

module.exports = {buffer};

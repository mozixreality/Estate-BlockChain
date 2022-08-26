import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const multer  = require('multer');
const fetch = require('node-fetch');
const app = express();
const upload = multer({ dest: '../uploads/' })
// import sendKafkaMsg from "../kafka/producer.js";
require('dotenv').config({path: "../../.env"})

const CadastralContract  = require('../contracts/CadastralContract.json')
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'))

const BackendServerPort = process.env.REACT_APP_BACKEND_SERVER_PORT
const MySQLHost = process.env.MYSQL_HOST
const MySQLPort = process.env.MYSQL_PORT
const MySQLUser = process.env.MYSQL_USER
const MySQLPassword = process.env.MYSQL_PASSWORD
const MySQLDatabase = process.env.MYSQL_DATABASE

const con = mysql.createConnection({
  host: MySQLHost,
  port: MySQLPort,
  user: MySQLUser,
  password: MySQLPassword,
  database: MySQLDatabase,
});

con.connect(function(err){
  if(err) throw err;
  console.log("Connected!");
});

app.use(cors());


async function asyncCall() {
  const accounts = await web3.eth.getAccounts();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = CadastralContract.networks[networkId];
  const myContract = new web3.eth.Contract(
    CadastralContract.abi,
    deployedNetwork && deployedNetwork.address,
  )

  myContract.events.allEvents()
  .on('data', async(event) => {
    switch(event.event) {
      case "eventCreate":
        create(event);
        addEvent(event);
        break;
      case "eventDelete":
        old(event);
        deleteFromDB(event);
        addEvent(event);
        break;
      case "eventMerge":
        merge(event);
        addEvent(event);
        break;
      case "eventSplit":
        split(event);
        addEvent(event);
        break;
      default:
        console.log("something go error ...");
    }
  })
  .on('error', console.error);
}

async function addEvent(event) {
  let eventType = new Map([
    ["eventCreate", 0],
    ["eventDelete", 1],
    ["eventMerge", 2],
    ["eventSplit", 3]
  ]);

  const QUERY = `
    INSERT INTO event_list (
      event_type,
      operation_id,
      operation_type,
      event_data
    ) VALUES (
      '${eventType.get(event.event)}',
      ${event.returnValues.operationId},
      '${event.returnValues.operationType}',
      '${JSON.stringify(event)}'
    );
  `

  con.query(QUERY, function(err,res) {
    if (err) throw err;
    console.log("insert into event list sucess");
  })
}

async function create(blockdata) {
  let event = blockdata;
  let date = event.returnValues.param.createDate;
  date = date.slice(0,4) + '-' + date.slice(4,6) + '-' + date.slice(6,8);
  let pmno = (event.returnValues.param.Id).slice(0,4);
  let pcno = (event.returnValues.param.Id).slice(4,8);
  let scno = (event.returnValues.param.Id).slice(8,12);
  var parents = [];
  var childs = [];
  if(event.returnValues.param.functional==2){
    parents = event.returnValues.param.other;
  }
  if(event.returnValues.param.functional==1){
    parents = event.returnValues.param.other;
  }
  let estatedata =  {"id":event.returnValues.param.Id,"data":{"pmno":pmno,"pcno":pcno,"scno":scno,"county":event.returnValues.param.county,"townShip":event.returnValues.param.townShip,"reason":event.returnValues.param.reason,"begDate":event.returnValues.param.createDate,"endDate":event.returnValues.param.endDate,"parents":parents,"children":childs,"changedTag":event.returnValues.param.changedTag},"polygon":{"points":event.returnValues.param.pList,"length":event.returnValues.param.numOfPoint}};
  const INSERT_DATA_QUERY = `INSERT INTO nowestatetable (EstateId,CreateDate,PCNO,PMNO,SCNO,TownShip,County,Reason,ChangeTag,EstateData) VALUES ('${event.returnValues.param.Id}','${date}',${pcno},${pmno},${scno},'${event.returnValues.param.townShip}','${event.returnValues.param.county}',${event.returnValues.param.reason},${event.returnValues.param.changedTag},'${JSON.stringify(estatedata)}')`;
  con.query(INSERT_DATA_QUERY,
    function(err,res) {
      if (err) throw err;
      console.log(event.returnValues.param.Id);
      console.log("insert to nowestate sucess");
      // let tracsctionId = event.transactionHash;
  })
}

async function deleteFromDB(blockdata) {
  let event = blockdata;
  const DELETE_QUERY = `DELETE FROM nowestatetable WHERE EstateId='${event.returnValues.Id}'`;
  con.query(DELETE_QUERY,
    function(err,res){
      if(err) throw err;
      console.log("delete from nowestatetable sucess");
  })
}

//delete from nowestatetable
async function old(blockdata) {
  let event = blockdata;
  let endDate = event.returnValues.endDate
  endDate = endDate.slice(0,4) + "-" + endDate.slice(4,6) + "-" + endDate.slice(6);

  let QUERY = `INSERT INTO olddatatable (EstateId, BeginDate, PCNO, PMNO, SCNO, Township, County, Reason, EstateData, ChangeTag) SELECT EstateId, CreateDate, PCNO, PMNO, SCNO, TownShip, County, Reason, EstateData, ChangeTag FROM nowestatetable WHERE EstateId = '${event.returnValues.Id}'`
  con.query(QUERY,
    function(err,res){
      if(err) throw err;
  })

  QUERY = `UPDATE olddatatable SET EndDate = '${endDate}'`
  con.query(QUERY,
    function(err,res){
      if(err) throw err;
      console.log("insert to oldtable sucess");
  })
}

function merge(blockdata){
  let event = blockdata;
  console.log("merge event:")
  console.log("parent:"+event.returnValues.parentId);
  console.log("child:"+event.returnValues.childId);
}

function split(blockdata){
  let event = blockdata;
  console.log("split event:")
  console.log("parent:"+ event.returnValues.parentId);//一個
  console.log("child:"+ event.returnValues.childId);
}

app.get('/operation_id', (req, res) => {
  const {operation_type} = req.query;
  const QUERY = `INSERT INTO operation_list (operation_type) VALUES ('${operation_type}');`

  con.query(QUERY, (err,results) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(results);
    }
  });
})

app.get('/getOne',(req,res) => {
  const {id} = req.query;
  const SELECT_QUERY = `SELECT EstateData FROM nowestatetable WHERE EstateId='${id}'`;
  con.query(SELECT_QUERY,(err,results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  });
})

app.get('/getLatestEstate',(req,res) => {
  const QUERY = "SELECT estate_datas, latest_event FROM estate_snapshot ORDER BY date DESC LIMIT 1";
  con.query(QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/getNearestEstate',(req,res) => {
  const {date} = req.query;
  const QUERY = `SELECT estate_datas, latest_event FROM estate_snapshot ORDER BY ABS(DATEDIFF('${date}', date)) ASC LIMIT 1`;
  con.query(QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/getEvent',(req, res) => {
  const {event_id} = req.query;
  const QUERY = `SELECT event_id, event_type, event_data FROM event_list WHERE event_id = ${event_id}`;
  con.query(QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/getNowEstate',(req,res) => {
  const SELECT_NOW_QUERY = "SELECT EstateData FROM nowestatetable";
  con.query(SELECT_NOW_QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/getOldEstate',(req,res) => {
  const {estate_id} = req.query;
  const QUERY = `SELECT EstateData FROM olddatatable WHERE EstateId = '${estate_id}'`;
  con.query(QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/searchFromNow', (req,res) => {
  const { date } = req.query;
  const SEARCH_QUERY = `SELECT EstateData FROM nowestatetable WHERE CreateDate <= '${date}'`;
  con.query(SEARCH_QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/searchFromOld', (req,res) => {
  const { date } = req.query;
  const SEARCH_QUERY = `SELECT EstateData FROM olddatatable WHERE BeginDate <= '${date}' and EndDate > '${date}'`;
  con.query(SEARCH_QUERY, (err, results) => {
      if (err) {
          return console.log(err);
      } else {
          return res.send(results);
      }
  })
})

app.get('/searchUniverse', (req,res) => {
  const { id } = req.query;
  const SEARCHFROMOLD = `SELECT EstateData FROM olddatatable WHERE EstateId='${id}'`;
  const SEARCHFROMNOW = `SELECT EstateData FROM nowestatetable WHERE EstateId='${id}'`;
  con.query(SEARCHFROMOLD, (err,results) => {
      if (err) {
          return res.send(err);
      } else {
          if(results.length === 0){
              con.query(SEARCHFROMNOW,(err,results) => {
                  if (err) {
                      return res.send(err);
                  } else {
                      return res.send(results);
                  }
              })
          } else {
              return res.send(results);
          }
      }
  })
})

// app.get('/searchFromEvent', (req,res) => {
//   const { date } = req.query;
//   const SEARCH_QUERY = `SELECT EstateId, EstateId, EstateEvent FROM eventtable WHERE ChangeDate > '${date}'`;
//   con.query(SEARCH_QUERY, (err, results) => {
//       if(err){
//           return console.log(err);
//       }
//       else{
//           return res.send(results);
//       }
//   })
// })

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//   let county = req.body.county;
//   let township = req.body.townShip;
//   let originalDate = req.body.begD;
//   let date = req.body.begD.slice(0,4) + "-" + req.body.begD.slice(4,6) + "-" + req.body.begD.slice(6,8);
//   var id = '';
//   var pmno = '';
//   var pcno = '';
//   var scno = '';
//   var points = [];
//   fs.createReadStream(req.file.path)
//   .pipe(csv())
//   .on('data', (row) => {
//     pmno = row['PMNO'].toString().padStart(4, "0")
//     pcno = row['PCNO'].toString().padStart(4, "0")
//     scno = row['SCNO'].toString().padStart(4, "0")
//     if (id=='' ) id = scno+pmno+pcno+originalDate;
//     if((scno+pmno+pcno+originalDate!= id)){
//       points.pop();
//       let length = points.length;
//       for(let i = length;i<100;i++){
//         points.push(["n","n"]);
//       }
//       let data = {"id":id,"data":{"pmno":pmno,"pcno":pcno,"scno":scno,"county":county,"townShip":township,"reason":"0","begDate":originalDate,"endDate":originalDate,"parents":[],"children":[],"changedTag":"0"},"polygon":{"points":points,"length":length}}
//       const INSERT_DATA_QUERY = `INSERT INTO nowestatetable (EstateId,CreateDate,PCNO,PMNO,SCNO,TownShip,County,Reason,ChangeTag,EstateData) VALUES ('${id}','${date}',${id.slice(4,8)},${id.slice(0,4)},${id.slice(8,12)},'${township}','${county}',${0},${0},'${JSON.stringify(data)}')`;
//       con.query(INSERT_DATA_QUERY,
//         function(err,res) {
//           if (err) throw err;
//       })
//       let eventdata = {"from":[],"to":[data],"changeReason":0,"changeDate":originalDate};
//       const INSERT_EVENT_QUERY = `INSERT INTO eventtable (EstateId,ChangeDate,ChangeReason,EstateEvent) VALUES ('${id}','${date}',${0},'${JSON.stringify(eventdata)}')`;
//       con.query(INSERT_EVENT_QUERY,
//         function(err,res){
//         if (err) throw err;
//       })
//       points = [];
//       id = scno+pmno+pcno+originalDate;
//     }

//     points.push([(row['X']-270000),((-1)*(row['Y']-2774624))])
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });

//   res.status(204).send();

// })


  
asyncCall();

app.listen(BackendServerPort,() => {
  console.log("listen " + BackendServerPort + "!");
});



// const mysql = require('mysql2');
// require('dotenv').config({ path: "../../.env" })

// const MySQLHost = process.env.MYSQL_HOST
// const MySQLUser = process.env.MYSQL_USER
// const MySQLPassword = process.env.MYSQL_PASSWORD
// const MySQLDatabase = process.env.MYSQL_DATABASE

// const con = mysql.createConnection({
//     host: MySQLHost,
//     user: MySQLUser,
//     password: MySQLPassword,
//     database: MySQLDatabase
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("SQL Connected!");
// });

// // async function insertCreateEvent(blockdata) {
// //     let event = blockdata;
// //     let date = event.returnValues.createDate;
// //     date = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
// //     const INSERT_EVENT_QUERY = `
// //       INSERT INTO eventtable (EstateId, ChangeDate, ChangeReason, EstateEvent) VALUES (
// //         '${event.returnValues.Id}',
// //         '${date}',
// //         ${event.returnValues.functional},
// //         '${event.returnValues.eventdata}'
// //       )`;
// //     con.query(INSERT_EVENT_QUERY,
// //         function (err, res) {
// //             if (err) throw err;
// //             console.log("insert to event table sucess");
// //         })
// // }

// async function create(blockdata) {
//     let event = blockdata;
//     let date = event.returnValues.createDate;
//     date = date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
//     let pmno = (event.returnValues.Id).slice(0, 4);
//     let pcno = (event.returnValues.Id).slice(4, 8);
//     let scno = (event.returnValues.Id).slice(8, 12);
//     var parents = [];
//     var childs = [];
//     if (event.returnValues.functional == 2) {
//         parents = event.returnValues.other;
//     }
//     if (event.returnValues.functional == 1) {
//         parents = event.returnValues.other;
//     }
//     let estatedata = { "id": event.returnValues.Id, "data": { "pmno": pmno, "pcno": pcno, "scno": scno, "county": event.returnValues.county, "townShip": event.returnValues.townShip, "reason": event.returnValues.reason, "begDate": event.returnValues.createDate, "endDate": event.returnValues.endDate, "parents": parents, "children": childs, "changedTag": event.returnValues.changedTag }, "polygon": { "points": event.returnValues.pList, "length": event.returnValues.numOfPoint } };
//     const INSERT_DATA_QUERY = `INSERT INTO nowestatetable (EstateId,CreateDate,PCNO,PMNO,SCNO,TownShip,County,Reason,ChangeTag,EstateData) VALUES ('${event.returnValues.Id}','${date}',${pcno},${pmno},${scno},'${event.returnValues.townShip}','${event.returnValues.county}',${event.returnValues.reason},${event.returnValues.changedTag},'${JSON.stringify(estatedata)}')`;
//     con.query(INSERT_DATA_QUERY,
//         function (err, res) {
//             if (err) throw err;
//             console.log(event.returnValues.Id);
//             console.log("insert to nowestate sucess");
//             // let tracsctionId = event.transactionHash;
//         })
// }

// async function deleteFromDB(blockdata) {
//     let event = blockdata;
//     const DELETE_QUERY = `DELETE FROM nowestatetable WHERE EstateId='${event.returnValues.Id}'`;
//     con.query(DELETE_QUERY,
//         function (err, res) {
//             if (err) throw err;
//             console.log("delete from nowestatetable sucess");
//         })
// }

// async function old(blockdata) {
//     let event = blockdata;
//     let obj = JSON.parse(event.returnValues.data);
//     const INSERT_OLD_QUERY = `INSERT INTO olddatatable (EstateId,BeginDate,EndDate,PCNO,PMNO,SCNO,County,TownShip,Reason,ChangeTag,EstateData) VALUES ('${event.returnValues.Id}','${event.returnValues.begDate}','${event.returnValues.endDate}',${obj.data.pcno},${obj.data.pmno},${obj.data.scno},'${obj.data.county}','${obj.data.townShip}',${obj.data.reason},${0},'${event.returnValues.data}')`;
//     con.query(INSERT_OLD_QUERY,
//         function (err, res) {
//             if (err) throw err;
//             console.log("insert to oldtable sucess");
//         })
//     //delete from nowestatetable
// }

// export default {create, deleteFromDB, old};
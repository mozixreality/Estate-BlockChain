const mysql = require('mysql2');
const sql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "estate_blockchain"
});
sql.connect(function (err) {
    if (err) throw err;
    console.log("SQL Connected!");
})

// fetch the latest estate and insert it into estate_snapshot
QUERY = `
INSERT INTO estate_snapshot (
    estate_datas,
    latest_event,
    latest_offset
) SELECT 
    estate_datas,
    latest_event,
    latest_offset
FROM latest_estate;
`;
sql.query(QUERY,(err) => {
if (err) throw err;
    console.log("building snapshot success");
    process.exit(0);
})
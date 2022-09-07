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
QUERY = `
    SELECT * FROM nowestatetable
`;


var originEstate = {}
sql.query(QUERY, (err, results) => {
    if (err) throw err;
    if (results.length != 0){
        for (var i = 0; i < results.length; i++) {
            let estate = results[i]
            let estateData = JSON.parse(estate['EstateData'])
            originEstate[estate["EstateId"]] = {
                EstateID: estate["EstateId"],
                PMNO: estateData["data"]["pmno"],
                PCNO: estateData["data"]["pcno"],
                SCNO: estateData["data"]["scno"],
                Date: estateData["data"]["begDate"],
                Country: estateData["data"]["county"],
                TownShip: estateData["data"]["townShip"],
                Reason: estateData["data"]["reason"],
                Points: estateData["polygon"]["points"]
            }
        }
    }
    QUERY = `
        INSERT INTO latest_estate (
            estate_datas,
            latest_event,
            latest_offset
        ) VALUES (
            '${JSON.stringify(originEstate)}',
            ${0},
            ${-1}
        )
    `;
    sql.query(QUERY,(err) => {
        if (err) throw err;
        console.log("rebuild estate success");
        process.exit(0);
    })
})

const mysql = require('mysql2');
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'event-sourcing-processor',
    brokers: ['localhost:9092'],
})
const consumer = kafka.consumer({ 
    groupId: 'event-sourcing' + (+new Date).toString(36) 
})
const KafkaConnectTopic = {
    EventList:      "KafkaConnectTopic.estate_blockchain.event_list",
    EventTable:     "KafkaConnectTopic.estate_blockchain.eventtable",
    NowEstateTable: "KafkaConnectTopic.estate_blockchain.nowestatetable",
    OldDataTable:   "KafkaConnectTopic.estate_blockchain.olddatatable",
    OperationList:  "KafkaConnectTopic.estate_blockchain.operation_list",
}

const EventType = {
    Create: 0,
    Delete: 1,
    Merge:  2,
    Splite: 3,
}

consumer.connect()
consumer.subscribe({ 
    topics: [
        KafkaConnectTopic.EventList,
    ], 
    fromBeginning: true 
})
consumer.run({
    eachBatchAutoResolve: false,
    eachBatch: async ({batch, resolveOffset, heartbeat}) => { // kafka batch default 16KB
        // fetch the latest estates snapshot from db
        let estates = {}
        let QUERY = `
            SELECT estate_datas 
            FROM latest_estate 
            ORDER BY id DESC
            LIMIT 1
        `;
        sql.query(QUERY, (err, results) => {
            if (err) throw err;
            if (results.length != 0){
                estates = JSON.parse(results[0]['estate_datas'])
            }   
        });

        // handle events to build a new snapshot
        let latestEventId = 0;
        for (let message of batch.messages) {
            // 5 event in each snapshot
            // if (message.offset - batch.firstOffset() >= 5) {
            //     break;
            // } 

            // let event = parseEvent(message.value.toString())
            // latestEventId = event.id

            // switch (event.type) {
            //     case EventType.Create:
            //         estates[event.estateID] = event.estateInfo
            //         break;
            //     case EventType.Delete:
            //         delete estates[event.estateID]
            //         break;
            // }
            
            resolveOffset(message.offset)
            console.log(message.offset)
            await heartbeat()
        }

        consumer.stop()

        // insert the new snapshot into db
        QUERY = `
            INSERT INTO latest_estate (
                estate_datas,
                latest_event
            ) VALUES (
                '${JSON.stringify(estates)}',
                ${latestEventId}
            )
        `;
        // sql.query(QUERY,(err) => {
        //     if (err) throw err;
        //     console.log("insert snapshot success");
        //     process.exit(0);
        // })
    },
})

function parseEvent(event) {
    let payload = JSON.parse(event).payload
    let data = payload.after.event_data
    try {
        data = JSON.parse(data)
    } catch (err) {
        console.log('Error: ', err.message);
    }

    let estateID, estateInfo
    switch (payload.after.event_type) {
        case EventType.Create:
            estateID = data.returnValues[0][0],
            estateInfo = {
                EstateID: data.returnValues[0][0],
                PMNO: data.returnValues[0][0].substring(0,4),
                PCNO: data.returnValues[0][0].substring(4,8),
                SCNO: data.returnValues[0][0].substring(8,12),
                Date: data.returnValues[0][1],
                Country: data.returnValues[0][3],
                TownShip: data.returnValues[0][4],
                Reason: data.returnValues[0][5],
                Points: data.returnValues[0][7]
            }
            break;
        case EventType.Delete:
            estateID = data.returnValues[0]
            break;
        default:
            // do nothing
    }

    return {
        id: payload.after.event_id,
        type: payload.after.event_type,
        estateID: estateID,
        estateInfo: estateInfo
    }
}


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




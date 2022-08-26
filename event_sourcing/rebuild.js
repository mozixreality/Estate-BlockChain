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

var estates = {}, latestOffset = -1
var QUERY = `
    SELECT estate_datas, latest_offset
    FROM estate_snapshot 
    ORDER BY date DESC
    LIMIT 1
`;
sql.query(QUERY, (err, results) => {
    if (err) throw err;
    if (results.length != 0){
        estates = JSON.parse(results[0]['estate_datas'])
        latestOffset = results[0]['latest_offset']
    }

    // seeking from the latest snapshot
    consumer.seek({ 
        topic: KafkaConnectTopic.EventList, 
        partition: 0,
        offset: latestOffset
    })
})

consumer.connect()
consumer.subscribe({ 
    topic: KafkaConnectTopic.EventList,
    fromBeginning: true 
})
consumer.run({
    eachBatchAutoResolve: false,
    eachBatch: async ({batch, resolveOffset, heartbeat}) => { // kafka batch default 16KB
        // check if there is no new estate event
        if (latestOffset == batch.lastOffset()) {
            console.log("there is no new estate event");
            process.exit(0);
        }

        // truncate table
        QUERY = `
            TRUNCATE TABLE latest_estate;
        `;
        sql.query(QUERY, (err) => {
            if (err) throw err;
        });

        // rebuild estates
        let latestEventId = 0;
        for (let message of batch.messages) {
            // skip the handled event
            if (message.offset == latestOffset) {
                continue
            }

            let event = parseEvent(message.value.toString())
            latestEventId = event.id

            switch (event.type) {
                case EventType.Create:
                    estates[event.estateID] = event.estateInfo
                    break;
                case EventType.Delete:
                    delete estates[event.estateID]
                    break;
            }

            console.log(message.offset)

            resolveOffset(message.offset)
            await heartbeat()

            // exit after handling the last message
            if (message.offset == batch.lastOffset()) {
                latestOffset = batch.lastOffset()
                break;
            }
        }

        // insert the rebuild estates into db
        QUERY = `
            INSERT INTO latest_estate (
                estate_datas,
                latest_event,
                latest_offset
            ) VALUES (
                '${JSON.stringify(estates)}',
                ${latestEventId},
                ${latestOffset}
            )
        `;
        sql.query(QUERY,(err) => {
            if (err) throw err;
            console.log("rebuild estate success");
            process.exit(0);
        })
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

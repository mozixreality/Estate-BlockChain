const mysql = require('mysql2');
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'event-sourcing-processor',
    brokers: ['localhost:9092'],
})
const consumer = kafka.consumer({ 
    groupId: 'event-sourcing69' 
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
    
    eachBatch: async ({batch, resolveOffset, heartbeat}) => { // kafka batch default 16KB
        // fetch the latest estates snapshot from db
        let estates = {}
        let QUERY = `
            SELECT estate_datas 
            FROM estate_snapshot 
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
        for (let message of batch.messages) {
            let event = parseEvent(message.value.toString())

            switch (event.type) {
                case EventType.Create:
                    estates[event.estateID] = event.estateInfo
                    break;
                case EventType.Delete:
                    delete estates[event.estateID]
                    break;
            }

            resolveOffset(message.offset)
        }

        // insert the new snapshot into db
        QUERY = `
            INSERT INTO estate_snapshot (
                estate_datas
            ) VALUES (
                '${JSON.stringify(estates)}'
            )
        `;
        sql.query(QUERY,(err, results) => {
            if (err) throw err;
            console.log("insert snapshot sucess");
        });
        
        // set time interval and wait heartbeat
        //sleep(2000);
        await heartbeat()
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

    let type, estateID, estateInfo
    switch (payload.after.event_type) {
        case EventType.Create:
            type = payload.after.event_type
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
            type = payload.after.event_type
            estateID = data.returnValues[0]
            break;
        default:
            // do nothing
    }

    return {
        type: type,
        estateID: estateID,
        estateInfo: estateInfo
    }
}


const sql = mysql.createConnection({
    host: "localhost",
    user: "mozixreality",
    password: "ylsh510574",
    database: "estate_blockchain"
});
sql.connect(function (err) {
    if (err) throw err;
    console.log("SQL Connected!");
});




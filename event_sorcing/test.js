const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'event-sourcing-processor',
    brokers: ['localhost:9092'],
})
const consumer = kafka.consumer({ 
    groupId: 'event-sourcing10' 
})
const KafkaConnectTopic = {
    EventList:      "KafkaConnectTopic.estate_blockchain.event_list",
    EventTable:     "KafkaConnectTopic.estate_blockchain.eventtable",
    NowEstateTable: "KafkaConnectTopic.estate_blockchain.nowestatetable",
    OldDataTable:   "KafkaConnectTopic.estate_blockchain.olddatatable",
    OperationList:  "KafkaConnectTopic.estate_blockchain.operation_list",
}

consumer.connect()
consumer.subscribe({ 
    topics: [
        KafkaConnectTopic.EventList,
    ], 
    fromBeginning: true 
})
consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        restoreData(message.value.toString())
        // console.log(topic, {
        //     value: message.value.toString(),
        // })
    },
})

const EventType = {
    Create: 0,
    Delete: 1,
    Merge:  2,
    Splite: 3,
}

function restoreData(event) {
    payload = JSON.parse(event).payload
    if(payload.after.event_type != EventType.Create && payload.after.event_type != EventType.Delete) {
        return
    }

    data = payload.after.event_data
    try {
        data = JSON.parse(data)
    } catch (err) {
        // 👇️ This runs
        console.log('Error: ', err.message);
    }
    
    console.log(payload.after.event_id, payload.after.event_type, {
        data: data
    })
}
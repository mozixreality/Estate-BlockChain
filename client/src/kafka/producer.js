const ZOOKEEPER_IP = "localhost"
const ZOOKEEPER_PORT = "2181"
const TOPIC = "EstateEvent"

import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const kafka = require('kafka-node')
const Producer = kafka.Producer
const client = new kafka.KafkaClient(ZOOKEEPER_IP + ":" + ZOOKEEPER_PORT)
const producer = new Producer(client)

function sendKafkaMsg(msgs){
    console.log(msgs)
    let payloads = [{
        topic: TOPIC,
        messages: msgs
    }]

    producer.send(payloads, function(err, data){
        console.log(data)
        process.exit()
    })
}

// producer.on('error', function(err){
//     console.log('Producer is in error state')
//     console.error(err)
// })

export default sendKafkaMsg;
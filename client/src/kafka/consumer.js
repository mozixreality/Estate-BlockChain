const zookeeperIP = 'localhost'
const zookeeperPort = '2181'

import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const kafka = require('kafka-node')

const options = {
    groupId: 'kafka-node-group',
    fromOffset: 'earliest',
    sessionTimeout: 6000
}
const topics = [{
    topic: "EstateEvent"
}]

const client = new kafka.KafkaClient(zookeeperIP + ":" + zookeeperPort)
const consumer = new kafka.Consumer(client, topics, options)

consumer.on('message', function(message) {
    for(var prop in message) {
        console.log(prop + ', ' + message[prop]);
    }
})
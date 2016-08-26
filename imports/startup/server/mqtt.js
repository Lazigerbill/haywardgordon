
import { Meteor } from 'meteor/meteor';
import { Machine1 } from '/db/mongo.js';
// // include npm package in meteor
// // https://www.npmjs.com/package/mqtt
import mqtt from 'mqtt';


console.log('connecting to broker...');
const client  = mqtt.connect({
  		// Reads variables from file "development_env.json" located in root
  		// you have to start meteor and load this file using command "meteor --settings development_env.json"
  		host: Meteor.settings.mqtt.host,
  		port: 1883,
  		username: Meteor.settings.mqtt.username,
  		password: Meteor.settings.mqtt.password,
  		clientId: Meteor.settings.mqtt.clientId
  	});

client.on('connect', function () {
	client.subscribe('iot-2/type/Accuvim001/id/+/evt/+/fmt/+');
	console.log('connected: ' +  client.options.clientId);
});

client.on('reconnect', function () {
	console.log('reconnecting...');
});

client.on('message', Meteor.bindEnvironment(function callback(topic, message) { 
	const payload = JSON.parse(message.toString())
	console.log(payload.ts + "=>" + JSON.stringify(payload.d));
	// save into database
    Machine1.insert({
    	message: payload.d,
    	ts: payload.ts
    });
    // Meteor.publish('mqttdata', function() {
    //   return Machine1.findOne({}, {sort: {time: -1, limit: 1}}).message.d
    // })
}));

import mqtt from 'mqtt';
import { Machines } from '../../api/machines/machines.js';
import { Rules } from '../../api/machines/machines.js';

var client  = mqtt.connect({
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
  console.log('connected to IBM IOTF MQTT Broker');
});

client.on('message', Meteor.bindEnvironment(function callback(topic, message) { 
  console.log(message.toString());
  const state = checkCurrentState(JSON.parse(message.toString()).d.apower);
  Machines.insert({
    message: JSON.parse(message.toString()).d,
    state: {
      currentState: state, //function defined below to check against machineRules
      stateChange: checkForChange(state) //function defined below to check for state change
    },
    ts: new Date(JSON.parse(message.toString()).ts) //best practice is to save datetime in BSON objects in MONGODB, BSON is in UTC
  });
}));

// Async function defined here to check apower against user defined machineRules, returns machine state
// The ".some" is pretty cool, will break loop if returns True
function checkCurrentState(reading) {
  let result
  Rules.find().fetch().some(function(rule){
    if (reading >= rule.rule.from && reading <= rule.rule.to) {
      result = rule.rule.state
      return true
    } else {
      return false
    }
  });
  return result;
} 

function checkForChange(currentState) {
  try {
    const lastState = Machines.find({},{sort: {ts:-1}, limit:1}).fetch()[0].state.currentState
    return currentState != lastState
  }
  // need the catch here because when the database is empty to begin with, error arises when lastState=undefined.
  catch(err) {
    return true
  }
}




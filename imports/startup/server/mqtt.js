import mqtt from 'mqtt';
import { Machines } from '../../api/machines/machines.js';
import { Totems } from '../../api/totems/totems.js';
import { Rules } from '../../api/machines/machines.js';
// import ibmiotf from 'ibmiotf';
var Client = require("ibmiotf");

// Reads variables from file "development_env.json" located in root
// you have to start meteor and load this file using command "meteor --settings development_env.json"
const clientConfig = {
  "org" : Meteor.settings.mqtt.orgId,
  "id" : Meteor.settings.mqtt.clientId,
  "domain": "internetofthings.ibmcloud.com",
  "auth-key" : Meteor.settings.mqtt.appId,
  "auth-token" : Meteor.settings.mqtt.apiKey
}

var client  = new Client.IotfApplication(clientConfig)

client.connect();

client.on('connect', function () {
  client.subscribeToDeviceEvents('Accuvim001', '+', '+');
  client.subscribeToDeviceStatus('Accuvim001', 'pm1');
  console.log('connected to IBM IOTF MQTT Broker');
});

client.on('deviceStatus', Meteor.bindEnvironment(function callback(deviceType, deviceId, payload, topic) {   
  console.log("Device status from :: "+deviceType+" : "+deviceId+" with payload : "+payload);
  Totems.insert({
    deviceType: deviceType,
    deviceId: deviceId,
    topic: topic,
    payload: JSON.parse(payload)
  })
}));

client.on("deviceEvent", Meteor.bindEnvironment(function callback(deviceType, deviceId, eventType, format, payload) { 
  // console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
  const state = checkCurrentState(JSON.parse(payload).d.apower);
  Machines.insert({
    message: JSON.parse(payload).d,
    state: {
      currentState: state, //function defined below to check against machineRules
      stateChange: checkForChange(state) //function defined below to check for state change
    },
    ts: new Date(JSON.parse(payload).ts) //best practice is to save datetime in BSON objects in MONGODB, BSON is in UTC
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




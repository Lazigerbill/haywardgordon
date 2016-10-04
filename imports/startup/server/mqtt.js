import mqtt from 'mqtt';
import { Machines } from '../../api/machines/machines.js';
import { Rules } from '../../api/machines/machines.js';

var client  = mqtt.connect({
  // Reads variables from file "development_env.json" located in root
  // you have to start meteor and load this file using command "meteor --settings development_env.json"
  host: Meteor.settings.public.host,
  port: 1883,
  username: Meteor.settings.public.username,
  password: Meteor.settings.public.password,
  clientId: Meteor.settings.public.clientId
});

client.on('connect', function () {
  client.subscribe('iot-2/type/Accuvim001/id/+/evt/+/fmt/+');
  console.log('connected')
});

client.on('message', Meteor.bindEnvironment(function callback(topic, message) { 
  console.log(message.toString());
  Machines.insert({
    message: JSON.parse(message.toString()).d,
    state: currentState(JSON.parse(message.toString()).d.apower), //function defined below to check against machineRules
    ts: new Date(JSON.parse(message.toString()).ts) //best practice is to save datetime in BSON objects in MONGODB
  });
}));

// Async function defined here to check apower against user defined machineRules, returns machine state
function currentState(reading) {
  let result
  Rules.find().forEach(function(rule){
    if (reading > rule.rule.from && reading < rule.rule.to) {
      result = rule.rule.state
      return
    } else {
      result = undefined  
    }
  });
  return result;
} 
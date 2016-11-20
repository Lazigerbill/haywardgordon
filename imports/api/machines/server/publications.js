// all machines-related publications
import { Machines } from '../machines.js';
import { Rules } from '../machines.js';


Meteor.publish('meterData', function(date){
	// const data = Machines.find(oneDay(date).find, oneDay(date).options);
	const data = Machines.find();
	return data;
});

Meteor.publish('rules', function(){
	const data = Rules.find();
	return data;
});
// Meteor.publish('chartData', function(startTime) {
// 	const data = Machines.find({ts: {$gt: startTime}}, {fields: {ts:1, "message.apower":1}});
// 	return data
// });

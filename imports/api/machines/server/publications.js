// all machines-related publications
import { Machines } from '../machines.js';

Meteor.publish('last24', function(startTime){
	const data = Machines.find({ts: {$gt: startTime}});
	return data;
});

Meteor.publish('chartData', function(startTime) {
	const data = Machines.find({ts: {$gt: startTime}}, {fields: {ts:1, "message.apower":1}});
	return data
});

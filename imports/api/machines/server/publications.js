// all machines-related publications
import { Machines } from '../machines.js';
import { Rules } from '../machines.js';


Meteor.publish('meterData', function(){
	startTime = new Date(moment().startOf('day'));
	endTime = new Date(moment().endOf('day'));
	const data = Machines.find({'ts': {$gte: startTime, $lte: endTime}}, {sort: {ts: 1}});
	return data;
});

Meteor.publish('rules', function(){
	const data = Rules.find();
	return data;
});

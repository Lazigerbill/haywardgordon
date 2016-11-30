// all machines-related publications
import { Machines } from '../machines.js';
import { Rules } from '../machines.js';


Meteor.publish('meterData', function(){
	const startTime = moment().startOf('day').toDate();
	const data = Machines.find({'ts': {$gte: startTime}}, {sort: {ts: 1}});
	return data;
});

Meteor.publish('rules', function(){
	const data = Rules.find();
	return data;
});

// all machines-related publications
import { Machines } from '../machines.js';

Meteor.publish('last24', function(startTime){
	const data = Machines.find({ts: {$gt: startTime}});
	return data;
});

// Meteor.publish('allData', function() {
// 	const data = Machines.find();
// 	return data
// });

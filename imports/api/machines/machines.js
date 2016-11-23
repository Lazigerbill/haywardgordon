// definition of the Machine collection

import { Mongo } from 'meteor/mongo';
 
export const Machines = new Mongo.Collection('machines');

export const Rules = new Mongo.Collection('machineRules');

if (Meteor.isServer) {
	Meteor.startup(function () {  
	  Machines._ensureIndex({ "ts": 1});
	});
};

// Query constructors for Machine readings
dataOnDemand = function(date){
	const startTime = new Date(date);
	const endTime = new Date(moment(date).endOf('day'));
	console.log(startTime, endTime)
	return {
		find: {'ts': {$gte: startTime, $lte: endTime}}, 
		options: {sort: {ts: 1}}
	};
};
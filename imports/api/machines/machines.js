// definition of the Machine collection

import { Mongo } from 'meteor/mongo';
 
export const Machines = new Mongo.Collection('machines');

export const Rules = new Mongo.Collection('machineRules');

if (Meteor.isServer) {
	Meteor.startup(function () {  
	  Machines._ensureIndex({ "ts": -1});
	});
};

// Query constructors for Machine readings
oneDay = function(date) {
	const starttime = new Date(date.setHours(0,0,0,0))
	// const endtime = starttime.
	return {
		find: {},
		options: (sort:{ts:1}, $gt:{ts: starttime})
	}
}


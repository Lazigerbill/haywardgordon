// definition of the Machine collection

import { Mongo } from 'meteor/mongo';
 
export const Machines = new Mongo.Collection('machines');

export const Rules = new Mongo.Collection('machineRules');

if (Meteor.isServer) {
	Meteor.startup(function () {  
	  Machines._ensureIndex({ "ts": -1});
	});
}
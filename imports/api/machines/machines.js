// definition of the Machine collection

import { Mongo } from 'meteor/mongo';
 
export const Machines = new Mongo.Collection('machines');

export const Rules = new Mongo.Collection('machineRules');

if (Meteor.isServer) {
	Meteor.startup(function () {  
	  Machines._ensureIndex({ "ts": 1});
	});
};

// History method
Meteor.methods({
	dataOnDemand: function(date){
		const startTime = new Date(date);
		const endTime = new Date(moment(date).endOf('day'));
		const data = Machines.find({'ts': {$gte: startTime, $lte: endTime}}, {sort: {ts: 1}});
		const chartData = new Array();
		data.forEach(function(item){
		    chartData.push([moment(item.ts).valueOf(), item.message.apower]);
		});
		return chartData;
	}
});
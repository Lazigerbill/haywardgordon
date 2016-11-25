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
		const endTime = moment(date).endOf('day').toDate();
		const data = Machines.find({'ts': {$gte: startTime, $lte: endTime}}, {sort: {ts: 1}});
		console.log(startTime, endTime);
		const chartData = new Array();
		data.forEach(function(item){
		    chartData.push([item.ts.getTime(), item.message.apower]);
		});
		return chartData;
	}
});
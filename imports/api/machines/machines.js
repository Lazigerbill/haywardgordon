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
		// when doing a data query in mongodb, it only takes JS date object.  However, moment().toDate() doesn't work.
		// It has to be new Date()
		const startTime = new Date(date);
		const endTime = new Date(moment(date).endOf('day').utc().format());
		const data = Machines.find({'ts': {$gte: startTime, $lte: endTime}}, {sort: {ts: 1}});
		console.log(data.fetch());
		const chartData = new Array();
		data.forEach(function(item){
		    chartData.push([item.ts.getTime(), item.message.apower]);
		});
		return chartData;
	}
});
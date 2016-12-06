// definition of the Machine collection

import { Mongo } from 'meteor/mongo';
// import {mongoXlsx} from 'mongo-xlsx';
export const Machines = new Mongo.Collection('machines');
export const Rules = new Mongo.Collection('machineRules');

if (Meteor.isServer) {
	Meteor.startup(function () {  
	  Machines._ensureIndex({ "ts": 1});
	});

// History method
	Meteor.methods({
		dataOnDemand: function(date){
			// Remember to set Heroku timezone
			// This only applies when you need to query end of day or start of day
			// heroku config:add TZ="America/New_York"
			const startTime = new Date(date);
			const endTime = new Date(moment(date).endOf('day'));
			const data = Machines.find({'ts': {$gte: startTime, $lte: endTime}}, {sort: {ts: 1}});
			const chartData = new Array();
			data.forEach(function(item){
			    chartData.push([item.ts.getTime(), item.message.apower]);
			});
			return chartData;
		},

		exportCsv: function(date) {
			const startTime = new Date(date);
			const endTime = new Date(moment(date).endOf('day'));
			const pipeline = [{ 
				$match: { 
					ts: { 
						$gt: startTime, 
						$lt: endTime
					} 
				} 
			}, {
				$sort: {
					ts: 1
				}
			}, {	
				$project: {
					_id: 0, 
					TimeStamp: "$ts",
					Current: "$message.current",
					Voltage: "$message.v12",
					Power: "$message.apower",
					State: "$state.currentState"
					// MachineState: "$state.currentState"
				}
			}]
			const collection = Machines.aggregate(pipeline)
			var heading = true; // Optional, defaults to true
			var delimiter = ";" // Optional, defaults to ",";
			return exportcsv.exportToCSV(collection, heading, delimiter);
		},

		aggGroup: function(date) {
			const startTime = new Date(date);
			const endTime = new Date(moment(date).endOf('day'));
			const pipeline = [{
				$match: { 
					ts: { 
						$gt: startTime, 
						$lt: endTime
					} 
				} 
			}, {
				$group: {
					_id: "$state.currentState",
					totalTime: { $sum: 5},
					count: { $sum: 1 },
					avgPower: {$avg: "$message.apower"}
				}
			}]
			console.log (Machines.aggregate(pipeline));
			return Machines.aggregate(pipeline);
		}
	});
};




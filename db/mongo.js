import { Mongo } from 'meteor/mongo';
 
export const Machine1 = new Mongo.Collection('machine1');

if (Meteor.isServer) {
  	// This code only runs on the server
  	Meteor.publish('chartArray', function() {
  		var a = Machine1.find();
  		console.log(a);
    	return a;
  	});
}
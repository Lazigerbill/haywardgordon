import './dataCard.html';
import { Moment } from 'moment';
import { Machines } from '../../api/machines/machines.js';

Template.dataCard.onCreated(function() {
	// set startTime so the subsciption will only limit data to within the last day(24hrs)
	// a bit tricky here to do datetime caculation, I've decided to save everything datetime in JS BSON objects 
	// using startTime as a subscription argument, the publication should only return everything within the last 24 hrs
	// const startTime = new Date(new Date().setDate(new Date().getDate()-1));
	// console.log(startTime);
	// this.subscribe('last24', startTime, function(){
	// 	const data = Machines.find();
	// 	console.log(data.count());
	// });

})

Template.dataCard.helpers({
    ts() {
        return moment(Session.get('ts')).calendar();
    },
    v12() {
        return Session.get('v12').toFixed(3);
    },
    fq() {
        return Session.get('fq').toFixed(2);
    },
    apower() {
        return Session.get('apower').toFixed(3);
    },
    current() {
        return Session.get('current').toFixed(3);
    }
});
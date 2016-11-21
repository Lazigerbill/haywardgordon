// all totems-related publications
import { Totems } from '../totems.js';

Meteor.publish('totemStatus', function(){
	const data = Totems.find({},{sort: {'payload.Time':-1}, limit: 1});
	return data;
});
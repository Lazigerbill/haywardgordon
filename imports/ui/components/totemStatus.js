import './totemStatus.html';
import { Moment } from 'moment';
import { Totems } from '../../api/totems/totems.js';

Template.totemStatus.onCreated(function(){
	this.subscribe("totemStatus")
});

Template.totemStatus.helpers({
	getTotemStatus() {
		data = Totems.findOne();
		return data.deviceType+" : "+data.deviceId+ " has been "+data.payload.Action+"ed since "+moment(data.payload.Time).format("dddd, MMMM Do YYYY, h:mm:ss a")+" from "+data.payload.ClientAddr 
	}
})
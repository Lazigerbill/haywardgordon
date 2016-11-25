import './totemdash.html';
import '../../components/dataCard.js';
import '../../components/chart.js';
import '../../components/status_form.js';
import '../../components/loadingModal.js';
import { Machines } from '../../../api/machines/machines.js';

// more elegant solution here: subscribe to all data, but only monitor added new data
// insert newly added data to session, and the entire template/sub template can just feed off session variables

// set startTime so the subsciption will only limit data to within the last day(24hrs)
// a bit tricky here to do datetime caculation, I've decided to save everything datetime in JS BSON objects 
// using startTime as a subscription argument, the publication should only return everything within the last 24 hrs

Template.totemdash.onCreated(function(){
	this.subscribe('meterData', function(){
	    let initializing = true;
	    	if (initializing) {
	    		const init = Machines.find({}, {sort: {'ts': -1}, limit: 1}).fetch();
	    		Session.set({
	    		    'ts': init[0].ts,
	    		    'v12': init[0].message.v12,
	    		    'fq': init[0].message.fq,
	    		    'apower': init[0].message.apower,
	    		    'current': init[0].message.current,
	    		    'state': init[0].state.currentState,
	    		    'stateChange': init[0].state.stateChange
	    		});
	    	}
	        Machines.find().observeChanges({
	            added: function(id, doc) {
	                if (!initializing) {
	                    Session.set({
	                        'ts': doc.ts,
	                        'v12': doc.message.v12,
	                        'fq': doc.message.fq,
	                        'apower': doc.message.apower,
	                        'current': doc.message.current,
	                        'state': doc.state.currentState,
	                        'stateChange': doc.state.stateChange
	                    });
	                }
	            }
	        });
	    initializing = false;

	});
})

Template.totemdash.onRendered(function(){
	$('#loadingModal').modal('show');
})
import './status_card.html';
import { Rules } from '../../api/machines/machines.js';

// Template.status_form.events({
// 	'submit .rules_form'(event) {
// 	    // Prevent default browser form submit
// 	    event.preventDefault();
// 	    // Get value from form element
// 	    const target = event.target;
// 	    const from = target.from.value;
// 	    const to = target.to.value;
// 	    const state = target.state.value;
// 	    // Insert a task into the collection
// 	    Rules.insert({
// 	    	rule: {
// 	    		from: from,
// 	    		to: to,
// 	    		state: state
// 	    	}
// 	  	});
// 	    // Clear form
// 	    target.from.value = '';
// 	    target.to.value = '';
// 	    target.state.value = ''
// 	},

// 'click .deleteRule'(event) {
// 		Rules.remove(this._id);
// 	}
// });

// Template.status_form.onCreated(function(){
// 	this.subscribe('rules');
// })

// Template.status_form.helpers({
// 	rules: function() {		
// 		return Rules.find();
// 	}
// });
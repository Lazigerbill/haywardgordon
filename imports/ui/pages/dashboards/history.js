import './history.html';
import { Machines } from '../../../api/machines/machines.js';

Template.history.onRendered(function(){
  $('#datePicker').datetimepicker({
    inline: true,
    maxDate: moment(),
    calendarWeeks: true
  });
  this.subscribe('history');
});

Template.history.events({
  'click #submit'(event) {
	    // Prevent default browser form submit
    event.preventDefault();
    const date = $('#datePicker').data("DateTimePicker").date().format();
    const data = Machines.find(dataOnDemand(date).find, dataOnDemand(date).options);
    console.log(data.fetch());
	}
});



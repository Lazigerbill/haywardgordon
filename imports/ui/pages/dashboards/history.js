import './history.html';

Template.history.rendered = function(){
    $('#datePicker').datetimepicker({
        inline: true,
        maxDate: moment(),
        calendarWeeks: true
  	});
};

Template.history.events({
  'click #submit'(event) {
	    // Prevent default browser form submit
	    event.preventDefault();
	    alert($('#datePicker').data("DateTimePicker").date());
	}
});



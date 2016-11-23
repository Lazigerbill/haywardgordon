import './history.html';
import { Machines } from '../../../api/machines/machines.js';
var Highcharts = require('highcharts/highstock');
require('highcharts/modules/exporting')(Highcharts);

Template.history.onRendered(function(){
    $('#datePicker').datetimepicker({
        inline: true,
        maxDate: moment(),
        calendarWeeks: true
    });
});

Template.history.events({
    'click #submit'(event) {
	    // Prevent default browser form submit
        event.preventDefault();

        const date = $('#datePicker').data("DateTimePicker").date().format(); 
        Meteor.call('dataOnDemand', date, function(error, result){

            historyChart = Highcharts.chart('historyChart', {

                chart: {
                zoomType: 'x',
                },

                rangeSelector: {
                    allButtonsEnabled: true,
                    enabled: true,

                    buttons: [{
                        count: 1,
                        type: 'hour',
                        text: '1H'
                        }, {
                            count: 4,
                            type: 'hour',
                            text: '4H'
                        }, {
                            count: 8,
                            type: 'hour',
                            text: '8H'
                        }, {
                            count: 12,
                            type: 'hour',
                            text: '12H'
                    }],
                },

                title: {
                    text: 'Historic power consumption - ' + moment(date).format("dddd, MMMM Do YYYY")
                },

                subtitle: {
                    text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },

                xAxis: {
                    type: 'datetime'
                },

                yAxis: {
                    floor: 0,
                    title: {
                        text: 'Power(W)'
                    }
                },

                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },

                    marker: {
                        radius: 2
                    },

                    lineWidth: 1,

                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },

                    threshold: null
                    }
                },

                series : [{
                    type: 'area',
                    name: 'Single phase',
                    data : result,
                    gapSize : 2,
                    tooltip: {
                        valueDecimals: 4
                    }
                 }]
            });
        });
    }
});



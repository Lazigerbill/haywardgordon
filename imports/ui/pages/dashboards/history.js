import './history.html';
import { Machines } from '../../../api/machines/machines.js';
var Highcharts = require('highcharts/highstock');
require('highcharts/modules/exporting')(Highcharts);

Template.history.onRendered(function(){
    $('#loadingModal').modal('show');
    $('#datePicker').datetimepicker({
        inline: true,
        maxDate: moment(),
        calendarWeeks: true
    });
    // Initialize chart to today's date
    const date = moment().startOf('day').format(); 
    Meteor.call('dataOnDemand', date, function(error, result){
        Highcharts.setOptions({global: { useUTC: false } });
        historyChart = Highcharts.chart('historyChart', {
            chart: {
            zoomType: 'x',
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
                name: 'Machine Name',
                data : result,
                gapSize : 50,
                tooltip: {
                    valueDecimals: 2,
                    dateTimeLabelFormats: "%A, %b %e, %H:%M:%S"
                }
             }]
        }, function(){
            $('#loadingModal').modal('hide');
        });
    });
});

Template.history.events({
    'click #submit'(event) {
	    // Prevent default browser form submit
        event.preventDefault();
        $('#loadingModal').modal('show');
        const date = $('#datePicker').data("DateTimePicker").date().format(); 
        Meteor.call('dataOnDemand', date, function(error, result){
            historyChart.series[0].setData(result,true);
            historyChart.setTitle({ text: 'Historic power consumption - ' + moment(date).format("dddd, MMMM Do YYYY") })
            $('#loadingModal').modal('hide');          
        });
    },
    'click #export'(event) {
        event.preventDefault();
        $( event.target ).button( 'loading' );
        const date = $('#datePicker').data("DateTimePicker").date().format(); 
        console.log(date);
        Meteor.call('exportCsv', date, function(err, fileContent){
            var nameFile = new Date(date).toDateString() + '.csv';
            if(fileContent){
                var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
                saveAs(blob, nameFile);
                $( event.target ).button( 'reset' );
            }
            if (err){
                console.log(error.reason);
            }   
        })
    }
});



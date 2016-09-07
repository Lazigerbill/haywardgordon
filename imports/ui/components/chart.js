import './chart.html';
// import { Highcharts } from 'highcharts';
var Highcharts = require('highcharts/highstock');
import { Machines } from '../../api/machines/machines.js';

Template.chart.onCreated(function(){
	const startTime = new Date(new Date().setDate(new Date().getDate()-1));
	this.subscribe("chartData", startTime, function(){
		const data = Machines.find().fetch();
		const processed_json = new Array()
		for (i = 0; i < data.length; i++) {
			processed_json.push([data[i].ts, data[i].message.apower]);
		}
			console.log(processed_json)
		Highcharts.chart('chart', {
			chart: {
                zoomType: 'x'
            },
            title: {
            	text: 'Real time power consumption'
            },
			subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Power'
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
			    data : processed_json,
			    tooltip: {
			        valueDecimals: 4
			    }
			 }]
		})
	});
})

	// Template.body.helpers({
	// 	createChart: function () {
	// 		// Gather data:
			
	// 		tasksData = [{
	// 			y: incompleteTask,
	// 			name: "Incomplete"
	// 		}, {
	// 			y: allTasks - incompleteTask,
	// 			name: "Complete"
	// 		}];
	// 		// Use Meteor.defer() to craete chart after DOM is ready:
	// 		Meteor.defer(function() {
	// 		// Create standard Highcharts chart with options:
	// 			Highcharts.chart('chart', {
	// 				series: [{
	// 					type: 'pie',
	// 					data: tasksData
	// 				}]
	// 			});
	// 		});
	// 	}
	// });

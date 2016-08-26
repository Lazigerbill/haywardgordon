// import { Highcharts } from 'highcharts/highstock';
var Highcharts = require('highcharts/highstock');
// import highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import { Machine1 } from '/db/mongo.js';
// import '../client/views/pages/chart.html'

if (Meteor.isClient) {
	Meteor.subscribe("Machine1");

	Template.graphHighChart.onRendered(function () {
		const cursor = Template.currentData();
    const query = Machine1.find();
    console.log(query.count());
  	let initializing = true; // add initializing variable, see:  http://docs.meteor.com/#/full/meteor_publish

  		// Create basic line-chart:
  	const liveChart = Highcharts.chart(cursor.liveChart, {
  			rangeSelector: {
  			 buttons: [{
  			  count: 15,
  			  type: 'minute',
  			  text: '15m'
  			}, {
  			  count: 60,
  			  type: 'minute',
  			  text: '1h'
  			}, {
  			  count: 360,
  			  type: 'minute',
  			  text: '6h'
  			}, {
  			  count: 720,
  			  type: 'minute',
  			  text: '12h'
  			}, {
  			  type: 'all',
  			  text: '24h'
  			}],
  			  selected: 1,
  			  inputEnabled: false
  			},
  			navigator : {
  			  enabled : true
  			},
  			yAxis: { // Primary yAxis
  				labels: {
  					format: '{value}',
  					style: {
  						color: Highcharts.getOptions().colors[0]
  					}
  				},
  				title: {
  					text: 'Power Level',
  					style: {
  						color: Highcharts.getOptions().colors[0]
  					}
  				}
  			},
  			xAxis: {
  				type: 'datetime',
  				dateTimeLabelFormats: {
  					// second: '%H:%M:%S',
  					minute: '%H:%M',
  					hour: '%H:%M',
  					day: '%e. %b'
  				},
  				title: {
  					text: 'Time'
  				}
  			},
  			legend: {
  				enabled: true,
  				align: 'center',
  				verticalAlign: 'top',
  				y: -15,
  				shadow: true
  			},
  			series: [{
  				name: 'Power',
  				data: [1,1]
  			}]
  		});

  		// Add watchers:
  		// query.observeChanges({
  		// 	added: function () {
  		// 		if (!initializing) {
  		// 				// We will use Highcharts API to add point with "value = previous_value + 1" to indicate number of tasks
  		// 				var points = liveChart.series[0].points;
  		// 				liveChart.series[0].addPoint(
  		// 					points[points.length - 1].y + 1
  		// 					);
  		// 			}
  		// 		}
  		// 	});   
  		// initializing = false;
  	});
}
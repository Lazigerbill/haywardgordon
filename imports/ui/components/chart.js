import './chart.html';
var Highcharts = require('highcharts/highstock');
import { Machines } from '../../api/machines/machines.js';
require('highcharts/modules/exporting')(Highcharts);


Template.chart.onCreated(function(){
	this.subscribe("meterData", function(){
		const query = Machines.find({}, {sort: {ts: 1}});
		const data = query.fetch();
		// need to lookout for invalid data, and catch error when tranforming into array
		const processed_json = new Array()
		for (i = 0; i < data.length; i++) {
			processed_json.push([moment(data[i].ts).valueOf(), data[i].message.apower]);
		}
		Highcharts.setOptions({global: { useUTC: false } });
		liveChart = Highcharts.chart('chart', {	

					chart: {
		      		zoomType: 'x',
		      },

					rangeSelector: {
							allButtonsEnabled: true,
							enabled: true,

							buttons: [{
			                    count: 10,
			                    type: 'minute',
			                    text: '10m'
			                }, {
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
								type: 'all',
								text: 'all'
							}],
					},

		      title: {
		      		text: 'Real time power consumption - ' + moment().format("dddd, MMMM Do YYYY")
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
					    gapSize : 2,
					    tooltip: {
					        valueDecimals: 4
					    }
					 }]
				})

		let initializing = true;

			query.observeChanges({
	        added: function(id, doc) {
	            if (!initializing) {
	            	const newPoint = new Array();
	            	newPoint.push(moment(doc.ts).valueOf(), doc.message.apower);
	            	// console.log(newPoint);
	                liveChart.series[0].addPoint(newPoint, true, true);
	            }
	        }
	    });

		initializing = false;
	});
})

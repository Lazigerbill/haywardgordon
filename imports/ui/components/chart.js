import './chart.html';
// import { Highcharts } from 'highcharts';
var Highcharts = require('highcharts/highstock');
import { Machines } from '../../api/machines/machines.js';

Template.chart.onCreated(function(){
	const startTime = new Date(new Date().setTime(new Date().getTime()-129600000));
	this.subscribe("meterData", function(){
		const query = Machines.find({ts:{$gte:startTime}});
		const data = query.fetch();
        // test
        console.log("fetch!!")
		const processed_json = new Array()
		for (i = 0; i < data.length; i++) {
			processed_json.push([Date.parse(data[i].ts), data[i].message.apower]);
		}
		liveChart = Highcharts.chart('chart', {
			chart: {
                zoomType: 'x'
            },
            rangeSelector: {
                selected: 1
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
	            	newPoint.push(Date.parse(doc.ts), doc.message.apower);
	            	console.log(newPoint);
	                liveChart.series[0].addPoint(newPoint, true, true);
	            }
	        }
	    });
		initializing = false;
	});
})


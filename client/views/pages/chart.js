import Highcharts from 'highcharts/highstock';
import { Template } from 'meteor/templating';
import { Machine1 } from '/db/mongo.js';
import { Meteor } from 'meteor/meteor';



Template.graphHighChart.onCreated(function () {
    this.subscribe('chartArray').ready(function(){
        var cursor = Template.currentData(),
        query = Machine1.find(),
                    initializing = true, // add initializing variable, see:  http://docs.meteor.com/#/full/meteor_publish
                    liveChart;  

        // Create basic line-chart:
        liveChart = Highcharts.chart(cursor.chart_id, {
            title: {
                text: 'Number of elements'
            },
            series: [{
                type: 'line',
                name: 'Tasks',
                data: [query.count()]
            }]
        });        
    });
    
});
        // Add watchers:
    //     query.observeChanges({
    //         added: function () {
    //             if (!initializing) {
    //                     // We will use Highcharts API to add point with "value = previous_value + 1" to indicate number of tasks
    //                     var points = liveChart.series[0].points;
    //                     liveChart.series[0].addPoint(
    //                         [query.ts]
    //                         );
    //                 }
    //             }
    //         });   
    //     initializing = false;
    // });
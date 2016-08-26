


Meteor.methods({
	'connectBroker': function() {
			// code to run on user login
			console.log('connecting to broker...');
		  	const client  = mqtt.connect({
		  		// Reads variables from file "development_env.json" located in root
		  		// you have to start meteor and load this file using command "meteor --settings development_env.json"
		  		host: Meteor.settings.mqtt.host,
		  		port: 1883,
		  		username: Meteor.settings.mqtt.username,
		  		password: Meteor.settings.mqtt.password,
		  		clientId: Meteor.settings.mqtt.clientId + this.userId + 'server'
		  	});
		  
		client.on('connect', function () {
		  	client.subscribe('iot-2/type/Accuvim001/id/+/evt/+/fmt/+');
		  	console.log('connected: ' +  client.options.clientId);
		});

		client.on('reconnect', function () {
		  	console.log('reconnecting');
		});
		  
		client.on('message', Meteor.bindEnvironment(function callback(topic, message) { 
		  	console.log(message.toString());

		    // save into database
		    Machine1.insert({
		    	message: JSON.parse(message.toString()).d,
		    	ts: JSON.parse(message.toString()).ts
		    });
		    // Meteor.publish('mqttdata', function() {
		    //   return Machine1.findOne({}, {sort: {time: -1, limit: 1}}).message.d
		    // })
		}));
	},
	'disconnectBroker' : function() {
		const client  = mqtt.connect({
		  		// Reads variables from file "development_env.json" located in root
		  		// you have to start meteor and load this file using command "meteor --settings development_env.json"
		  		host: Meteor.settings.mqtt.host,
		  		port: 1883,
		  		username: Meteor.settings.mqtt.username,
		  		password: Meteor.settings.mqtt.password,
		  		clientId: Meteor.settings.mqtt.clientId + this.userId
		  	});
		client.end(true);
		client.on('close', function(){
			console.log(client.options.clientId + ' disconnected from broker.')
		});
	}
});
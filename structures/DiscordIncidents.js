(async function() {
	const {StatuspageUpdates} = require("statuspage.js");

	const updates = new StatuspageUpdates("srhpyqt94yxb", 10000);


	updates.on('start', e => console.log('Started at:', e.time));
	updates.on('run', e => console.log('Run at:', e.time));
	updates.on('incident_update', e =>
		console.log('Update!', e.incidents[0].incident_updates[0].body)
	);
	updates.on('stop', e => console.log('Stopped at:', e.time));

	updates.start().catch(console.error);
}());
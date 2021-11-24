var fs = require("fs");

export default function multiWrite(table, data, region, id, key, endpoint, cb) {
	var AWS = require("aws-sdk");

	let config = {
		region: region,
		accessKeyId: id,
		secretAccessKey: key,
	}
	if (endpoint) {
        console.log('running endpoint')
		config.endpoint = "http://localhost:8000";

	}

	AWS.config.update(config);
	var db = new AWS.DynamoDB.DocumentClient();
	const wait = (ms) => new Promise((res) => setTimeout(res, ms));

	// Build the batches
	var batches = [];
	var current_batch = [];
	var item_count = 0;
	for (var x in data) {
		// Add the item to the current batch
		item_count++;
		current_batch.push({
			PutRequest: {
				Item: data[x],
			},
		});
		// If we've added 25 items, add the current batch to the batches array
		// and reset it
		if (item_count % 25 == 0) {
			batches.push(current_batch);
			current_batch = [];
		}
	}
	// Add the last batch if it has records and is not equal to 25
	if (current_batch.length > 0 && current_batch.length != 25)
		batches.push(current_batch);

	// Handler for the database operations
	var completed_requests = 0;

	function handler(request, unprocessedDepth = 0, errorDepth = 0) {
		return function (err, data) {
			console.log(data);
			// retry if error
			if (err) {
				console.log(err);
				if (errorDepth <= 7) {
					wait(2 ** errorDepth * 10);
					console.log("going for retry from error");
					db.batchWrite(
						request,
						handler(request, unprocessedDepth, errorDepth + 1)
					);
				}
			}
			// retry with unprocessed items
			else if (Object.keys(data.UnprocessedItems).length > 0) {
				let newParams = {
					RequestItems: {
						table: [data.UnprocessedItems[table]],
					},
				};
				if (unprocessedDepth <= 7) {
					wait(2 ** unprocessedDepth * 10);
					console.log("going for retry from unprocessed");
					console.log(newParams);
					db.batchWrite(
						newParams,
						handler(newParams, unprocessedDepth + 1, errorDepth)
					);
				}
			} else {
				// Increment the completed requests
				completed_requests++;

				// Make the callback if we've completed all the requests
				if (completed_requests == batches.length) {
					cb("no errors");
				}
			}
		};
	}

	// Make the requests
	var params;
	for (x in batches) {
		// Items go in params.RequestItems.id array
		// Format for the items is {PutRequest: {Item: ITEM_OBJECT}}
		params = '{"RequestItems": {"' + table + '": []}}';
		params = JSON.parse(params);
		params.RequestItems[table] = batches[x];

		// Perform the batchWrite operation
		db.batchWrite(params, handler(params));
	}
}

// var data = JSON.parse(fs.readFileSync('access_permissions.json', 'utf8'));

// multiWrite(table, data, (err) => {
//     if (err) console.log(err);
// })

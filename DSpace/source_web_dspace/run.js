
var c = context;

var importLimit = 0;
if(parseInt(c.node.settings.limit))
	importLimit = parseInt(c.node.settings.limit);


// we must remove rest part from dspace_url (usually "/rest")
var splitted = context.node.params.required_dspace_url.split("/");
var dspace_url_stripped = splitted.slice(0, splitted.length-1).join("/");

if (core.response && core.response.statusCode == 200 ) {
	// count query rounds
	c.vars.round_counter++;

	if (core.data.items && core.data.items.length > 0) {
		
		out.say("progress", "procesed so far " + context.vars.record_counter );
		var imports = [];
		var updates = [];
		
		for (var i = 0; i < core.data.items.length; i++) {

			// count records 
			context.vars.record_counter++;
			imports.push(makeRecord(core.data.items[i])); // this adds some fields to the original data
			
			// obey import limit
			if(importLimit && context.vars.record_counter >= importLimit)
				break;
			
			if(context.node.settings.mode === "update" && context.node.settings.update_key) {
				if(!context.records.includes(core.data.items[i][context.node.settings.update_key])) { 
					updates.push(makeRecord(core.data.items[i]));
					context.vars.update_counter++;
				}
			} 
		}

		// OUTPUT
		if(context.node.settings.mode === "update")
			out.value = updates;
		else
			out.value = imports;
		
		// URL for next round
		var offset = c.vars.round_counter * c.vars.limit;
        if(core.data["unfiltered-item-count"] == context.vars.limit)  { /* check if there is any data left on the server */
             core.options.url = context.node.params.required_dspace_url + "/filtered-items" + context.node.settings.query + '&limit=' + c.vars.limit + '&offset=' + c.vars.round_counter * c.vars.limit; 
		 } else {
			 core.options.url = null;
		 }
        
        // stop if import limit set by user is reached
        if(importLimit && context.vars.record_counter >= importLimit)
			core.options.url = null;
			
        out.say("progress", "Items fetched: " + context.vars.record_counter); 

	} else {
		out.say("progress", "no items found");
		out.value = null;
	}

}


function makeRecord(item) {

	// METADATA
	// expand metadata to arrays (key + "__lang" holds the language code)
	if (item.metadata && Array.isArray(item.metadata)) {
		// create arrays for every key
		for (var j = 0; j < item.metadata.length; j++) {
			var key = item.metadata[j].key;
			
			key = key.replace(/\./g, "_");
			item[key] = [];
			item[key + "__lang"] = [];
			
		}
		
		// push values to array
		for (var j = 0; j < item.metadata.length; j++) {
			var key = item.metadata[j].key;
			//out.say("progress", key);
			key = key.replace(/\./g, "_");
			item[key].push(item.metadata[j].value);
			item[key + "__lang"].push(item.metadata[j].language);
		}

	}
	
	// BITSTREAMS
	item["bitstream_original_file_url"] = [];
	item["bitstream_original_name"] = [];
	item["bitstream_original_format"] = [];
	item["bitstream_thumb_file_url"] = [];
	item["bitstream_thumb_format"] = [];
	
	if (item.bitstreams && item.bitstreams.constructor.name == "Array") {
		for (var j = 0; j < item.bitstreams.length; j++) {
			if (item.bitstreams[j].bundleName == "ORIGINAL" && item.bitstreams[j].type == "bitstream") {
				item["bitstream_original_file_url"].push(dspace_url_stripped + item.bitstreams[j].retrieveLink);
				item["bitstream_original_name"].push(item.bitstreams[j].name);
				item["bitstream_original_format"].push(item.bitstreams[j].format);
			}
			if (item.bitstreams[j].bundleName == "THUMBNAIL" && item.bitstreams[j].type == "bitstream") {
				item["bitstream_thumb_file_url"].push(dspace_url_stripped + item.bitstreams[j].retrieveLink);
				item["bitstream_thumb_format"].push(item.bitstreams[j].format);
			}
		}
	}
	return item;
}

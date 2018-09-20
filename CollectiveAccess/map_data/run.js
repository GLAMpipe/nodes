

var item = {
	"intrinsic_fields": {
		"type_id":"26"
	},
	"preferred_labels":[
		{
			"locale":"en_US",
			"name":"GLAMpipe kukka"
		}
	],
	"attributes": {}
};

out.value = item;
context.success_count++;

var is_static = /^_static_/;
var is_dynamic = /^_dynamic_/;


// handle static values
/*for(var key in context.node.settings) {
	if(is_static.test(key)) {
		var plain_key = key.replace("_static_", "");
		if(context.node.settings[key])
			pushField(item, context.node.settings[key], plain_key);
	}
}
*/

// then override with dynamic values if set
for(var key in context.node.settings) {
	var value = context.doc[context.node.settings[key]];
	// value might be undefined
	if(!value)
		value = "";
		
	var language = "";

	// set type of the item
	if(key === "_static_type_id") {
		item.intrinsic_fields.type_id = context.node.settings[key];
	}

	// handle preferred labels
	if(key === "_dynamic_preferred_labels_name") {
		var label = {"locale": "fi_FI"};
		label.name = getFirstValue(value);
		item.preferred_labels = [label];
	} else if(key === "_dynamic_preferred_labels_displayname") {
		var label = {"locale": "fi_FI"};
		label.displayname = getFirstValue(value);
		item.preferred_labels = [label];
	// idno
	} else if(key === "_dynamic_idno") { 
		item.intrinsic_fields.idno = getFirstValue(value);
		
	// handle attributes
	} else if(is_dynamic.test(key)) {

		var plain_key = key.replace("_dynamic_", "").split("-");
		var attribute = plain_key[0]; 
		if(context.doc[context.node.settings[key]]) {

		   if(Array.isArray(value)) {
			   item.attributes[attribute] = [];
			   for (var i = 0; i < value.length; i++ ) { 
					var ob = {}
					ob[plain_key[1]] = value[i];
					item.attributes[attribute].push(ob);
					//pushField(item, value[i], plain_key, language);	
			   }
			} else { 

				//pushField(item, value, plain_key, language);	
			}
		}
	}
}



if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);



/*********************** FUNCTIONS *********************/

function splitValue (val) { 
   if( typeof val == "string") { 
       var arr = val.split("||"); 
       return arr 
   } else if ( typeof val == "number") {
       return val; 
   }
}

function getFirstValue(value) {
	if(Array.isArray(value)) {
		return value[0];
	} else {
		return value;
	}
}

function pushField (item, value, key, language) {

	if(typeof value === "string")
		value = value.trim();

	key = key.replace(/_/g, ".");

	// do not add key if there is no mapped key
	if(value !== null && value !== "") { 
		// if array separator is set, then split values
		if(context.node.settings.array_separator != "") {
			
			var arr = splitValue(value);
			if(arr.constructor.name == "Array") {
				for(var i = 0; i < arr.length; i++) {
					var field = {"key": key, "value": arr[i], "language": language};
					item.metadata.push(field);
				}
			} else {
				var field = {"key": key, "value": value, "language": language};
				item.metadata.push(field);				
			}
			
		} else {
			
			var field = {"key": key, "value": value, "language": language};
			item.metadata.push(field);
		}
	}
}





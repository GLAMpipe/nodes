

var item = {
	"intrinsic_fields": {
		"type_id":"26"
	},
	"preferred_labels":[
		{
			"locale":"fi_FI",
			"name":"GLAMpipe kukka"
		}
	],
	"attributes": {}
};

out.value = item;

var is_static = /^_static_/;
var is_dynamic = /^_dynamic_/;


// set type of the item
var type = getFirstValue(context.doc[context.node.settings.type_field]);

// we can map only if type id is set
if(type && context.node.settings["_typemap_" + type] != "") {
	item.intrinsic_fields.type_id = context.node.settings["_typemap_" + type];
	setMappings();
	context.success_count++;
} else if (context.node.settings.type_default != "") {
	item.intrinsic_fields.type_id = context.node.settings.type_default;
	setMappings();
	context.success_count++;
} else {
	out.value = "[not mapped]";
	context.not_mapped++; 
}



if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);



/*********************** FUNCTIONS *********************/


function setMappings() {

	for(var key in context.node.settings) {
		var value = context.doc[context.node.settings[key]];
		// value might be undefined
		if(!value)
			value = "";
			
		var language = "";

		// handle preferred labels
		if(key === "_dynamic_preferred_labels_name") {
			var label = {};
			label.locale = getLocale("_dynamic_preferred_labels")
			label.name = getFirstValue(value);
			item.preferred_labels = [label];
		} else if(key === "_dynamic_nonpreferred_labels_name") {
			var label = {};
			label.locale = getLocale("_dynamic_nonpreferred_labels")
			label.name = getFirstValue(value);
			item.nonpreferred_labels = [label];
		} else if(key === "_dynamic_preferred_labels_displayname") {
			var label = {};
			label.locale = getLocale("_dynamic_nonpreferred_labels")
			label.displayname = getFirstValue(value);
			item.preferred_labels = [label];
		// idno
		} else if(key === "_dynamic_idno") { 
			item.intrinsic_fields.idno = getFirstValue(value);
		// idno
		} else if(key === "_dynamic_media") { 
			item.intrinsic_fields.media = getFirstValue(value);
			

		// handle attributes
		} else if(is_dynamic.test(key)) {

			var plain_key = key.replace("_dynamic_", "").split("-");
			var attribute = plain_key[0]; 
			if(context.doc[context.node.settings[key]]) {
				item.attributes[attribute] = [];
				if(Array.isArray(value)) {
				   for (var i = 0; i < value.length; i++ ) { 
						var ob = {}
						ob[plain_key[1]] = value[i];
						item.attributes[attribute].push(ob);
				   }
				} else { 
					var ob = {}
					ob[plain_key[1]] = value;
					item.attributes[attribute].push(ob);	
				}
			}
		}

	}
}

// try to find locale for field
function getLocale(field) {
	// locale field names 
	var locale = context.doc[context.node.settings[field.replace("_dynamic_","_locale_")]];
	if(!locale) {
		locale = context.node.settings["_locale_default_locale"];
		if(!locale) locale = "en_US"; // default of default
	}
	return locale;
}

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





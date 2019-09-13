/*
note on language extract:
array rows must match between values and language codes!

*/

var record = context.data;
var new_record = {};
out.value = new_record;

if(!(context.vars.count % 100)) 
	out.say("progress", context.vars.count + " imported");
	
context.vars.count++;

if(context.node.settings.mode === "append" && context.node.settings.update_key) {
	if(context.records.indexOf(record[context.node.settings.update_key]) === -1) {
		out.console.log(record[context.node.settings.update_key] )
		insert();
	} else {
		out.value = null;
	}
} else {
	insert();
}

function insert() {

	for(var prop in record) {
		if (record.hasOwnProperty(prop)) {
			prop_clean = cleanFieldName(prop);
			new_record[prop_clean]  = processValue(record[prop]);
		}
	}
	
	// add default key/value if desired
	if(context.node.settings.default_key && context.node.settings.default_value) {
		if(!new_record[context.node.settings.default_key]) {
			new_record[context.node.settings.default_key] = context.node.settings.default_value;
		}
	}
}



function processValue (value) {
	if(context.node.settings.split && context.node.settings.split != "") {
		var arr = value.split(context.node.settings.split);
		
		// trim
		if(context.node.settings.trim) {
			arr = arr.map(function (e) {
				return e.trim();
			});
		}
		
		// skip empty
		if(context.node.settings.skip) {
			arr = arr.filter(Boolean)
		}
		
		return arr;
		
	} else {
		// skip
		if(context.node.settings.skip)
			if(value == "")
				return [];
		// trim
		if(context.node.settings.trim) {
			value = value.trim();
			if(context.node.settings.skip)
				if(value == "")
					return [];
			return [value];
		}
		else
			return [value];
	}	
}

function cleanFieldName (field) {

	// clean up key names (remove -. and convert spaces to underscores)
	prop_trimmed = field.trim().toLowerCase();
	prop_clean = prop_trimmed.replace(/[\s.]/g, '_');
	
	if(context.node.settings.extract_language) {
		prop_clean = prop_clean.replace(/\[(.|..|)\]$/, ''); // remove language code from field name ("[en]")
		return  prop_clean.replace(/_..$/, ''); // remove language code from field name ("_en")
	} else
		return prop_clean;

}

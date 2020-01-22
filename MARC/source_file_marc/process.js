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

// FIRST ROUND
// create arrays for every key with clean field name
for(var prop in record) {

	if (record.hasOwnProperty(prop)) {

		prop_clean = cleanFieldName(prop);
		var values = processValue(record[prop]);
		new_record[prop_clean]  = values;
	}
}



function processValue (value) {
	if(context.node.settings.split && context.node.settings.split != "") {
		var arr = value.split(context.node.settings.split);
		
		// trim separated values
		if(context.node.settings.trim === "true") {
			arr = arr.map(function (e) {
				return e.trim();
			});
		}
		
		// skip empty
		if(context.node.settings.skip === "true") {
			arr = arr.filter(Boolean)
		}
		
		return arr;
		
	} else {
		return value;
	}	
}

function cleanFieldName (field) {

	// clean up key names (remove -.[] and convert spaces to underscores)
	var field_clean = field.trim().toLowerCase();
	field_clean = field_clean.replace(/\./g, '_');
	return field_clean;


}

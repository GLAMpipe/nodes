
var value = context.doc[context.node.settings.in_key_field];
//if(Array.isArray(value)) value = value[0];

var fields = {_id:0}
out.pre_value = [];

if(context.node.settings.copy_fields == '*') {  // '*' means get all fields
	fields = {};
} else {
	var fields_arr = context.node.settings.copy_fields.split(",").map(function(item) {
	  return item.trim();
	});

	for(var field of fields_arr) {
		fields[field] = 1;
	}
}

if(Array.isArray(value)) {
	for(var v of value) {
		var mongo = {query:{}};
		mongo.query[context.node.settings.lookup_key_field] = v;
		mongo.fields = fields;
		out.pre_value.push(mongo);
	}
} else {
	var mongo = {query:{}};
	mongo.query[context.node.settings.lookup_key_field] = value;
	mongo.fields = fields;
	out.pre_value.push(mongo);
}



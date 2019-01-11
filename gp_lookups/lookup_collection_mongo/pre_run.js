
var value = context.doc[context.node.settings.in_key_field];
if(Array.isArray(value)) value = value[0];

var fields = {_id:0}
var fields_arr = context.node.settings.copy_fields.split(',');
for(var field of fields_arr) {
	fields[field] = 1;
}

out.pre_value = {query: {}, fields: fields};
out.pre_value.query[context.node.settings.lookup_key_field] = value;

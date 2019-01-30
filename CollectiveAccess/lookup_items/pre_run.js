

var id = context.doc[context.node.settings.lookup_id];
var model = context.node.settings.model;
var fields = context.node.settings.lookup_fields;
out.console.log(fields)
var j =   {  "bundles" : {}};

for(var field in fields) {
	if(fields[field] == 'true') {
		var k = field.replace('__', '.');
		j.bundles[k] = {};
	}
}

var options = {
	url: context.vars.url + id + '?authToken=' + context.node.settings.token,
	method: 'POST',
	body: JSON.stringify(j)
}


out.pre_value = options;

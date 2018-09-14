
var base = context.node.params.required_url;

// we must output array of options for Request module
var uuid = null;

// handle array
if(Array.isArray(context.doc[context.node.settings.in_item_uuid])) {
	uuid = context.doc[context.node.settings.in_item_uuid][0];
	
// check if we have static values (eg. REST-api call from external app)
} else if(context.node.settings.item_uuid_static) {
	uuid = context.node.settings.item_uuid_static;
	
} else {
	uuid = context.doc[context.node.settings.in_item_uuid];
}

if(uuid) {
	out.pre_value = [];
	options = {
		url: base + "/items/" + uuid + "/bitstreams",
		method: 'GET',
		jar: true
	}
	out.pre_value = options;
	out.console.log(options)

} else {
	context.error = out.error_marker + "No UUID found!"
}



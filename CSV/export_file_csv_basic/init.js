
var fields = [];
if(context.node.settings.fields) {
	for(var field in context.node.settings.fields) {
		if(context.node.settings.fields[field] == "true")
			fields.push(field);
	}
}

out.csvheaders = fields;
out.filename = context.node.settings.required_file;
if(!out.filename) out.init_error = "File name is missing!"


// here we generate POST request options

var in_field_value = context.doc[context.node.params.in_field];


// we assume that text is string or string in first row in array
if(Array.isArray(in_field_value)) {
		
	core.options = createOptions(in_field_value[0]);

} else {

	core.options = createOptions(in_field_value);
	
}

out.console.log(core.options)

function createOptions(text) {

	return {
		method: "POST",
		url:  context.node.params.las_server + "/baseform",
		headers: {Accept: "application/json"},
		form: {
			text: 		text, 
		}
	}
}



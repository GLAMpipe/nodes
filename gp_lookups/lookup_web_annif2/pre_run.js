
// here we generate POST request options

out.method = "post";
var in_field_value = context.doc[context.node.params.in_field];

if(context.node.settings.threshold == "") context.node.settings.threshold = "0.0";
var project = annifProject();

// we assume that text is string or first row in array
if(Array.isArray(in_field_value)) {
		
	out.pre_value = createOptions(in_field_value[0], project);

} else {

	out.pre_value = createOptions(in_field_value, project);
	
}


function createOptions(text, project) {

	return {
		method: "POST",
		url:  "http://api.annif.org/v1/projects/" + project + "/analyze",
		headers: {Accept: "application/json"},
		form: {
			text: 		text, 
			maxhits: 	parseInt(context.node.settings.maxhits),
			threshold: 	parseFloat(context.node.settings.threshold)
		}
	}
}

function annifProject(index) {
	if(context.node.settings._dynamic_language) {
		return context.node.settings.project + "-" + context.doc[context.node.settings._dynamic_lang];
	} else {
		return context.node.settings.project + "-" + context.node.settings._static_lang;
	}
}


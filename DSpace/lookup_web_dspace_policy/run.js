

out.value = "";

function process (element, index) {
	out.console.log(element);
	if(element.error) {
		out.value = out.error_marker + ":" + element.error.message;
	} else if (element.response && element.response.statusCode) {
		out.value = element.response.statusCode.toString();
		context.vars.success_counter++;		
	} else {
		out.value = out.error_marker;

	}
}

if(Array.isArray(core.response)) {
	out.value = [];
	for(response of core.response) {
		out.value.push(JSON.parse(core.response[0].body))
	}
}

/*
//process(context.data);
if(context.error) {
	out.value = out.error_marker + context.error;
}else if(core.data && core.response.statusCode === 200) {
	out.value = context.data;
} else if(core.response) {
	out.value = out.error_marker + core.response.statusCode.toString();
} else {
	out.value = out.error_marker;
}

*/

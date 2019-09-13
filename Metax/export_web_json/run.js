
out.setter = {};

if(core.error) {
	if(core.error.message) out.setter[context.node.params.out_link] = out.error_marker + core.error.message;
	else out.setter[context.node.params.out_link] = out.error_marker + core.error;
} else if(core.data && core.data.statusCode == 201) {
	context.success_count++;
	var data = core.data.body;
	out.setter[context.node.params.out_response] = data;
	out.setter[context.node.params.out_link] = context.node.params.required_url + "/datasets/" + data.id;
}



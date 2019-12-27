
out.setter = {};

if(core.error) {
	out.setter[context.node.params.out_status] = out.error_marker + core.error;
	out.setter[context.node.params.out_field] = out.error_marker + core.error;
} else if(core.data && core.data.statusCode == 200) {
	context.success_count++;
	out.setter[context.node.params.out_status] = "200";
	out.setter[context.node.params.out_field] = core.data.body;

} else {
	out.setter[context.node.params.out_status] = core.data.statusCode.toString();
	out.setter[context.node.params.out_field] = core.data.body;
}



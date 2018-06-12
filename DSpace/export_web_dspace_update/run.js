if(context.error) {
	out.setter[context.node.params.out_link] = out.error_marker + context.error;
} else if(context.skip) {
	out.value = "skipped";
} else if(context.response) {
	context.success_count++;
	out.value = context.response.statusCode.toString();
}

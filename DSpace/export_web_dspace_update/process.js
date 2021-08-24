if(context.error) {
	out.setter[context.node.params.out_link] = out.error_marker + context.error;
} else if(context.skip) {
	out.value = "skipped";
} else if(core.response) {
	context.success_count++;
	out.value = core.response.status.toString();
}


out.setter = {};

if(core.response && core.response.data && core.response.status === 200) {
	if(core.response.data.result.length)
		context.vars.success_counter++;
	out.setter[context.node.params.out_result] = core.response.data;
}
out.setter[context.node.params.out_match] = '' // reset match field


if(parseInt(context.count) % 10 == 0)
	out.say('progress', context.node.type.toUpperCase() + ': processed ' + context.count + '/' + context.doc_count);

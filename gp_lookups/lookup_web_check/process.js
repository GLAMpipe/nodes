

if(core.response) {
	if(Array.isArray(core.response)) {
		out.value = []
		for(var res of core.response) {
			out.console.log(res)
			out.value.push(res.status.toString())
		}
	}
} else {
	out.value = 'AAAA_error: request failed'
}


if(parseInt(context.count) % 10 == 0)
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);

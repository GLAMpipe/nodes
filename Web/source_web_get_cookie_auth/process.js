
var c = context;
out.value = null;

context.vars.record_counter++
//out.say("progress", "processing " + context.vars.record_counter)

if (core.response) {
	if(Array.isArray(core.response)) {

		out.value = []
		for(var resp of core.response) {

			if(resp.status == 200) {
				out.value.push(resp.data)
			} else {
				if(resp.data) out.value.push('AAAA_error ' + resp.status + ': ' +resp.data)
				else out.value.push(resp.status)
			}
		}
	} else {

		if(core.response.status == 200) {
			if (core.response.data) {
				out.value = core.response.data
			} else {
				out.say("progress", "no JSON found");
			}
		} else {
			if(core.response.data) out.value = core.response.status + ':' + core.response.data
			else out.value = core.response.status
		}
	}

} else {
	out.value = 'AAAA_error'
}


out.value = "";

// query result output as json
var data = context.data;
out.console.log(out.pre_value)
out.console.log(data)

// check errors in request (for example 404)
if(context.error) {
	out.value = out.error_marker + context.error;
	
// check errors in query
} else if(data && data.results) {
	out.value = data.results;
	context.vars.success_counter++;
}

out.say('progress', context.count + '/' + context.doc_count + ' processed...');


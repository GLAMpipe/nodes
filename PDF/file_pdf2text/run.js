

/*
 * core.files: input for PDF.totext
 * core.error: erros from PDF.totext
 * core.data: result from PDF.totext
 * context.doc: current document
 * 
*/

var out_info_field = context.node.params.out_info;
var out_text_field = context.node.params.out_text;
out.setter = {};

if(core.error) {
	out.setter[out_info_field] = core.error;
	out.setter[out_text_field] = "error";
} else {
	if(core.data) {
		if(core.data.info)
			out.setter[out_info_field] = core.data.info;
		if(context.data.text)
			out.setter[out_text_field] = core.data.text;
		context.vars.success_count++;
		out.say("progress", context.vars.success_count + " extracted..." );
	}
}

out.value = "test"

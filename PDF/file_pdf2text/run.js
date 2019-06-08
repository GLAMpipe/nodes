

/*
 * core.files: input for PDF.totext
 * core.error: erros from PDF.totext
 * core.data: result from PDF.totext
 * context.doc: current document
 * 
 * this must output something like this
 * {'pdf_text':'text that was extracted',
 * 'pdf_info': 'info'}
*/

var out_info_field = context.node.params.out_info;
var out_text_field = context.node.params.out_text;
out.setter = {};

if(core.data) {
	// if core.data is array, then it means that input was array and we must output an array
	if(Array.isArray(core.data)) {
		out.setter[out_info_field] = [];
		out.setter[out_text_field] = [];
		for(var row of core.data) {

			if(row.error) {
				out.setter[out_info_field].push(GP.error + row.error);
			} else  {
				out.setter[out_info_field].push(row.info || '');
				out.setter[out_text_field].push(row.text || '');
			}
		}
	// else we output the core result
	} else {
		if(row.error) {
			out.setter[out_info_field] = GP.error + row.error;
		} else {
			out.setter[out_info_field] = core.data.info || core.data.error || ''
			out.setter[out_text_field] = core.data.text || core.data.error || ''
		}
	}

	context.vars.success_count++;
	out.say("progress", context.vars.success_count + " extracted..." );
}


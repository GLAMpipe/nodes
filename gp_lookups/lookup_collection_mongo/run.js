

out.value = '';
var prefix = context.node.settings.prefix;


if(context.data) {
	if(Array.isArray(context.data)) { 
		// if there is 1 match, then output result as it is
		if(context.data.length == 1) {

			// if prefix is given, we rename fields with it
			if(prefix != '') {
				var data = context.data[0];
				out.setter = {};
				for (var i in Object.entries(data)) {
					out.setter[prefix + Object.entries(data)[i][0]] = Object.entries(data)[i][1];
				}
			// else we just output the result
			} else {
				out.setter= context.data[0];
			}

		} else {
			out.setter = null;
		}
	}
} 



// report progress
if(parseInt(context.count) % 100 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);


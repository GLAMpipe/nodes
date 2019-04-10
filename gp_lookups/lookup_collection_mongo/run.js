

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
				
				// if lookup is for one ID only, then we take all rows of fields as they are (1-1 relation)
				if(context.node.settings.mode == 'single_id') {
					for (var i in Object.entries(data)) {
							out.setter[prefix + Object.entries(data)[i][0]] = Object.entries(data)[i][1];
					}
					
				// if lookups is made for multiple IDs, then we take only first row of each field (get values by id)
				} else if(context.node.settings.mode == 'multiple_id') {
					for (var i in Object.entries(data)) {
						if(Array.isArray(Object.entries(data)[i][1])) {
							//we take only the first row of data array
							out.setter[prefix + Object.entries(data)[i][0]] = Object.entries(data)[i][1][0];
						} else {
							out.setter[prefix + Object.entries(data)[i][0]] = Object.entries(data)[i][1];
						}
					}					
				}
			// else we just output the result
			} else {
				out.setter= context.data;
			}
		// else we write nothing (TODO: this might need to do something else)
		} else {
			out.setter = null;
		}
	}
} 



// report progress
if(parseInt(context.count) % 100 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);




out.value = '';
context.count++;

if(context.data) {
	if(Array.isArray(context.data)) { 
		// if there is 1 match, then output result as it is
		if(context.data.length == 1) {
			out.setter = context.data[0];
		}
	}
} 

// report progress
if(parseInt(context.count) % 100 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);


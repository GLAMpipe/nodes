
out.value 	= "";
var value 	= context.doc[context.node.params.in_field];

// if input is array, then use first row of array as input
if(Array.isArray(value)) value = value[0];

out.value = funcs.xmlparser.xml2json(value, {ignoreAttributes : false});

if(!(context.vars.count % 1000)) 
	out.say("progress", context.vars.count + " processed...");

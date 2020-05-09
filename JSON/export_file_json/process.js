var c = context;
var obj = {}

for(var key of core.options.keys) {

	obj[key] = c.doc[key]

};

context.count++;


if(parseInt(context.count) % 100 == 0) 
    out.say('progress', context.node.type.toUpperCase() + ': processed ' + context.count + '/' + context.doc_count);

out.value = JSON.stringify(obj) + "\n"

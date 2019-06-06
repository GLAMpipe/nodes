

var filenames = context.doc[context.node.params.in_field];
core.files = ''

if(Array.isArray(filenames)) {
	var paths = [];
	filenames.forEach(function(filename, index) {
		if(filename)
			paths.push(getPath(context.node.params.filepath, filename));
		else
			paths.push("");
	})
	core.files = paths;
} else {
	if(filenames)
		core.files = getPath(context.node.params.filepath, context.doc[context.node.params.in_field]);
	else
		paths.push("");
}


function getPath(path, filename) {
    if(path)
        return context.path.join(path, filename)
    else
        return filename;
        
}



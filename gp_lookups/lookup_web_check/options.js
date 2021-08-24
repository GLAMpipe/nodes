
var base = context.node.settings.base_url;

// we must output array of URLs
if(Array.isArray(context.doc[context.node.params.in_field])) {
	core.options = [];
	var urls = context.doc[context.node.params.in_field];
	urls.forEach(function(url) {
		var options = {
			url:base + url,
			method: 'HEAD'
		}
		core.options.push(options);
	})
} else {
	var options = {
		url:base + context.doc[context.node.params.in_field],
		method: 'HEAD'
	}
	core.options = options;
}


var part_1 = context.doc[context.node.settings.url_part_1]
if(Array.isArray(part_1)) {
	core.options = []
	for(var url of part_1) {
		var opt = {
			url: context.node.settings.url_start + encodeURIComponent(url) + context.node.settings.url_end,
			method: 'GET'
		}
		core.options.push(opt)
	}
} else {
	core.options = {
		url: context.node.settings.url_start + encodeURIComponent(part_1) + context.node.settings.url_end,
		method: 'GET'
	}
}
out.console.log(core.options)

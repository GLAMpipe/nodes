var base_url = context.node.params.required_url;
var uuid = 'a2ed91a3-a0eb-499d-9b06-6d127ff3336e'
uuid = context.doc[context.node.settings.in_uuid]
var name = context.doc[context.node.settings.in_file_title]
name = name.replace(/'/g,'')
name = name.replace(/ /g,'_')

core.options = {
	url: base_url + "/items/" + uuid + "/bitstreams?name=" + name + ".pdf",
	method: 'POST'
};

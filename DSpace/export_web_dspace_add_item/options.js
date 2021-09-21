

var base_url = context.node.params.required_url;
var item = context.doc[context.node.params.in_field];
var collection = context.node.settings.collection;
var out_link = context.doc[context.node.params.out_link];


var options = {
	url: base_url + "/collections/" + collection + "/items/",
	data: item,
	method: 'POST'
};



// if there is an url in out_link, then we do not run again
if(out_link && typeof out_link == "string" && out_link.match(/^http/))
	options.skip = true;

// do not proceed with empty content
if(item)
	core.options = options;


if(parseInt(context.count) % 10 == 0)
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);

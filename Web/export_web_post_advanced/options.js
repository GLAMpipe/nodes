

var serie = "JYU dissertations";
var uuid = context.doc['uuid'];

//var item = context.doc[context.node.params.in_field];
var out_link = context.doc[context.node.params.out_field];

var url = "https://jyx-beta.jyu.fi/rest/collections/d0f1f10d-b003-473f-aed2-d4a88e49e5bd/items"

var options = {
	url: url,  // from init.js
	json: true,
	body: {uuid:uuid},
	method: 'PUT',
	headers: {
		"accept": "application/json",
		"Content-Type": "application/json"
	}
};



// if there is an url in out_link, then we do not run again
//if(out_link && typeof out_link == "string" && out_link.match(/^http/))
	//options.skip = true;

// do not proceed with empty content
//if(item)
	core.options = options;


if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);







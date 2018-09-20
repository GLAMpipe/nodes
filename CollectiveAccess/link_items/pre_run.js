

var out_link = context.doc[context.node.params.out_link];

var left_id = context.doc[context.node.settings.in_left];
var right_id = context.doc[context.node.settings.in_right];

var url = "http://localhost/providence/service.php/item/ca_objects/id/" + left_id + "?authToken=" + context.node.settings.token;

var data = {
	"related": {
		"ca_entities": []
	}
}
var entity = {
	"entity_id": right_id,
	"type_id" : 100,
	"direction": "ltor"
}

data.related.ca_entities.push(entity);
	


var options = {
	url: url,
	json: data,
	method: "put",
	headers: {
		"accept": "application/json"
	}
};



// if there is an url in out_link, then we do not run again
if(out_link && typeof out_link == "string" && out_link.match(/^http/))
	context.skip = true;

// do not proceed with empty content
out.pre_value = options;


if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);



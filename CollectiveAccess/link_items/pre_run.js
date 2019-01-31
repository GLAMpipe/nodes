

var out_link = context.doc[context.node.params.out_link];
var url = context.node.params.required_url;

var left_id = context.doc[context.node.settings.in_left];
var right_id = context.doc[context.node.settings.in_right];

var right_type = context.node.settings.right_type;
var default_relation = context.node.settings.default_relation_id;

var type_list = {
	"ca_collections": "collection_id",
	"ca_entities": "entity_id",
	"ca_object_lots": "lot_id",
	"ca_objects": "object_id",
	"ca_occurrences": "occurrence_id",
	"ca_places": "place_id"
}

var url = url + "/item/" + context.node.settings.left_type + "/id/" + left_id + "?authToken=" + context.node.settings.token;

var data = {
	"related": {
		"ca_entities": []
	}
}
data.related[right_type] = [];
var item = {};
item[type_list[right_type]] = right_id;
item.type_id = default_relation;
item.direction = "ltor";
//item.direction = "rtol";

// relationship type mapping
if(context.node.settings.type_field) {
	var type_value = context.doc[context.node.settings.type_field];
	if(context.node.settings["_typemap_" + type_value]) {
		item.type_id = context.node.settings["_typemap_" + type_value];
	}
}

data.related[right_type].push(item);
out.console.log(item);

/*
var item = {
	"entity_id": right_id,
	"type_id" : 100,
	"direction": "ltor"
}
*/
	


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
if(item.type_id && left_id && right_id) {
	out.pre_value = options;
} else {
	var missing = [];
	if(!item.type_id) missing.push("relationship type");
	if(!left_id) missing.push(context.node.settings.left_type + " id");
	if(!right_id) missing.push(context.node.settings.right_type + " id");
	context.error = "Missing parameters: " + missing.join(",");
}


if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);



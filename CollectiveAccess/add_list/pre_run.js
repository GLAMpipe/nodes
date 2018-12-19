
var out_link = context.doc[context.node.params.out_link];

var list_id = context.node.settings["list_id"];
var label =  context.doc[context.node.settings["in_field"]]; 
var label_plural =  context.doc[context.node.settings["in_field_plural"]]; 
var description =  context.doc[context.node.settings["in_field_description"]]; 
var locale = context.node.settings["default_locale"];

if(!label_plural) label_plural = label;
if(!description) description = "";
if(!locale) locale = "en_US"; // default of default

if(Array.isArray(label)) {
	label = label[0];
}

var item = {
	 "intrinsic_fields":{
	   "list_id":list_id,
	   "idno":label,
	   "item_value":label,
		"is_enabled":"1"
	 },
	 "preferred_labels" : [
			{
				"locale": locale,
				"name_singular": label,
				"name_plural": label_plural,
				"description": description
			}
		]		
	}


var options = {
	url: out.url,  // from init.js
	json: item,
	method: "put",
	headers: {
		"accept": "application/json"
	},
	jar:true
};


out.console.log(options)
out.console.log(item)
// if there is an url in out_link, then we do not run again
if(out_link && typeof out_link == "string" && out_link.match(/^http/))
	context.skip = true;

// do not proceed with empty content
if(item && label && list_id) {
	out.pre_value = options;
} else {
	context.error = "Missing parameters";
}


if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);







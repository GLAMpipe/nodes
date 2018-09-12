
        
out.say('progress', 'Starting to upload..'); 
context.counter = 0;
var title_mapped = false;

var rest_url = context.node.params.required_url;
var type = context.node.settings.type;


// ERROR CHECKS
// is type set?
if(context.node.settings.token == "") {
	out.init_error = "You must get auth token first!";
}


// upload url
out.url = rest_url + "/item/" + context.node.settings.item_type + "?authToken=" + context.node.settings.token;

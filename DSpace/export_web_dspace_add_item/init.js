

out.say('progress', 'Starting to upload..');
context.counter = 0;
var title_mapped = false;

var base_url = context.node.params.required_url;
var collection = context.node.settings.collection;


// ERROR CHECKS
// is collection set
if(collection == "") {
	//out.say("error", "You must choose a collection");
	out.init_error = "You must choose a collection";
}


// auth
if(context.node.settings.username) {

	var details = {
		'email': context.node.settings.username,
		'password': context.node.settings.password
	};

	var formBody = [];
	for (var property in details) {
	  var encodedKey = encodeURIComponent(property);
	  var encodedValue = encodeURIComponent(details[property]);
	  formBody.push(encodedKey + "=" + encodedValue);
	}
	formBody = formBody.join("&");

	core.login = {
		url: base_url + "/login",
		method: "POST",
		data: formBody
	}

}

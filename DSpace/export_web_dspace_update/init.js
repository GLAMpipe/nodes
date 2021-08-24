
// check that required settings are set
if(!context.node.settings.in_update_field) {
	out.init_error = "You did not set field for new value!";
} else if(!context.node.settings.in_uuid_field) {
	out.init_error = "You did not set field for item UUID!";

} else {
	context.counter = 0;
	out.say("progress", "Starting to update...");
}

var base_url = context.node.params.required_dspace_url;


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

} else {
	out.init_error = "You did not gibe login credentials";
}



var base_url = context.node.params.required_url;
out.say('progress', 'Starting to add files..');
context.counter = 0;
context.success_counter = 0;

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

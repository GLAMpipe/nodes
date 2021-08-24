

// variables for node
context.vars = {};
context.vars.record_counter = 0;


// auth
if(context.node.settings.username && context.node.settings.login_url) {

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
		url: context.node.settings.login_url,
		method: "POST",
		body: formBody,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
	}

}

console.log(core)

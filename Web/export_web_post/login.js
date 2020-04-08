
// auth
if(context.node.settings.login_type == 'basic') {

	core.options = {
		url: context.node.params.file_url,
		method: 'GET'
	}
	
	core.options.auth = {
		'username': context.node.settings._username,
		'password': context.node.settings._password,
		'sendImmediately': true
	}
} else {

	var options = {
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url: "https://jyx-beta.jyu.fi/rest/login", 
		method: 'POST',
		form: {"email": context.node.settings.username, "password": context.node.settings.password},
		json: true
	};

	core.login = options;		
}

out.say("progress", "Trying to login ..."); 


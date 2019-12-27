var options = {
	headers: {'content-type' : 'application/x-www-form-urlencoded'},
	url: "https://jyx-beta.jyu.fi/rest/login", 
	method: 'POST',
	form: {"email": context.node.settings.username, "password": context.node.settings.password},
	json: true
};

core.login = options;		
out.say("progress", "Trying to login ..."); 


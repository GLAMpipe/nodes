

//var item = context.doc[context.node.params.in_field];
var out_link = context.doc[context.node.params.out_field];

// url
var url = context.node.settings.url_start
if(context.node.settings.url_middle && context.doc[context.node.settings.url_middle]) {
	url += context.node.settings.url_middle
}
url += context.node.settings.url_end; 

// parameters
if(context.node.settings.inkey_param_1 && context.node.settings.param_1_name) {
	var value_1 = context.doc[context.node.settings.inkey_param_1]
	url += "?" + context.node.settings.param_1_name + "=" + value_1;
	if(context.node.settings.inkey_param_2 && context.node.settings.param_2_name) {
		var value_2 = context.doc[context.node.settings.inkey_param_2]
		url += "&" + context.node.settings.param_2_name + "=" + value_2;
	}
}



//let buff = Buffer.from(context.node.settings._username + ":" + config.data.converis_passwd);  
//let base64cred = buff.toString('base64');


var options = {
	url: url,  
	json: true,
	body: {},
	method: 'POST',
	headers: {
		"accept": "application/json",
		"Content-Type": "application/json"
	}
};


// auth
if(context.node.settings.login_type == 'basic') {

	options.auth = {
		'username': context.node.settings._username,
		'password': context.node.settings._password,
		'sendImmediately': true
	}
}


console.log(options)

// if there is an url in out_link, then we do not run again
//if(out_link && typeof out_link == "string" && out_link.match(/^http/))
	//options.skip = true;

// do not proceed with empty content
//if(item)
	core.options = options;


if(parseInt(context.count) % 10 == 0) 
    out.say("progress", context.node.type.toUpperCase() + ": processed " + context.count + "/" + context.doc_count);







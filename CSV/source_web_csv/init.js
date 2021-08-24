
// context, out, funcs, core
context.vars = {count:0}

core.options = {
	url: context.node.params.file_url,
	method: 'GET'
}

out.console.log(context.node.dir)

// auth
if(context.node.settings._username) {
	core.options.auth = {
		'username': context.node.settings._username,
		'password': context.node.settings._password
	}
}

// create filename
var date = new Date(Date.now());
var y =  date.getUTCFullYear();
var m =  date.getMonth() + 1;
var d =  date.getDate();
var h =  date.getHours();
var mm =  date.getMinutes();
var s =  date.getSeconds();
var ss =  date.getMilliseconds();

// generate filename
var filename = y + "-" + m + "-" + d + "_" + h + ":" + mm + ":" + s + "_" + ss + ".csv";

// check settings
if(context.node.settings.mode === "append" && context.node.settings.update_key == "") {
	context.error = "You must give update_key in append mode!"
}
core.filename = filename;

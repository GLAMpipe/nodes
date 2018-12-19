
var template = context.node.settings.template;
context.vars = {};

var date = new Date();
var y =  date.getUTCFullYear();
var m =  date.getMonth() + 1;
var d =  date.getDate();
context.vars.date = y + "-" + m + "-" + d;

// find keys in template
if(template) {
	var keys = []
	var t = template.split("[[");
	t.forEach(function(bit) {
		if(bit.includes("]]")) {
			var l = bit.split("]]");
			var key = l[0];
			keys.push(key);
		}
	})
} 

out.console.log("NODE: template keys:");
out.console.log(keys);

context.vars.keys = keys;

out.filename = context.node.settings.required_file;
if(!out.filename) out.init_error = "File name is missing!"

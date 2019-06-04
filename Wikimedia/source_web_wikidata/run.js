var c = context; 
out.value = [];

if(core.response && core.response.statusCode == 200 && core.data && core.data.results.bindings) {
	var bindings = core.data.results.bindings;
	var numFound = bindings.length;
	out.console.log("FOUND: " + numFound + " wikidata items");
	
	bindings.forEach(function(bind) {
		out.console.log(bind);
		var obj = {};
		core.data.head.vars.forEach(function(field) {
			if(bind[field])
				obj[field] = bind[field].value;
			else
				obj[field] = "";
		})
		
		out.value.push(obj);
	})
	
} else {
	out.value = null;
}


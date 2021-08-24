var c = context;
out.value = [];

if(core.response && core.response.status == 200 && core.response.data && core.response.data.results.bindings) {
	var bindings = core.response.data.results.bindings;
	var numFound = bindings.length;
	out.console.log("FOUND: " + numFound + " wikidata items");

	bindings.forEach(function(bind) {
		out.console.log(bind);
		var obj = {};
		core.response.data.head.vars.forEach(function(field) {
			if(bind[field])
				obj[field] = bind[field].value;
			else
				obj[field] = "";
		})

		out.value.push(obj);
		c.var.total_count++
	})

} else {
	out.value = null;
}

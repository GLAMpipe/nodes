


var base_url = context.node.params.required_dspace_url;

// variables for node
context.vars = {};
context.vars.record_counter = 0;
context.vars.update_counter = 0;
context.vars.round_counter = 0;
context.vars.offset = 0;
context.vars.limit = 10;


core.options = {
	url: base_url + "/filtered-items" + context.node.settings.query + "&limit=" + context.vars.limit,
	method: 'GET'
}


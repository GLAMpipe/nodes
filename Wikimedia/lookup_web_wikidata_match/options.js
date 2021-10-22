
// https://tools.wmflabs.org/openrefine-wikidata/en/api?query={%22query%22:%22Jyv%C3%A4skyl%C3%A4n%20yliopisto%22}
var url = context.node.params.service_url;
var apipath = "/en/api?query=";
var match_terms = context.doc[context.node.params.in_field];
var class_free = context.node.settings.in_class;
var class_select = context.node.settings.in_class_select;
var class_type = class_free
if(class_select) class_type = class_select
core.options = {};


if(Array.isArray(match_terms)) {
	core.options = []
	match_terms.forEach(function(term) {

		var query = {query:term}
		if(class_type) query.type = class_type
		var options = {
			url: url + apipath + encodeURIComponent(JSON.stringify(query)),
			method: 'GET'
		}
		core.options.push(options);
	});
} else {
	var query = {query: match_terms}
	if(class_type) query.type = class_type
	core.options = {
		url: url + apipath + encodeURIComponent(JSON.stringify(query)),
		method: 'GET'
	}
}

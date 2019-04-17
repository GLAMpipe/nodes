
        
out.say('progress', 'Starting query...'); 

var rest_url = context.node.params.required_url;
var model = context.node.settings.model;


var facets = [];
for(var key of Object.keys(context.node.settings.facets)) {
	if(context.node.settings.facets[key] == "true") {
		facets = [parseInt(key.replace("id_",""))];
	}
}

var criteria = {
    "criteria" : {
        "type_facet" : facets
    }
}

out.url = rest_url + '/browse/' + model + '?pretty=1';
if(context.node.settings.token != '') out.url = out.url + '&authToken=' + context.node.settings.token;
out.url = out.url + "&source=" + encodeURIComponent(JSON.stringify(criteria));












var id = context.doc[context.node.params.in_field];
var model = context.node.settings.model;
var fields = context.node.settings.lookup_fields;
/*
out.console.log(fields)
var j =   {  "bundles" : {}};

for(var field in fields) {
	if(fields[field] == 'true') {
		var k = field.replace('__', '.');
		j.bundles[k] = {};
	}
}
*/
var j = {
    "bundles" : {
        "ca_objects.access" : {
            "convertCodesToDisplayText" : true
        },
        "ca_objects.preferred_labels.name" : {
            "delimiter" : "; "
        },
        "ca_object_representations.representation_id" : {
            "returnAsArray" : true
        },
        "ca_object_lots.lot_id" : {
            "returnAsArray" : true
        },
        "ca_object_lots.preferred_labels.name" : {
            "returnAsArray" : true
        },
        "lahjoittajat" : {
            "returnAsArray" : true,
            "template" : "<unit relativeTo='ca_object_lots' restrictToRelationshipTypes='donor'>lahjoittaja:<l> ^ca_entities.preferred_labels.displayname</l></unit>"

        }

    }
}
var options = {
	url: context.vars.url + id + '?authToken=' + context.node.settings.token,
	method: 'GET',
	body: JSON.stringify(j)
}


out.pre_value = options;

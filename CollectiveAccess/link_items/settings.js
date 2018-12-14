var g_export_ca_models  = null;

// display target url nicely to user
$("#export-data-ca-linkitem_serverinfo").text("Login for \"" +node.params.required_url+ "\"");


async function getToken() {

	var user = $("#export-data-ca-linkitem_user").val();
	var pass = $("#export-data-ca-linkitem_pass").val();
	var protocol = node.params.required_url.split("://");

	try {
		var token = await $.getJSON(g_apipath + "/proxy?url=" + protocol[0] + "://"+user+":"+pass+"@" + protocol[1] + "/auth/login");
	} catch(e) {
		alert(e.statusText);
	}
	
	// set token to input so that is passed to node execution
	$("#export-item-ca-linkitem-token").val(token.authToken);
		
}

async function getModels(type) {

	var protocol = node.params.required_url.split("://");

	try {
		var token = $("#export-item-ca-linkitem-token").val();
		if(!token) {
			alert("You must get token first!");
			return;
		}
		var models = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/model/"+type+"?pretty=1&token=" + token.authToken);
		g_export_ca_models = models;
		return models;
		
	} catch(e) {
		alert(e.statusText);
	}
}



function showRelationshipTypes(models, primary_type, mapped_field) {
	console.log(primary_type)
	if(!models ) {
		$("#export-data-ca-linkitem_type_mapping").empty().append("<div class='alert alert-warning'>Could not get models!</div>");
		return;
	}
	var relations = {};
	var html = "";
	for(var obj_type in models ) {
		if(obj_type != "ok") { // skip "ok" key
			var obj_relations = models[obj_type].relationship_types[primary_type];
			console.log("obj_relations")
			console.log(obj_relations)
			for(var relation in obj_relations) {
				console.log(relation)
				relations[relation] = obj_relations[relation];
			}
		}
	} 
	//$("#export-data-ca-linkitem_type_mapping").empty().append(html);
	console.log("rendertypeMapping");
	console.log(relations)
	renderTypeMapping(mapped_field, relations);
}




async function renderTypeMapping(field, relations) {
	if(field) {
		var types = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/facet/?fields=" + field);
		types = types.facets[0][field];
		
		html = "<table><thead><tr><th>"+field+"</th><th>map to</th></tr></thead>";
		for(const type of types) {
			html += "<tr><td>" + type._id + " (" + type.count + ")</td>";
			html += "<td><select class='node-settings' name='_typemap_" + type._id + "'><option value=''>choose</option>" + getTypeDropdown(relations) + "</select></td></tr>";
			//html += "<td><select class='node-settings' name='_typemap_" + type._id + "'><option value=''>choose</option></select></td></tr>";
		}
		$("#export-data-ca-linkitem_type_mapping").empty().append(html + "</table>");
	}
}





function getTypeDropdown(relations) {
	
	if(!relations) {
		$("#export-data-ca-linkitem_type_mapping").empty().append("Valitse uudelleen");
		return;
	}
	console.log(relations)
	var html = "";
	for(var key in relations) {
		//html += "<option value="+models[key].type_info.item_id+">" + models[key].type_info.item_id +":"+ models[key].type_info.item_value + " " +models[key].type_info.parent_id+ "</option>";
		html += "<option value=''>" + key + "</option>";
	}
	return html;	
}



// event handlers
$("#export-data-ca-linkitem_get-token").click(function(e){
	getToken();
});

$("#export-data-ca-linkitem_left-type").change(function(e){
	//getModels($(this).val());
})

$("#export-data-ca-linkitem_type_field").change(async function(e){
	var left = $("#export-data-ca-linkitem_left-type").val();
	var right = $("#export-data-ca-linkitem_right-type").val();
	if(left && right) {
		var models = await getModels(left);
		g_export_ca_models = models;
		showRelationshipTypes(models, right, $(this).val());
	} else {
		$("#export-data-ca-linkitem_type_mapping").empty().append("<div class='alert alert-warning'>You must choose</div>");
	}
})


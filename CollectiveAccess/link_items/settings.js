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


// choose valid relations from model
function getRelationshipTypes(models, primary_type, left_type) {
	if(!models ) {
		$("#export-data-ca-linkitem_type_mapping").empty().append("<div class='alert alert-warning'>Could not get models!</div>");
		return;
	}
	var relations = {};
	for(var obj_type in models ) {
		if(obj_type != "ok") { // skip "ok" key
			var obj_relations = models[obj_type].relationship_types[primary_type];
			for(var relation in obj_relations) {
				relations[relation] = obj_relations[relation];
			}
		}
	}
	
	// object - LOT relations are exception
	if(primary_type == "ca_object_lots" && left_type == "ca_objects") {
			relations = {"is_part_of": {"type_id": "lot"}}
	}

	return relations; 
}



async function renderRelationshipMapping(field, relations) {
	if(!relations) {
		$("#export-data-ca-linkitem_type_mapping").empty().append("No relations found!");
		return;
	}
	
	if(field) {
		var options = getRelationDropdown(relations);
		var user_relations = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/facet/?fields=" + field);
		var types = user_relations.facets[0][field];
		
		html = "<table><thead><tr><th>"+field+"</th><th>map to</th></tr></thead>";
		for(const type of types) {
			html += "<tr><td>" + type._id + " (" + type.count + ")</td>";
			html += "<td><select class='node-settings' name='_typemap_" + type._id + "'><option value=''>choose</option>" + options + "</select></td></tr>";
		}
		$("#export-data-ca-linkitem_type_mapping").empty().append(html + "</table>");
	}
}



function getRelationDropdown(relations) {
	var html = "";
	for(var key in relations) {
		html += "<option value='" + relations[key].type_id + "'>" + key + "</option>";
	}
	return html;
}



function setSettings() {
	if(node.settings) {
		for(var key in node.settings) {
			$("#export-data-ca-linkitem_type_mapping select[name='"+key+"']").val(node.settings[key]);
		}
		// remember default type
		$("#export-data-ca-linkitem_default-relation").val(node.settings.default_relation_id);
	}
}

// event handlers
$("#export-data-ca-linkitem_get-token").click(function(e){
	getToken();
});

$("#export-data-ca-linkitem_left-type").change(async function(e){
	var left = $("#export-data-ca-linkitem_left-type").val();
	var right = $("#export-data-ca-linkitem_right-type").val();
	if(left && right) {
		var models = await getModels(left);
		var relations = getRelationshipTypes(models, right);
		// populate default relationship dropdown
		$("#export-data-ca-linkitem_default-relation").empty().append(getRelationDropdown(relations));
		setSettings();
	}
})

$("#export-data-ca-linkitem_right-type").change(async function(e){
	var left = $("#export-data-ca-linkitem_left-type").val();
	var right = $("#export-data-ca-linkitem_right-type").val();
	if(left && right) {
		var models = await getModels(left);
		var relations = getRelationshipTypes(models, right, left);
		// populate default relationship dropdown
		$("#export-data-ca-linkitem_default-relation").empty().append(getRelationDropdown(relations));
		setSettings();
	}
})

$("#export-data-ca-linkitem_type_field").change(async function(e){
	var left = $("#export-data-ca-linkitem_left-type").val();
	var right = $("#export-data-ca-linkitem_right-type").val();
	if(left && right) {
		var models = await getModels(left);
		g_export_ca_models = models;
		var relations = getRelationshipTypes(models, right, left);
		// create dynamic relationship mapping UI
		renderRelationshipMapping($(this).val(), relations);
	} else {
		$("#export-data-ca-linkitem_type_mapping").empty().append("<div class='alert alert-warning'>You must choose</div>");
	}
	setSettings();
})



var g_export_mapping_ca_models = null;
var g_export_mapping_ca_type = null;

// display current CA url nicely to user
$("#export-mapping-ca_serverinfo").text("Mapping for \"" +node.params.required_url+ "\"");


var ignoreFields = ["id", "_id", "collection", "__mp_source"];

async function getToken() {

	var user = $("#export-mapping-ca-user").val();
	var pass = $("#export-mapping-ca-pass").val();
	var protocol = node.params.required_url.split("://");

	try {
		var token = await $.getJSON(g_apipath + "/proxy?url=" + protocol[0] + "://"+user+":"+pass+"@" + protocol[1] + "/auth/login");
	} catch(e) {
		alert(e.statusText);
	}
	
	// set token to input so that is passed to node execution
	$("#export-mapping-ca-token").val(token.authToken);
		
}

async function getModels(type) {

	g_export_mapping_ca_type = type;
	var protocol = node.params.required_url.split("://");

	try {
		var token = $("#export-mapping-ca-token").val();
		if(!token) {
			alert("You must get token first!");
			return;
		}
		var models = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/model/"+type+"?pretty=1&token=" + token.authToken);
		g_export_mapping_ca_models = models;
		var items = "<select id='export-mapping-ca-models'><option value=''>Choose type</option>";
		for (const key of Object.keys(models)) {
			//console.log(key, models[key]);
			if(models[key].type_info) {
				items += "<option value='" + key + "'>" + models[key].type_info.display_label + "</option>";
			}
		} 
		items += "</select>"
		$("#export-mapping-ca_models").append(items);
		renderModel();
		
	} catch(e) {
		alert(e.statusText);
	}



}


async function renderModel(type) {
	var html = '<table><thead><tr><th>CollectiveAccess field</th><th>dynamic value</th><th>static value</th></tr></thead>';
	
	if(g_export_mapping_ca_type == "ca_entities") {
		html += "<tr><td>Preferred displayname (Entity)</td>"
		html += "<td><select name='_dynamic_preferred_labels_displayname' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr>";
	} else {
		html += "<tr><td>Preferred label (Object)</td>";
		html += "<td><select name='_dynamic_preferred_labels_name' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr>";
	}
	html += "<tr><td>idno (identifier)</td>"
	html += "<td><select name='_dynamic_idno' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td><tr>";

	var fields = combineFields();
	for(const field of fields) {
		if(field.datatype == "Text") {
			html += "<tr><td>" + field.element + ":" + field.display_label + " (" + field.datatype + ")</td>";
			html += "<td><select name='_dynamic_" + field.element + "-" + field.element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></td>";
			html += "<td></td></tr>"
		}		
	}
	$("#export-mapping-ca_mapping").empty().append(html);
	
	// populate fields
	var fields = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/fields");
	var data_fields = "";
	for(const f of fields.sorted) {
		data_fields += "<option value='" + f + "'>" + f + "</option>";
   }
   $("#export-mapping-ca_mapping select").append(data_fields);
}

async function getTypes(field) {
	var types = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/facet/?fields=" + field);
	types = types.facets[0][field];
	var models = g_export_mapping_ca_models;
	
	if(!models) {
		$("#export-mapping-ca_type_mapping").empty().append("Valitse uudelleen");
		return;
	}
	
	var models_html = "";
	if(models) {
		for(var key in models) {
			console.log(key)
			if(key != "ok") {
				models_html += "<option value="+models[key].type_info.item_id+">" + models[key].type_info.item_value + "</option>";
			}
		}
	} else {
		return;
	}
	
	html = "<table><thead><tr><th>"+field+"</th><th>map to</th></tr></thead>";
	for(const type of types) {
		html += "<tr><td>" + type._id + " (" + type.count + ")</td>";
		html += "<td><select class='node-settings' name='_typemap_" + type._id + "'><option value=''>choose</option>" + models_html + "</select></td></tr>";
	}
	$("#export-mapping-ca_type_mapping").empty().append(html + "</table>");
}


function combineFields() {
	var all_fields = [];
	var models = g_export_mapping_ca_models;
	
	for(const model of Object.keys(models)) {
		if(models[model].elements) {

			for(const element of Object.keys(models[model].elements)) {
				var elements = models[model].elements[element].elements_in_set;
				for (const key of Object.keys(elements)) {
					if(!all_fields.some(x => x.element_code == elements[key].element_code)) {
						elements[key].element = element;
						all_fields.push(elements[key]);
					}
				}
			}
		}
	}
	return all_fields;
}

$("settingscontainer").on("change", "#export-mapping-ca-models", function(e){
	console.log(g_export_mapping_ca_models[$(this).val()])
	renderModel($(this).val());
})

$("#export-mapping-ca-get-token").click(function(e){
	getToken();
})

$("#export-mapping-ca-get-models").change(function(e){
	getModels($(this).val());
})

$("#export-mapping-ca-basic_guess").click(function(e){
	
   $("#export-mapping-ca_mappings table tr").each(function(index) {
	   
		var field = $( this ).find("td:first").text();
		field = field.replace(/\./g, "_");
		$( this ).find("select").val(field).change();
	   
   });
});

$("#export-mapping-ca-show_mapped").click(function(e){
	
   $("#export-mapping-ca_mappings table tr").each(function(index) {
	   
		var dynamic = $( this ).find("select").val();
		var static = $( this ).find("input").val();
		if(!dynamic && !static)
			$(this).hide();
	   
   });
});

$("#export-mapping-ca-show_all").click(function(e){
	
	$("#export-mapping-ca_mappings table tr").show();

});

$("#export-mapping-ca-type_field").change(function(e){
	
	getTypes($(this).val());

});




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
			if(models[key].type_info) {
				items += "<option value='" + key + "'>" + models[key].type_info.display_label + "</option>";
			}
		} 
		items += "</select>"
		$("#export-mapping-ca_models").append(items);
		await renderModel();
		setSettings();
		
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
		html += "<tr><td>Preferred label</td>";
		html += "<td><select name='_dynamic_preferred_labels_name' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr>";
	}
	
	if(g_export_mapping_ca_type == "ca_object_representations") {
		html += "<tr><td>media (URL)</td>";
		html += "<td><select name='_dynamic_media' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr></table>";
	} else {
		html += "<tr><td>idno (identifier)</td>";
		html += "<td><select name='_dynamic_idno' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr></table>";
	}


	// pick all unique elements (text fields, containers)
	var models = g_export_mapping_ca_models;
	var all_fields = [];
	var all_elements = {};
	for(const model of Object.keys(models)) {
		if(models[model].elements) {
			for(const element of Object.keys(models[model].elements)) {
				if(!(element in all_elements)) {
					all_elements[element] = models[model].elements[element];
				}
			}
		}
	}

	// find elements that are common to all types
	var common_elements = [];
	for(const element of Object.keys(all_elements)) {

		var is_common = true;
		for(const model of Object.keys(models)) {
			if(models[model].elements) {
				if(!(element in models[model].elements)) {
						is_common = false;
				}
				
			}
		}	
		if(is_common) common_elements.push(element);
	}
	
	common_elements.sort();

	// render common elements + type spesific
	html += '<br><h3>Common fields</h3><table><thead><tr><th>CollectiveAccess field</th><th>dynamic value</th><th>default value</th></tr></thead>';
	for(common of common_elements) {
		var element = all_elements[common];
		html += "<thead><tr><td><b>" + element.name + "</b></td><td></td><td></td></tr></thead>";
		for(const subelement of Object.keys(element.elements_in_set)) {
			var field = element.elements_in_set[subelement];
			if(field.datatype == "List") {
				var list = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + field.list_id + "?pretty=1");
				html += "<tr><td>"+field.element_code + " (" + field.datatype + ")</td>";
				html += "<td><select data-type='list' name='_dynamic_" + common + "-" + field.element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></td>";
				html += "<td><select name='_static_" + common + "-" + field.element_code + "' class='node-settings middle_input' ><option value=''>set default value</option>";
				for(var list_item of list.related.ca_list_items) {
					// we must exclude Root nodes
					if(!list_item.idno.includes("Root node"))
						html += "<option>" + list_item.idno + "</option>"
				}
				html += "</select></td>";
				
			} else {
				html += "<tr><td>"+field.element_code + " (" + field.datatype + ")</td>";
				html += "<td><select name='_dynamic_" + common + "-" + field.element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></td>";
			}
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
   $("#export-mapping-ca_mapping select.dynamic_field").append(data_fields);
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


$("#export-mapping-ca_mapping").on("change", "select", function(e){
	if($(this).data("type") == "list") {
		$(this).parent().append("checking...")
	}
})

$("settingscontainer").on("change", "#export-mapping-ca-models", function(e){
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

function setSettings() {
	if(!node.settings) return;
	for(var setting in node.settings) {
		$("[name='" + setting + "']").val(node.settings[setting]);
	}
} 

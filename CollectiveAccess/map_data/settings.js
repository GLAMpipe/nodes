
var g_export_mapping_ca_models = null;
var g_export_mapping_ca_type = null;


// display current CA url nicely to user
var server = node.params.required_url.split("/");
$("#export-mapping-ca_serverinfo").text(server[0] + "//" + server[2]);


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
	var html = '<table><thead><tr><th>Labels and idno</th><th>dynamic value</th><th>static value</th></tr></thead>';
	
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
	html += '<br><h3>Common fields</h3><table>';
	for(common of common_elements) {
		var element = all_elements[common];
		html += "<thead><tr><th><b>" + element.name + "</b></th><th>your value</th><th>default value</th><th>language</th><th>options</th></tr></thead>";
		for(const subelement of Object.keys(element.elements_in_set)) {
			var field = element.elements_in_set[subelement];
			var field_link = node.params.required_url.replace("service.php","index.php") + "/administrate/setup/Elements/Edit/element_id/" + field.element_id;
			var icon = "<span class='wikiglyph wikiglyph-eye icon' style='font-size:16px'></span>";
			var link_html = "<a title='view in CollectiveAccess' target='_blank' href='" + field_link + "'>"+icon+"</a>";
			
			// render lists
			if(field.datatype == "List") {
				// get list item values from CA
				var list = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + field.list_id + "?pretty=1");
				html += "<tr>";
				html += "<td>" + field.display_label + "<br>" + field.element_code + " (" + field.datatype + ") " + link_html + "</td>";
				html += "<td><select data-type='list' data-list_id='" + field.list_id + "' name='_dynamic_" + common + "-" + field.element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></td>";
				html += "<td><select name='_static_" + common + "-" + field.element_code + "' class='node-settings middle_input' ><option value=''>set default value</option>";
				// render list values as dropdown
				for(var list_item of list.related.ca_list_items) {
					// we must exclude Root nodes
					if(!list_item.idno.includes("Root node"))
						html += "<option>" + list_item.label + "</option>"
				}
				html += "</select></td>";
				html += "<td>not impl.</td><td></td>"
				
			// render other types of metadata
			} else {

				html += "<tr><td>"+field.element_code + " (" + field.datatype + ") " + link_html + " </td>";
				html += "<td><select name='_dynamic_" + common + "-" + field.element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></td>";
				html += "<td>not impl.</td><td>not impl.</td><td>not impl.</td>"
			}
			html += "</tr>"
		}
		
	}	


	$("#export-mapping-ca_mapping").empty().append(html + "</table>");
	
	// populate fields
	var fields = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/fields");
	var data_fields = "";
	for(const f of fields.sorted) {
		data_fields += "<option value='" + f + "'>" + f + "</option>";
   }
   $("#export-mapping-ca_mapping select.dynamic_field").append(data_fields);
}



// creates user interface for type mapping
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


// field mapping dropdowns -> list value checking
$("#export-mapping-ca_mapping").on("change", "select", async function(e){
	if($(this).data("type") == "list") {
		
		// reset ui if user chooses "no value"
		if($(this).val() == "") {
			$(this).removeClass("good");
			$(this).removeClass("bad");
			$(this).parent().find("div").remove();
			return;
		}
		var bad = [];
		$(this).parent().append("<div class='checking'>checking...</div>");
		var field = $(this).val();
		var values = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/facet/?fields=" + field);
		var list_values = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + $(this).data("list_id") + "?pretty=1");
		for(var value of values.facets[0][field]) {
			if(value._id) {
				var ok = list_values.related.ca_list_items.some(x=> value._id.toLowerCase() == x.label.toLowerCase());
				if(!ok) {
					bad.push(value._id);
				} 
			}
		}
		$(this).parent().find("div").remove();
		if(bad.length) {
			$(this).addClass("bad");
			$(this).parent().append("<div class='bad'> at least one  bad value: '" + bad[0] + "'</div>");
			console.log("bad values: " + bad);
		} else {
			$(this).addClass("good");
		}
	} else {
		if($(this).val() != "") {
			$(this).addClass("good");
		} else {
			// reset ui if user chooses "no value"
			$(this).removeClass("good");
		}
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

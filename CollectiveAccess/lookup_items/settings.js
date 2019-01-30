
var g_export_mapping_ca_models = null;
var g_export_mapping_ca_type = null;

// display target url nicely to user
$("#source-web-ca_serverinfo").text("Login for \"" +node.params.required_url+ "\"");


$("#source-web-ca-get-token").click(function(e){
	getToken();
});

// this is triggered by GLAMpipe when opening node
$("#source-web-ca-type_select").change(function(e){
	getModels($(this).val());
})

// dynamic
$("settingscontainer").on("change", "#source-web-ca-models", function(e){
	renderModel($(this).val());
})

async function getToken() {

	var user = $("#source-web-ca-user").val();
	var pass = $("#source-web-ca-pass").val();
	var protocol = node.params.required_url.split("://");

	try {
		var token = await $.getJSON(g_apipath + "/proxy?url=" + protocol[0] + "://"+user+":"+pass+"@" + protocol[1] + "/auth/login");
	} catch(e) {
		alert(e.statusText);
	}
	
	// set token to input so that is passed to node execution
	$("#source-web-ca-token").val(token.authToken);
		
}



function setSettings() {
	if(!node.settings) return;
	for(var setting in node.settings) {
		console.log(node.settings[setting])
		$("[name='" + setting + "']").val(node.settings[setting]);
	}
} 



async function getModels(type) {
	
	if(!type) {
		$("#source-web-ca_mapping").empty();
		$("#source-web-ca_type_mapping").empty();
		return;
	}

	var token = $("#source-web-ca-token").val();
	if(!token) {
		alert("You must get token first!");
		return;
	}

	g_export_mapping_ca_type = type;
	var protocol = node.params.required_url.split("://");

	try {
		var models = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/model/"+type+"?pretty=1&token=" + token);
		g_export_mapping_ca_models = models;
		var items = "<select id='source-web-ca-models'><option value=''>Choose type</option>";
		for (const key of Object.keys(models)) {
			if(models[key].type_info) {
				items += "<option value='" + key + "'>" + models[key].type_info.display_label + "</option>";
			}
		} 
		items += "</select>"
		//$("#source-web-ca_models").empty().append(items);
		//$("#source-web-ca-type_default").empty().append(getTypeDropdown());
		await renderModel();
		//await renderTypeMapping($("#source-web-ca-type_field").val());
		//setSettings();
		
	} catch(e) {
		alert(e.statusText);
	}
}


async function renderModel() {



	var html = await getCommonElementsHTML();


	$("#source-web-ca_mapping").empty().append(html + "</table>");
/*	
	// populate dynamic fields
	var fields = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/fields");
	var data_fields = "";
	for(const f of fields.sorted) {
		data_fields += "<option value='" + f + "'>" + f + "</option>";
   }
   $("#source-web-ca_mapping select.dynamic_field").append(data_fields);
   */
}



async function getCommonElementsHTML() {

	var all_elements = getAllElements();
	var common_elements = getCommonElements(all_elements);

	// render common elements + type spesific
	var html = '<br><h3>Common fields</h3><table>';
	for(common of common_elements) {
		var element = all_elements[common];
		html += "<thead><tr><th><b>" + element.name + "</b></th><th>include lookup</th></tr></thead>";
		for(const subelement of Object.keys(element.elements_in_set)) {
			var field = element.elements_in_set[subelement];
			var field_link = node.params.required_url.replace("service.php","index.php") + "/administrate/setup/Elements/Edit/element_id/" + field.element_id;
			var field_name = common + '__' + field.element_code;
			var icon = "<span class='wikiglyph wikiglyph-eye icon' style='font-size:16px'></span>";
			var link_html = "<a title='view in CollectiveAccess' target='_blank' href='" + field_link + "'>"+icon+"</a>";
			
			// render lists
			if(field.datatype == "List") {

				html += "<tr>";
				//html += await getListItemHTML(field, common, link_html, icon);
				html += "<td>not impl.</td><td></td>"
				
			// render other types of metadata
			} else {

				html += "<tr><td>" + field.element_code + " (" + field.datatype + ") " + link_html + " </td>";
				html += "<td><input type='checkbox' class='node-settings' name='lookup_fields[" + field_name +"]'></td>";
			}
			html += "</tr>"
		}
	}	
	return html;
}


function getAllElements() {
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
	return all_elements;
}



function getCommonElements(all_elements) {
	var models = g_export_mapping_ca_models;
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
	return common_elements;
}

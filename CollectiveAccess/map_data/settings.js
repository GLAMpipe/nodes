
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
	
	if(!type) {
		$("#export-mapping-ca_mapping").empty();
		$("#export-mapping-ca_type_mapping").empty();
		return;
	}

	var token = $("#export-mapping-ca-token").val();
	if(!token) {
		alert("You must get token first!");
		return;
	}

	g_export_mapping_ca_type = type;
	var protocol = node.params.required_url.split("://");

	try {
		var models = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/model/"+type+"?pretty=1&token=" + token);
		g_export_mapping_ca_models = models;
		var items = "<select id='export-mapping-ca-models'><option value=''>Choose type</option>";
		for (const key of Object.keys(models)) {
			if(models[key].type_info) {
				items += "<option value='" + key + "'>" + models[key].type_info.display_label + "</option>";
			}
		} 
		items += "</select>"
		$("#export-mapping-ca_models").empty().append(items);
		$("#export-mapping-ca-type_default").empty().append(getTypeDropdown());
		await renderModel();
		await renderTypeMapping($("#export-mapping-ca-type_field").val());
		setSettings();
		
	} catch(e) {
		alert(e.statusText);
	}
}



async function renderModel() {

	var html = '<table><thead><tr><th>Labels and idno</th><th>value</th><th>language</th></tr></thead>';
	
	// labels
	if(g_export_mapping_ca_type == "ca_entities") {
		html += "<tr><td>Preferred displayname (Entity)</td>"
		html += "<td><select name='_dynamic_preferred_labels_displayname' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr>";
	} else {
		html += "<tr><td>Preferred label</td>";
		html += "<td><select name='_dynamic_preferred_labels_name' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td>";
		html += "<td><select name='_locale_preferred_labels' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td></tr>";
		
		html += "<tr><td>Non preferred label</td>";
		html += "<td><select name='_dynamic_nonpreferred_labels_name' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td>";
		html += "<td><select name='_locale_nonpreferred_labels' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td></tr>";
		
	}
	
	// identifier
	if(g_export_mapping_ca_type == "ca_object_representations") {
		html += "<tr><td>media (URL)</td>";
		html += "<td><select name='_dynamic_media' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr></table>";
	} else if(g_export_mapping_ca_type == "ca_object_lots")  {
		html += "<tr><td>idno_stub (identifier)</td>";
		html += "<td><select name='_dynamic_idno_stub' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr>";
		html += "<tr>" + await getLotStatusListHTML() + "</tr></table>";
	} else {
		html += "<tr><td>idno (identifier)</td>";
		html += "<td><select name='_dynamic_idno' class='node-settings dynamic_field middle_input' ><option value=''>no value</option></select></td><td></td></tr></table>";
	}

	html += await getCommonElementsHTML();
	html += await getSpecificElementsHTML();


	$("#export-mapping-ca_mapping").empty().append(html);
	
	// populate dynamic fields
	var fields = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/fields");
	var data_fields = "";
	for(const f of fields.sorted) {
		data_fields += "<option value='" + f + "'>" + f + "</option>";
   }
   $("#export-mapping-ca_mapping select.dynamic_field").append(data_fields);
}



async function getLotStatusListHTML() {
	// try to find lot status list
	var lists = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/find/ca_lists?q=*&pretty=1");
	var status_list = lists.results.filter(x=>x.display_label == 'Object lot statuses')[0];
	if(status_list) {
		var field_link = node.params.required_url.replace("service.php","index.php") + "/administrate/setup/list_editor/ListEditor/Edit/list_id/" + status_list.list_id;
		var icon = "<span class='wikiglyph wikiglyph-eye icon' style='font-size:16px'></span>";
		var link_html = "<a title='view in CollectiveAccess' target='_blank' href='" + field_link + "'>"+icon+"</a>";
		var html = await getLotStatusList(status_list, 'lot_status_id', link_html, icon);
		return html;
	} else {
		return "Could not find LOT status list! LOT mapping is invalid without 'lot_status_id' field."
	}
}



// creates user interface for type mapping
async function renderTypeMapping(field) {
	if(field) {
		var types = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/facet/?fields=" + field);
		types = types.facets[0][field];
		
		html = "<table><thead><tr><th>"+field+"</th><th>map to</th></tr></thead>";
		for(const type of types) {
			html += "<tr><td>" + type._id + " (" + type.count + ")</td>";
			html += "<td><select class='node-settings' name='_typemap_" + type._id + "'><option value=''>choose</option>" + getTypeDropdown() + "</select></td></tr>";
		}
		$("#export-mapping-ca_type_mapping").empty().append(html + "</table>");
	}
}




async function checkField(field_select) {
	
	if(field_select.data("type") == "list") {
		
		// reset ui if user chooses "no value"
		//if(field_select.val() == "") {
			field_select.removeClass("good");
			field_select.removeClass("bad");
			field_select.parent().find("div").remove();
			//return;
		//}
		field_select.parent().append("<div class='checking'>checking...</div>");
		
		// get values that are not in list
		var bad = await getNonListValues(field_select);
		field_select.parent().find("div").remove();

		if(bad.values.length) {
			field_select.addClass("bad");
			// provide option to add values to list
			field_select.parent().append(getListEditorHTML(bad));
		} else {
			field_select.addClass("good");
		}
	} else {
		if(field_select.val() != "") {
			field_select.addClass("good");
		} else {
			// reset ui if user chooses "no value"
			field_select.removeClass("good");
		}
	}
}



async function getNonListValues(field_select) {
	var bad = [];
	var field = field_select.val();
	
	var values = await $.getJSON(g_apipath + "/collections/"+node.params.collection+"/facet/?fields=" + field);
	var list_values = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + field_select.data("list_id") + "?pretty=1");
	
	for(var value of values.facets[0][field]) {
		if(value._id) {
			var ok = list_values.related.ca_list_items.some(x=> value._id.toLowerCase() == x.label.toLowerCase());
			if(!ok) {
				bad.push(value._id);
			} 
		}
	}
	return {"values": bad, "name": list_values.list_code.value};
}



function getListEditorHTML(bad) {
	var html = "<div class='list-editor'>";
	if(bad.values.length == 100) {
		html += "<div > There are more than 100 values that are not list items. Are you sure that this should be a list?</div>";
	} else {
		html += "<div > There are " + bad.values.length + " values that are not list items, like this: "+bad.values[0]+" </div>";
		html += "<a href='#' class='button add-values-to-list'>quick add values to '"+bad.name+"'</a>";
	}
	return html + "</div>";	
}



async function getCommonElementsHTML() {

	var all_elements = getAllElements();
	var common_elements = getCommonElements(all_elements);

	// render common elements + type spesific
	var html = '<br><h3>Common fields</h3><table>';
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

				html += "<tr>";
				html += await getListItemHTML(field, common, link_html, icon);
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
	return html + "</table>";
}

async function renderElements(elements, all_elements) {
	var html = "";
	for(common of elements) {
		var element = all_elements[common];
		html += "<thead><tr><th><b>" + element.name + "</b></th><th>your value</th><th>default value</th><th>language</th><th>options</th></tr></thead>";
		for(const subelement of Object.keys(element.elements_in_set)) {
			var field = element.elements_in_set[subelement];
			var field_link = node.params.required_url.replace("service.php","index.php") + "/administrate/setup/Elements/Edit/element_id/" + field.element_id;
			var icon = "<span class='wikiglyph wikiglyph-eye icon' style='font-size:16px'></span>";
			var link_html = "<a title='view in CollectiveAccess' target='_blank' href='" + field_link + "'>"+icon+"</a>";
			
			// render lists
			if(field.datatype == "List") {

				html += "<tr>";
				html += await getListItemHTML(field, common, link_html, icon);
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
	return html;
}

async function getSpecificElementsHTML() {
	var models = g_export_mapping_ca_models;
	var all_elements = getAllElements();
	var common_elements = getCommonElements(all_elements);
	var html = '<br><h3>Type spesific fields</h3><table>';
	
	
	for(const model of Object.keys(models)) {
		if(models[model].elements) {
			var specific_elements = [];
			
			for(const element of Object.keys(models[model].elements)) {
				if(!(common_elements.includes(element))) {
					//all_elements[element] = models[model].elements[element];
					specific_elements.push(element);
				}
			}
			if(specific_elements.length > 0) {
				html += "<tr><td><h3>"+ model + "</h3></td></tr>";
				html += await renderElements(specific_elements, all_elements);
			}
			
		}
	}
	
	return html + "</table>";
}

async function getListItemHTML(list, common, link_html, icon) {
	// get list item values from CA
	var list_result = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + list.list_id + "?pretty=1");
				
	var html = "";
	html += "<td>" + list.display_label + "<br>" + list.element_code + " (" + list.datatype + ") " + link_html + "</td>";
	html += "<td><select data-type='list' data-list_id='" + list.list_id + "' name='_dynamic_" + common + "-" + list.element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></td>";
	html += "<td><select name='_static_" + common + "-" + list.element_code + "' class='node-settings middle_input' ><option value=''>set default value</option>";
	// render list values as dropdown
	for(var list_item of list_result.related.ca_list_items) {
		// we must exclude Root nodes
		if(!list_item.idno.includes("Root node"))
			html += "<option>" + list_item.label + "</option>"
	}
	html += "</select></td>";
	return html;	
}


// get status list for LOTs
async function getLotStatusList(list, field, link_html, icon) {
	// get list item values from CA
	var list_result = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + list.list_id + "?pretty=1");
				
	var html = "";
	html += "<td>" + list.display_label + " " + link_html + "<br>NOTE: dynamic values not implemented</td>";
	html += "<td><select name='_static_" + field + "' class='node-settings middle_input' >";
	// render list values as dropdown
	for(var list_item of list_result.related.ca_list_items) {
		// we must exclude Root nodes
		if(!list_item.idno.includes("Root node"))
			html += "<option>" + list_item.label + "</option>"
	}
	html += "</select></td><td></td>";
	return html;	
}

async function updateListItemDropdown(list_id) {
	var list = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_lists/id/" + list_id + "?pretty=1");
	
	var html = "<option value=''>set default value</option>";
	// render list values as dropdown
	for(var list_item of list.related.ca_list_items) {
		// we must exclude Root nodes
		if(!list_item.idno.includes("Root node"))
			html += "<option>" + list_item.label + "</option>"
	}
	html += "</select>";
	$("select[name='_static_condition-condition']").empty().append(html)
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


function getTypeDropdown() {
	var models = g_export_mapping_ca_models;
	
	if(!models) {
		$("#export-mapping-ca_type_mapping").empty().append("Valitse uudelleen");
		return;
	}
	
	var html = "";
	if(models) {
		for(var key in models) {
			if(key != "ok") {
				html += "<option value="+models[key].type_info.item_id+">" + models[key].type_info.item_id +":"+ models[key].type_info.item_value + " " +models[key].type_info.parent_id+ "</option>";
			}
		}
	} else {
		return;
	}
	return html;	
}


async function addListItems(field_select) {
	var bad = await getNonListValues(field_select);
	var list_id = field_select.data("list_id");
	var token = $("#export-mapping-ca-token").val();
	if(!token) {
		alert("You must get token first!");
		return;
	}
	for(const value of bad.values) {
		
		var locale = $("#default_locale").val();
		var payload2 = {
			 "intrinsic_fields":{
			   "list_id":list_id,
			   "idno":value,
			   "item_value":value,
				"is_enabled":"1"
			 },
			 "preferred_labels" : [
					{
						"locale": locale,
						"name_singular": value,
						"name_plural": value,
						"description":"This works!"
					}
				]		
			}
				
		var url = g_apipath + "/proxy?url=" + node.params.required_url + "/item/ca_list_items?pretty=1&token=" + token;
		var options = {
			"method": "PUT",
			"body": JSON.stringify(payload2),
			"headers": {
				 "Content-Type": "application/json"
			 }
		}

		await fetch(url, options);
		field_select.parent().append("<div>added: " + value + "</div>");
		
	}
	
}

// *************** EVENT HANDLERS **************'

// this is triggered by GLAMpipe when opening node
$("#export-mapping-ca-get-models").change(function(e){
	getModels($(this).val());
})

// dynamic
$("settingscontainer").on("change", "#export-mapping-ca-models", function(e){
	renderModel($(this).val());
})

// field mapping dropdowns -> list value checking
$("#export-mapping-ca_mapping").on("change", "select", async function(e){
	checkField($(this));
})

$("settingscontainer").on("click", ".add-values-to-list", async function(e){
	e.preventDefault();
	var field_select = $(this).parents("td").find("select");
	await addListItems(field_select);
	checkField(field_select);
	updateListItemDropdown(field_select.data("list_id"));
	$(".list-editor").remove();
})


// static
$("#export-mapping-ca-get-token").click(function(e){
	getToken();
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
	
	renderTypeMapping($(this).val());

});


$("#show-only-mapped").click(function(e){
	e.preventDefault();
	$("settingscontainer select").closest("tr").show();
	$("settingscontainer select").not(".good").closest("tr").hide();

});

$("#show-not-mapped").click(function(e){
	e.preventDefault();
	$("settingscontainer select").closest("tr").show();
	$("settingscontainer select.good").closest("tr").hide();

});

$("#show-all").click(function(e){
	e.preventDefault();
	$("settingscontainer select").closest("tr").show();

});


function setSettings() {
	if(!node.settings) return;
	for(var setting in node.settings) {
		console.log(node.settings[setting])
		$("[name='" + setting + "']").val(node.settings[setting]);
	}
} 


var g_export_mapping_ca_models = null;

// display current CA url nicely to user
$("#export-mapping-ca_serverinfo").text("Mapping for \"" +node.params.required_url+ "\"");


var ignoreFields = ["id", "_id", "collection", "__mp_source"];


async function getModels() {

	var user = $("#export-mapping-ca-user").val();
	var pass = $("#export-mapping-ca-pass").val();
	var protocol = node.params.required_url.split("://");

	try {
		var token = await $.getJSON(g_apipath + "/proxy?url=" + protocol[0] + "://"+user+":"+pass+"@" + protocol[1] + "/auth/login");
		var models = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/model/ca_objects?pretty=1&token=" + token.authToken);
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
		
	} catch(e) {
		alert(e.statusText);
	}

}


async function renderModel(type) {
	var html = "Preferred label";
	html += "<div><select name='_dynamic_preferred_labels' class='node-settings dynamic_field middle_input' ></select></div>";
	html += "<div><select name='_dynamic_idno' class='node-settings dynamic_field middle_input' ></select></div>";
	var model = g_export_mapping_ca_models[type];
	for (const key of Object.keys(model.elements)) {
		var elements = model.elements[key].elements_in_set;
		for (const key2 of Object.keys(elements)) {
			if(elements[key2].datatype == "Text") {
				html += model.elements[key].name + ":" + elements[key2].display_label + " (" + elements[key2].datatype + ")";
				html += "<div><select name='_dynamic_" + key + "-" + elements[key2].element_code + "' class='node-settings dynamic_field middle_input' ><option value=''>no value, use static</option></select></div>";
			}
		}
	}
	$("#export-mapping-ca_mapping").empty().append(html);
	
	// populate fields
	var fields = await $.getJSON(g_apipath + "/collections/"+node.collection+"/fields");
	var data_fields = "";
	for(const f of fields.sorted) {
		data_fields += "<option value='" + f + "'>" + f + "</option>";
   }
   $("#export-mapping-ca_mapping select").append(data_fields);
}


$("settingscontainer").on("change", "#export-mapping-ca-models", function(e){
	console.log(g_export_mapping_ca_models[$(this).val()])
	renderModel($(this).val());
})

$("#export-mapping-ca-get-models").click(function(e){
	getModels();
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





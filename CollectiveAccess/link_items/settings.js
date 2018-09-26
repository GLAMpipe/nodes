// display target url nicely to user
$("#export-data-ca-linkitem_serverinfo").text("Login for \"" +node.params.required_url+ "\"");


$("#export-data-ca-linkitem-get-token").click(function(e){
	getToken();
});

async function getToken() {

	var user = $("#export-data-ca-linkitem-user").val();
	var pass = $("#export-data-ca-linkitem-pass").val();
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
		
	} catch(e) {
		alert(e.statusText);
	}

}

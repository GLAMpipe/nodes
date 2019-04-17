
// display target url nicely to user
$("#source-web-ca_serverinfo").text("Login for \"" +node.params.required_url+ "\"");


$("#source-web-ca-get-token").click(function(e){
	getToken();
});

// this is triggered by GLAMpipe when opening node
$("#source-web-ca-get-facets").change(function(e){
	getModels($(this).val());
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

async function getModels(type) {
	
	if(!type) {
		$("#export-mapping-ca_mapping").empty();
		$("#export-mapping-ca_type_mapping").empty();
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
		var models = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/model/"+type+"%3Fpretty=1%26token=" + token);
		g_export_mapping_ca_models = models;
		var html = "<ul>";
		for (const key of Object.keys(models)) {
			if(models[key].type_info) {
				var id = models[key].type_info.item_id;
				html += "<li>" + models[key].type_info.display_label + " <input class='node-settings' name='facets[id_"+id+"]' type='checkbox'/></li>";
			}
		} 
		html += "</ul>"
		$("#source-web-ca_facets").empty().append(html);
		//await renderModel();
		//setSettings();
		
	} catch(e) {
		alert(e.statusText);
	}
}



async function getFacets(type) {
	var token = $("#source-web-ca-token").val();
	if(!token) {
		alert("You must get token first!");
		return;
	}

	try {
		var facets = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/browse/" + type + "%3FauthToken="+ token + "&options_method=1");
		renderFacets(facets);
	} catch(e) {
		alert(e.statusText);
	}
}

function renderFacets(facets) {
	var html = "";
	for(var facet in facets) {
		html += "<li>" + label + " <input class='node-settings' name='facets[id_"+id+"]' type='checkbox'/></li>";
	}
}

function renderFacets_old() {
	var html = "";
	for(var facet in facets["type_facet"]["content"]) {
		var label = facets["type_facet"]["content"][facet].label;
		var id = facets["type_facet"]["content"][facet].id;
		html += "<li>" + label + " <input class='node-settings' name='facets[id_"+id+"]' type='checkbox'/></li>";
	}
	$("#source-web-ca_facets").empty().append(html);
}

function setSettings() {
	if(!node.settings) return;
	for(var setting in node.settings) {
		console.log(node.settings[setting])
		$("[name='" + setting + "']").val(node.settings[setting]);
	}
} 


var facets = {
	
	  "type_facet":{
    "type":"fieldList",
    "field":"type_id",
    "group_mode":"none",
    "order_by_label_fields":[
      "name_plural"
    ],
    "label_singular":"tyyppi",
    "label_plural":"tyypit",
    "content":{
      "28":{
        "id":"28",
        "label":"\u00e4\u00e4nitallenteet",
        "content_count":"627",
        "parent_id":"26",
        "child_count":0
      },
      "23":{
        "id":"23",
        "label":"esineet",
        "content_count":"20171",
        "parent_id":"22",
        "child_count":0
      },
      "29":{
        "id":"29",
        "label":"lehtileikkeet",
        "content_count":"372",
        "parent_id":"22",
        "child_count":0
      },
      "34":{
        "id":"34",
        "label":"Paintings",
        "content_count":"1",
        "parent_id":"31",
        "child_count":0
      },
      "26":{
        "id":"26",
        "label":"tallenne",
        "content_count":"42",
        "parent_id":"22",
        "child_count":2
      },
      "24":{
        "id":"24",
        "label":"valokuvat",
        "content_count":"49169",
        "parent_id":"22",
        "child_count":0
      },
      "27":{
        "id":"27",
        "label":"Videotallenteet",
        "content_count":"310",
        "parent_id":"26",
        "child_count":0
      }
    }
  }
}

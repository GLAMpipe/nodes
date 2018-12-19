
if(node.settings.token) {
	getLists();
}


// display target url nicely to user
$("#export-data-ca_serverinfo").text("Login for \"" +node.params.required_url+ "\"");


$("#export-data-ca-get-token").click(function(e){
	getToken();
});

async function getToken() {

	var user = $("#export-data-ca-user").val();
	var pass = $("#export-data-ca-pass").val();
	var protocol = node.params.required_url.split("://");

	try {
		var token = await $.getJSON(g_apipath + "/proxy?url=" + protocol[0] + "://"+user+":"+pass+"@" + protocol[1] + "/auth/login");
	} catch(e) {
		alert(e.statusText);
	}
	
	// set token to input so that is passed to node execution
	$("#export-item-ca-token").val(token.authToken);
	getLists();
	
		
}


async function getLists() {
	var token = $("#export-item-ca-token").val();
	// get all lists
	try {
		var lists = await $.getJSON(g_apipath + "/proxy?url=" + node.params.required_url + "/find/ca_lists?q=*&pretty=1&token=" + token);
		var html = "";
		for(var list of lists.results) {
			html += "<option value='" + list.list_id + "'>" + list.display_label + "</option>";
		}
		$("#export-data-ca_lists").append(html);
	} catch(e) {
		alert("Lists not available, your session probably expired. " + e);
	}
	setSettings();
}


function setSettings() {
	if(!node.settings) return;
	for(var setting in node.settings) {
		console.log(node.settings[setting])
		$("[name='" + setting + "']").val(node.settings[setting]);
	}
} 



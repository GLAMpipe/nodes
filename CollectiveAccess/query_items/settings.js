
// display target url nicely to user
$("#source-web-ca_serverinfo").text("Login for \"" +node.params.required_url+ "\"");


$("#source-web-ca-get-token").click(function(e){
	getToken();
});

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




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
		
}






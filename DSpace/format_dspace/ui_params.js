var nodeid = "#export-data-dspace-map";
var params_url = g_apipath + "/options/source_web_dspace"

// *************** CODE FOR ADDING NEW URLS starts **************
var add_div       = $(nodeid + "_addoption");
var add_button    = $(nodeid + "_add");
var add_input     = $(nodeid + "_url_add");
var test_button   = $(nodeid + "_test");
var plus_button   = $(nodeid + "_plus");
var add_url_input = $(nodeid + "_url_add");
var dspace_status = $(nodeid + "_status");
var url_select    = $(nodeid + "_url");


function testUrl (url, success, fail) {

	var status = $.getJSON(g_apipath + "/proxy?url=" + url + "/status");

	status.done(function(data) {
		if(data.error)
			fail("Server did not answer");
		else
			if(data.okay)
				success(data);
			else
				fail("Rest API error")
	});

	status.fail(function() {
		fail("Proxy not working");
	});
}



function addUrl (url) {
	console.log("addurl")
	var options = {
		url: params_url,
		method: "POST",
		data: {},
		headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
	};
	console.log(options);
	options.data.url = add_input.val();
	var post = $.ajax(options);
	post.done(function( msg ) {
		add_div.hide();
		add_input.val("");
		fetchParams();
	});
}


test_button.click(function (e) {
	var url = add_url_input.val();
	if(url == "") {
		alert("Set the rest api url of DSpace");
		return;
	}

	function success () {dspace_status.text("Status: okay").removeClass().addClass("alert alert-success");}
	function fail (msg) {dspace_status.text("Not okay! Check url ("+msg+")").removeClass().addClass("alert alert-danger")}
	testUrl(url, success, fail);
})

add_button.click(function () {
	function success() {addUrl(params_url)};
	function fail(msg) {alert("DSpace rest url seems to invalid, can not add!")};
	testUrl(add_url_input.val(), success, fail);
})

plus_button.click(function () {
	add_div.show();
})
// *************** CODE FOR ADDING NEW URLS ends **************



// GET USER ADDED PARAMS
function fetchParams () {
	$.getJSON(params_url, function (data) {
		if(data.error)
			alert(data.error);
		else {

			if(data && Array.isArray(data.data)) {
				dspace_status.empty();
				url_select.empty();
				url_select.append("<option value='' selected disabled>predefined servers</option>");
				url_select.append("<option value='https://demo.dspace.org/rest'>https://demo.dspace.org/rest</option>");
				data.data.forEach(function(r) {
					url_select.append($("<option></option>").text(r.url).attr("value", r.url));
				})
			}
		}
	})
}



// CHOOSE SERVER HANDLER
$("#export-data-dspace-map_url").change(function() {
	$("#export-data-dspace-map_status").empty()
	add_div.hide();
	function success() {
		$("#export-data-dspace-map_status").empty().append($("#export-data-dspace-map_url :selected").val() + " responded OK").addClass("alert alert-success");
	};
	function fail(msg) {alert("DSpace rest API not working!")};
	testUrl($("#export-data-dspace-map_url :selected").val(), success, fail);
});


fetchParams();

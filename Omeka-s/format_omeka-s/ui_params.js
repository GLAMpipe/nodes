
var nodeid = "#export-data-omeka";
var params_url = g_apipath + "/options/export_web_omeka_additem"

// *************** CODE FOR ADDING NEW URLS starts **************
var add_div       = $(nodeid + "_addoption");
var add_button    = $(nodeid + "_add");
var add_input     = $(nodeid + "_url_add");
var test_button   = $(nodeid + "_test");
var plus_button   = $(nodeid + "_plus");
var add_url_input = $(nodeid + "_url_add");
var query_status  = $(nodeid + "_status");
var url_select    = $(nodeid + "_url");


function testUrl (url, success, fail) {

	var status = $.getJSON(g_apipath + "/proxy?url=" + url + "/vocabularies");

	status.done(function(data) {
		if(data.error)
			fail("Server did not answer");
		else
			if(data.length)
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
		alert("Set the rest api url of Omeka");
		return;
	}

	function success () {query_status.text("Status: okay").removeClass().addClass("good");}
	function fail (msg) {query_status.text("Not okay! Check url ("+msg+")").removeClass().addClass("bad")}
	testUrl(url, success, fail);
})

add_button.click(function () {
	function success() {addUrl(params_url)};
	function fail(msg) {alert("Omeka rest url seems to invalid, can not add!")};
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
				query_status.empty();
				url_select.empty();
				url_select.append("<option value='' selected disabled>predefined servers</option>");
				url_select.append("<option value='https://localhost:8080/api</option>");
				data.data.forEach(function(r) {
					url_select.append($("<option></option>").text(r.url).attr("value", r.url));
				})
			}
		}
	})
}



// CHOOSE SERVER HANDLER
$("#export-data-omeka_url").change(function() {
	function success() {
		$("#export-data-omeka_status").empty().append("Omeka responded OK").addClass("good");
		$("#export-data-omeka_hidden").show();
	};
	function fail(msg) {alert("Omeka rest API not working!")};
	testUrl($("#export-data-omeka_url :selected").val(), success, fail);
});


fetchParams();

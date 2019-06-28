
$.getJSON(g_apipath + "/collections/" + node.params.required_source_collection + "/fields", function (data) {
	var html = "";
	for (var key of data.keys) {
		if(key == "__mp_source" || key == "_id")
			continue;
			
		if(node.settings && node.settings.lookup_key_field === key)
			html += "<option  value='" + key + "' selected='selected'>" + key + "</option>";
		else
			html += "<option  value='" + key + "'>" + key + "</option>";

	}
	$('#lookup-key-field').append(html);
	
	html = "";
	for (var key of data.keys) {
		if(key == "__mp_source" || key == "_id")
			continue;
			
		if(node.settings && node.settings.lookup_copy_field === key)
			html += "<option  value='" + key + "' selected='selected'>" + key + "</option>";
		else
			html += "<option  value='" + key + "'>" + key + "</option>";

	}
	$('#lookup-copy-field').append(html);
})

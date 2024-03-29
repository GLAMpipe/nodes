



mapping();

$("#export-file-json_toggle").click(function(e){
	$(this).parent().find("input:checkbox").click();
})

// TODO: because this is async, this script must handle remembering settings itself
// we fetch target properties and then we fetch first document from GLAMpipe for mapping
function mapping() {

	var url = g_apipath + "/collections/"+node.collection+"/fields";

	$.getJSON(url, function (fields) {

		var table = '<a href="#" class="ibutton" id="export-file-json_toggle">toggle selection</a><table><thead><tr><th>Field</th></tr></thead>';

		fields.keys.forEach(function(field) {

			if(node.settings && node.settings.fields && node.settings.fields[field] === "false")
				table += "<tr> <td> <input class='node-settings' type='checkbox' name='fields["+field+"]'/> " + field + "</td>";
			else
				table += "<tr> <td> <input class='node-settings' type='checkbox' checked='checked' name='fields["+field+"]'/> " + field + "</td>";
	
		})
		table += "</table>";
		
		$("#export-file-json_fields").html(table);

	})
}

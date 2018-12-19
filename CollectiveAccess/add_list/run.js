
out.setter = {};

if(context.error) {
	out.setter[context.node.params.out_link] = out.error_marker + context.error;
} else if(!context.skip && context.data && context.response && context.response.statusCode == 200) {
	if(context.data.ok) {
		context.success_count++;
		var data = context.data;
		var splitted = context.node.params.required_url.split("/");
		var link_root = splitted.slice(0, splitted.length-1).join("/") 

		out.setter[context.node.params.out_id] = data.item_id + ""; // need to be string
		out.setter[context.node.params.out_link] = link_root + "/index.php/administrate/setup/list_item_editor/ListItemEditor/Edit/item_id/" + data.item_id;
		
	} else {
		out.console.log(context.data.errors);
		out.setter = {};
		out.setter[context.node.params.out_id] = out.error_marker + context.data.errors;
		out.setter[context.node.params.out_link] = out.error_marker + "export failed";
	}
}




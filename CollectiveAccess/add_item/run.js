


if(context.error) {
	out.setter[context.node.params.out_link] = out.error_marker + context.error;
} else if(!context.skip && context.data && context.response && context.response.statusCode == 200) {
	context.success_count++;
	var data = context.data;
	var splitted = context.node.params.required_url.split("/");
	var link_root = splitted.slice(0, splitted.length-1).join("/") 
	out.setter = {};
	out.setter[context.node.params.out_id] = data.object_id;
	out.setter[context.node.params.out_link] = link_root + "/index.php/editor/objects/ObjectEditor/Edit/object_id/" + data.object_id;
}




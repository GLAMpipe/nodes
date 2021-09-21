


if(core.error) {
	out.setter[context.node.params.out_link] = out.error_marker + context.error;
} else if(core.data && core.response.status == 200) {
	context.success_count++;
	var data = core.response.data;
	var splitted = context.node.params.required_url.split("/");
	var link_root = splitted.slice(0, splitted.length-1).join("/") + context.node.params.dspace_ui;
	out.setter = {};
	out.setter[context.node.params.out_uuid] = data.uuid;
	out.setter[context.node.params.out_handle] = data.handle;
	out.setter[context.node.params.out_link] = link_root + "/handle/" + data.handle;
}

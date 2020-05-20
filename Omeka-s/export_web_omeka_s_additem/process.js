
var response = core.data;
var url = context.node.params.required_url.replace(/\/api$/, ""); // this assumes that rest is in "api" endpoint

if(response) {
	// if site is given, then we create a link to the item in the site
	if(context.node.params.site_slug)
		out.value = url + "/s/" + context.node.params.site_slug + "/item/" + response["o:id"];
	// otherwise we create link to admin site 
	else
		out.value = url + "/admin/item/" + response["o:id"];
}

if(response.errors) {
	if(response.errors.error)
		out.value = out.error_marker + response.errors.error;
	else
		out.value = out.error_marker + response.errors;
}

/*
out.setter = {};

if(core.error) {
	out.setter[context.node.params.out_status] = out.error_marker + core.error;
	out.setter[context.node.params.out_field] = out.error_marker + core.error;
} else if(core.data && core.data.statusCode == 200) {
	context.success_count++;
	out.setter[context.node.params.out_status] = "200";
	out.setter[context.node.params.out_field] = core.data.body;

} else {
	out.setter[context.node.params.out_status] = core.data.statusCode.toString();
	out.setter[context.node.params.out_field] = core.data.body;
}*/

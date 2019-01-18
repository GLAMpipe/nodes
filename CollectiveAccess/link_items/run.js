
out.setter = {};
if(context.error) {
	out.setter[context.node.params.out_link] = out.error_marker + context.error;
} else if(!context.skip && context.data && context.response && context.response.statusCode == 200) {
	if(context.data.ok) {
		context.success_count++;
		var data = context.data;
		out.console.log(data);
		var splitted = context.node.params.required_url.split("/");
		var link_root = splitted.slice(0, splitted.length-1).join("/") 

		if(context.node.settings.left_type == "ca_objects") {
			out.setter[context.node.params.out_id] = data.object_id + ""; // need to be string
			out.setter[context.node.params.out_link] = link_root + "/index.php/editor/objects/ObjectEditor/Edit/object_id/" + data.object_id;
		} else if(context.node.settings.left_type == "ca_object_lots") {
			out.setter[context.node.params.out_id] = data.lot_id + ""; // need to be string
			out.setter[context.node.params.out_link] = link_root + "/index.php/editor/object_lots/ObjectLotEditor/Edit/lot_id/" + data.lot_id;
		} else if(context.node.settings.left_type == "ca_occurrences") {
			out.setter[context.node.params.out_id] = data.occurrence_id + ""; // need to be string
			out.setter[context.node.params.out_link] = link_root + "/index.php/editor/occurrences/OccurrenceEditor/Edit/occurrence_id/" + data.occurrence_id;
		} else if(context.node.settings.left_type == "ca_collections") {
			out.setter[context.node.params.out_id] = data.collection_id + ""; // need to be string
			out.setter[context.node.params.out_link] = link_root + "/index.php/editor/collections/CollectionEditor/Edit/collection_id/" + data.collection_id;
		} else if(context.node.settings.left_type == "ca_entities") {
			out.setter[context.node.params.out_id] = data.entity_id + ""; // need to be string
			out.setter[context.node.params.out_link] = link_root + "/index.php/editor/entities/EntityEditor/Edit/entity_id/" + data.entity_id;
		}

		
	} else {
		out.console.log(context.data.errors);
		out.setter = {};
		out.setter[context.node.params.out_link] = out.error_marker + "export failed";
	}
} else {
	out.setter[context.node.params.out_link] = out.error_marker + "export failed";
}


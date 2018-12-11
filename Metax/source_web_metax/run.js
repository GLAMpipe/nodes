
var c = context;
var pref_lang = c.node.settings.preferred_language;

var importLimit = 0;
if(parseInt(c.node.settings.limit))
	importLimit = parseInt(c.node.settings.limit);


if (context.response && context.response.statusCode == 200 ) {
	// count query rounds
	c.vars.round_counter++;

	if (context.data.results && context.data.results.length > 0) {
		
		out.say("progress", "procesed so far " + context.vars.record_counter );
		var imports = [];
		var updates = [];
		
		for (var i = 0; i < context.data.results.length; i++) {

			// count records 
			context.vars.record_counter++;
			imports.push(makeRecord(context.data.results[i])); // this adds some fields to the original data
			
			// obey import limit
			if(importLimit && context.vars.record_counter >= importLimit)
				break;
			
			if(context.node.settings.mode === "update" && context.node.settings.update_key) {
				if(!context.records.includes(context.data.results[i][context.node.settings.update_key])) { 
					updates.push(makeRecord(context.data.results[i]));
					context.vars.update_counter++;
				}
			} 
		}

		// OUTPUT
		if(context.node.settings.mode === "update")
			out.value = updates;
		else
			out.value = imports;
		
		// URL for next round
		var offset = c.vars.round_counter * c.vars.limit;
		if(context.data.next)
			out.url = context.data.next;
        
        // stop if import limit set by user is reached
        if(importLimit && context.vars.record_counter >= importLimit)
			out.url = "";
			
        out.say("progress", "Items fetched: " + context.vars.record_counter); 

	} else {
		out.say("progress", "no items found");
		out.value = null;
	}

}


function makeRecord(item) {
	item.title = "";
	item.description = "";
	item.access_type = "";
	item.license = [];
	item.creator_org = [];
	item.creator_person = [];
	item.creator_person_org = [];
	item.field_of_science = [];
	// we lift some information to top level for easier browsing
	if(item.research_dataset) {
		// title
		if(item.research_dataset.title) {
			item.title = getLangVersion(item.research_dataset.title);
		}
		// description
		if(item.research_dataset.description) {
			item.description = getLangVersion(item.research_dataset.description);
		}
		// access
		if(item.research_dataset.access_rights.access_type && item.research_dataset.access_rights.access_type.pref_label) {
			item.access_type = getLangVersion(item.research_dataset.access_rights.access_type.pref_label);
		}

		// license
		if(item.research_dataset.access_rights.license) {
			for(let license of item.research_dataset.access_rights.license) {
				item.license.push(getLangVersion(license.title))
			}
		}

		// creator
		if(item.research_dataset.creator) {
			for(let creator of item.research_dataset.creator) {
				if(creator["@type"] == "Organization")
					item.creator_org.push(getLangVersion(creator.name));
				else if(creator["@type"] == "Person") {
					item.creator_person.push(creator.name);
					if(creator.member_of) {
						item.creator_person_org.push(getLangVersion(creator.member_of.name));
					}
				}
			}
		}

		// field of science
		if(item.research_dataset.field_of_science) {
			item.field_of_science = [];
			for(let field of item.research_dataset.field_of_science) {
				item.field_of_science.push(getLangVersion(field.pref_label))
			}
		}

	}

	return item;
}

// first try to get value as preferred language, then in english and then get all
function getLangVersion(data) {

	if(data[pref_lang]) {
		return data[pref_lang];
	} else if(data["en"]) {
		return data["en"];
	} else {
		values = [];
		for(var lang in data) {
			values.push(data[lang])
		}
		return values;
	}
}

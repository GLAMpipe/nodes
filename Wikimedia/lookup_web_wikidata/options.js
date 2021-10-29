
var url = "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids="
var wid = context.doc[context.node.params.in_field];
core.options = {};

if(wid && wid !== "") {
	// we need to find out if wid is plain string or url (like http://www.wikidata.org/entity/Q28529650)
	if(!/^Q[0-9]*$/.test(wid)) {

		var s = wid.split("entity/");
		if(s[1]) {
			if(/^Q[0-9]*$/.test(s[1]))
				wid = s[1];
			else
				wid = "";
		} else {
			wid = "";
		}

	}
}

if(wid && wid !== "") {


	core.options = {
		url: url + wid,
		method: 'GET'
	}
}

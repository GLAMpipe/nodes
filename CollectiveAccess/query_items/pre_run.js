
var criteria = {
    "criteria" : {
        "type_facet" : [23]
    }
}

var options = {
	method: "GET",
	url: out.url,  // from init.js
	json: criteria,
	headers: {
		"accept": "application/json"
	},
	jar:true
};






var a = document.getElementById('process_lookup_web_wikidata_match_ui')
a.href = `http://localhost:8080/?node=${node._id}`

var div = document.getElementById('process_lookup_wikidata_recon_query_value')
div.textContent = node.params.in_field

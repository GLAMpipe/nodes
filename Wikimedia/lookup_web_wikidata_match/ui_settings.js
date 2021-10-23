



var a = document.getElementById('process_lookup_web_wikidata_match_ui')
a.href = `/apps/reconciliation?node=${node._id}`

var div = document.getElementById('process_lookup_wikidata_recon_query_value')
div.textContent = node.params.in_field

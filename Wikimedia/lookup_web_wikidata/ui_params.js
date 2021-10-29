$("#process_lookup_wikidata_out").val($("#lookup_wikidata_in").val() + "_wd_" + $("#lookup_wikidata_mode").val());
$("#process_lookup_wikidata_out_rev").val($("#lookup_wikidata_in").val() + "_wd_modified");

$("#lookup_wikidata_mode").change(function() {
	$("#process_lookup_wikidata_out").val($("#lookup_wikidata_in").val() + "_wd_" + $("#lookup_wikidata_mode").val());
	$("#process_lookup_wikidata_out_rev").val($("#lookup_wikidata_in").val() + "_wd_modified");
})
$("#lookup_wikidata_in").change(function() {
	$("#process_lookup_wikidata_out").val($("#lookup_wikidata_in").val() + "_wd_" + $("#lookup_wikidata_mode").val());
	$("#process_lookup_wikidata_out_rev").val($("#lookup_wikidata_in").val() + "_wd_modified");
})

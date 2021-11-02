

$("#export-file-csv-filename").change(function() {
	$("#export-file-csv-fields_download").attr('href','../api/v2/nodes/' + node._id + '/files/' + $("#export-file-csv-filename").val())
})
$("#export-file-csv-fields_download").attr('href','../api/v2/nodes/' + node._id + '/files/' + $("#export-file-csv-filename").val())
$("#export-file-csv-fields_download").text('download')

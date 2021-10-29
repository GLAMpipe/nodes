
	$("#process_field_split_in").change(function() {
		$("#process_field_split_out").val($(this).val() + "_splitted");
	})

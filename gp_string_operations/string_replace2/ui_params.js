	$("#process_field_replace_in").change(function() {
		$("#process_field_replace_out").val($(this).val() + "_replaced");
	})

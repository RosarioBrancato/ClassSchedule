function fillDdJobs() {
	$.ajax({
		url: 'http://home.gibm.ch/interfaces/133/berufe.php',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			var html =  '<option value="">Beruf auswählen...</option>';
			$.each(data, function(key, value) {
				html += '<option value="' + value['beruf_id'] + '">' + value['beruf_name'] + '</option>';
			});
			$('#jobs').html(html);
		},
		error: function(e) {
			alert('error');
		}
	});
}

function fillDdClasses(beruf_id) {
	//disable dropdown classes
	$('#classes').addClass('disabled');
	
	if(beruf_id != null && beruf_id.length > 0) {
		$.ajax({
			url: 'http://home.gibm.ch/interfaces/133/klassen.php?beruf_id=' + beruf_id,
			type: 'get',
			dataType: 'json',
			success: function(data) {
				//create HTML
				var html =  '';
				$.each(data, function(key, value) {
					html += '<option value="' + value['klasse_id'] + '">' + value['klasse_name'] + '</option>';
				});
				
				//insert html
				$('#classes').removeClass('sr-only');
				if(html.length > 0) {
					$('#classes').html(html);
				} else {
					$('#classes').html('<option value="">Keine Klassen gefunden</option>');
				}
			},
			error: function(e) {
				alert('error');
			}
		});
	} else {
		$('#classes').html('').addClass('sr-only');
	}
	
	//reenable dropdown classes
	$('#classes').removeClass('disabled');
}

function fillTblLessons(klasse_id, woche) {
	$('#lessons_div').removeClass('sr-only');
	$('#lessons').html('<tr><th>TITEL</th></tr> <tr><td>Test MOFO</td></tr>');
}
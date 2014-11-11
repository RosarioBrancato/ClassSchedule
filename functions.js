function fillDdJobs() {
	$.ajax({
		url: 'http://home.gibm.ch/interfaces/133/berufe.php',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			//create html
			var html = '';
			$.each(data, function(key, value) {
				html += '<option value="' + value['beruf_id'] + '">' + value['beruf_name'] + '</option>';
			});
			
			//insert html
			$('#jobs').html(html);
		},
		error: function(e) {
			alert('Error in jobs!');
		},
		complete: function() {
			//get values
			var job_id = $('#jobs').val();
			//fill dropdown classes
			fillDdClasses(job_id);
		}
	});
}

function fillDdClasses(job_id) {
	//disable dropdown classes, in case the ajax would take some time.
	$('#classes').addClass('disabled');
	
	if(job_id != null && job_id.length > 0) {
		$.ajax({
			url: 'http://home.gibm.ch/interfaces/133/klassen.php?beruf_id=' + job_id,
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
				alert('Error in classes!');
			},
			complete: function() {
				//get values
				var class_id = $('#classes').val();
				var today = new Date();
				var week_nr = today.getWeek();
				var year = today.getFullYear();
				//fill dropdown classes
				fillTblLessons(class_id, week_nr, year);
			}
		});
		
	} else {
		$('#classes').html('').addClass('sr-only');
		$('#lessons').html('').addClass('sr-only');
	}
	
	//reenable dropdown classes
	$('#classes').removeClass('disabled');
}

function fillTblLessons(class_id, week_nr, year) {
	//set visible
	$('#lessons_div').removeClass('sr-only');
	
	//week nr and year
	var week_nr_year = week_nr + '-' + year;
	$('#week_nr').text(week_nr);
	$('#week_year').text(year);
	
	//create table entries
	$.ajax({
		url: 'http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + class_id + '&woche=' + week_nr_year,
		type: 'get',
		dataType: 'json',
		success: function(data) {
			//create html
			var html = '';
			
			//table head
			html += '<tr>';
			html += '	<th>Datum</th>';
			html += '	<th>Wochentag</th>';
			html += '	<th>Von</th>';
			html += '	<th>Bis</th>';
			html += '	<th>Lehrer</th>';
			html += '	<th>Fach</th>';
			html += '	<th>Raum</th>';
			html += '	<th>Kommentar</th>';
			html += '</tr>';
			
			//table body
			$.each(data, function(key, value) {
				html += '<tr>';
				html += '	<td>' + value['tafel_datum'] + '</td>';
				html += '	<td>' + value['tafel_wochentag'] + '</td>';
				html += '	<td>' + value['tafel_von'] + '</td>';
				html += '	<td>' + value['tafel_bis'] + '</td>';
				html += '	<td>' + value['tafel_lehrer'] + '</td>';
				html += '	<td>' + value['tafel_longfach'] + '</td>';
				html += '	<td>' + value['tafel_raum'] + '</td>';
				html += '	<td>' + value['tafel_kommentar'] + '</td>';
				html += '</tr>';
			});
			
			$('#lessons').html(html);
		},
		error: function(e) {
			alert('Error in lessons!');
		}
	});
}

function getTotalWeeksOfYear(year) {
	var last_day = new Date(year + '-12-31');
	return last_day.getWeek();
}

//Quelle: http://zerosixthree.se/snippets/get-week-of-the-year-with-jquery/
//returns week nr
Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,0);
	var date = this;
	var dayOfYear = ((date - onejan + 86400000)/86400000);
	return Math.ceil(dayOfYear/7)
};
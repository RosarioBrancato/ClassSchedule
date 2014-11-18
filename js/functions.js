function firstLoading() {
	var cookie = getCookieObj();
	
	if(isCookieObjValide(cookie)) {
		//job
		fillDdJobs(cookie.job_id);
		//class
		fillDdClasses(cookie.job_id, cookie.class_id);
		//lessons
		fillTblLessons(cookie.class_id, cookie.week_nr, cookie.year);
		
		
	} else {
		fillDdJobs();
		fillDdClasses();
		fillTblLessons();
	}
}

function fillDdJobs(job_id) {
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
		complete: function(jqXHR, textStatus ) {
			if(job_id != null) {
				$('#jobs').val(job_id);
			}
		}
	});
	
	return false;
}

function fillDdClasses(job_id, class_id) {
	//validate parameter
	if(job_id == null) {
		job_id = $('#jobs').val();
	}
	
	//disable dropdown classes, in case the ajax-request would take some time.
	$('#classes').addClass('disabled');
	
	if(job_id != null && job_id.length > 0) {
		var url = 'http://home.gibm.ch/interfaces/133/klassen.php?beruf_id=' + job_id;
		$.ajax({
			url: url,
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
			complete: function(jqXHR, textStatus ) {
				if(class_id != null) {
					$('#classes').val(class_id);
				}
			}
		});
		
	} else {
		$('#classes').html('').addClass('sr-only');
	}
	
	//reenable dropdown classes
	$('#classes').removeClass('disabled');
}

function fillTblLessons(class_id, week_nr, year) {
	//validate parameters
	if(class_id == null) {
		class_id = $('#classes').val();
	}
	if(week_nr == null) {
		week_nr = $('#week_nr').text();
	}
	if(year == null) {
		year = $('#week_year').text();
	}
	//in case table is not loaded yet
	if(week_nr.length <= 0 || year.length <= 0) {
		var today = new Date();
		week_nr = today.getWeek();
		year = today.getFullYear();
	}
	
	//set visible
	$('#lessons_div').removeClass('sr-only');
	
	//week nr and year
	var week_nr_year = week_nr + '-' + year;
	$('#week_nr').text(week_nr);
	$('#week_year').text(year);
	
	//create table entries
	var url = 'http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + class_id + '&woche=' + week_nr_year;
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		success: function(data) {
			var cache_date = '';
		
			//create html
			var html = '';
			
			$.each(data, function(key, value) {
				if(value['tafel_datum'] != cache_date) {
					//cache date
					cache_date = value['tafel_datum'];
					//table header
					html += getTableHeaderRowHtml(value);
				}
				
				
				//table body
				html += getTableRowHtml(value);
			});
			
			if(html.length <= 0) {
				html = '<tr><td><div class="col-sm-12">Kein Unterricht</div></td></tr>';
			}
			
			//insert html in table
			$('#lessons').html(html);
		},
		error: function(e) {
			alert('Error in lessons!');
		}
	});
}

function getTableHeaderRowHtml(array) {
	var date = getFormattedDate(array['tafel_datum']);
	var weekday = getWeekdayName(parseInt(array['tafel_wochentag']));

	var html = '';
	
	html += '<tr>';
	html += '	<th>';
	html += '		<div class="col-sm-12">';
	html += '			<h3>' + weekday + ', ' + date + '</h3>';
	html += '		</div>';
	html += '	</th>';
	html += '</tr>';
	
	return html;
}

function getTableRowHtml(array) {
	time_from = getFormattedTime(array['tafel_von']);
	time_to = getFormattedTime(array['tafel_bis']);
	subject = array['tafel_longfach'];
	teacher = array['tafel_lehrer'];
	room = array['tafel_raum'];
	comment = array['tafel_kommentar'];
	
	var html = '';
	
	html += '<tr>';
	html += '	<td>';
	html += '		<div class="col-sm-2">';
	html += '			<p><strong>' + time_from + ' - ' + time_to + '</strong></p>';
	html += '		</div>';
	html += '		<div class="col-sm-3">';
	html += '			<p>' + subject + '</p>';
	html += '		</div>';
	html += '		<div class="col-sm-2">';
	html += '			<p>' + teacher + '</p>';
	html += '		</div>';
	html += '		<div class="col-sm-2">';
	html += '			<p>' + room + '</p>';
	html += '		</div>';
	html += '		<div class="col-sm-3">';
	html += '			<p>' + comment + '</p>';
	html += '		</div>';
	html += '	</td>';
	html += '</tr>';
	
	return html;
}
function firstLoading() {
	var cookie = getCookieObj();
	
	fillDdJobs();
	fillDdClasses();
	fillTblLessons();
	
	/*if(cookie != null && typeof(cookie) != 'undefined') {
		$('#jobs').val(cookie.job_id);
		fillDdClasses(cookie.class_id);
		fillTblLessons(cookie.week_nr, cookie.year);
	}*/
}

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
		}
	});
}

function fillDdClasses() {
	//get value
	var job_id = $('#jobs').val();
	fillDdClasses(job_id);
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
			}
		});
		
	} else {
		$('#classes').html('').addClass('sr-only');
	}
	
	//reenable dropdown classes
	$('#classes').removeClass('disabled');
}

function fillTblLessons() {
	//get values
	var class_id = $('#classes').val();
	var week_nr = $('#week_nr').text();
	var year = $('#week_year').text();

	fillTblLessons(class_id, week_nr, year);
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

function getFormattedDate(date) {
	var d = new Date(date);
	var month = parseInt(d.getMonth()) + 1;
	return prependZeros(d.getDate(), 2) + '.' + prependZeros(month, 2) + '.' + d.getFullYear();
}

function getFormattedTime(time) {
	var dateString = 'Nov 18 2014 ' + time;
	
	var t = new Date(dateString);
	var hours = parseInt(t.getHours());
	var min = parseInt(t.getMinutes());
	return prependZeros(hours, 2) + ':' + prependZeros(min, 2);
}

function prependZeros(number, length) {
	var nString = number.toString();
	var n = '';
	
	if(nString.length  < length) {
		for(i = 0; i < (length - nString.length); i++) {
			n += '0';
		}
	}
	
	return n + nString;
}

function getWeekdayName(number) {
	switch(number) {
		case 1:
			return 'Montag';
		case 2:
			return 'Dienstag';
		case 3:
			return 'Mittwoch';
		case 4:
			return 'Donnerstag';
		case 5:
			return 'Freitag';
		case 6:
			return 'Samstag';
		case 7:
			return 'Sonntag';
		default:
			 return '';
	}
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

function saveCookie() {
	$.cookie('job_id', $('#jobs').val());
	$.cookie('class_id', $('#classes').val());
	$.cookie('week_nr', $('#week_nr').text());
	$.cookie('year', $('#week_year').text());
}

function getCookieObj() {
	return $.cookie();
}
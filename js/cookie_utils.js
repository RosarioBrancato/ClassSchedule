function saveCookie() {
	$.cookie('job_id', $('#jobs').val(), { expires: 1500 });
	$.cookie('class_id', $('#classes').val(), { expires: 1500 });
	$.cookie('week_nr', $('#week_nr').text(), { expires: 1500 });
	$.cookie('year', $('#week_year').text(), { expires: 1500 });
}

function getCookieObj() {
	return $.cookie();
}

function isCookieObjValide(cookieObj) {
	return (cookieObj.job_id != undefined) 
		&& (cookieObj.class_id != undefined)
		&& (cookieObj.week_nr != undefined)
		&& (cookieObj.year != undefined);
}
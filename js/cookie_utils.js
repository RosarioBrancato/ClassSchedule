function saveCookie() {
	$.cookie('job_id', $('#jobs').val(), { expires: 1500 });
	$.cookie('class_id', $('#classes').val(), { expires: 1500 });
}

function getCookieObj() {
	return $.cookie();
}

function isCookieObjValide(cookieObj) {
	return (cookieObj.job_id != undefined) 
		&& (cookieObj.class_id != undefined);
}
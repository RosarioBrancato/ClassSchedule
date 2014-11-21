//THESE FUNCTIONS USE THE COOKIE-PLUGIN. PATH: /plugin/jquery.cookie.js

function saveCookies() {
	//saves all important values in cookies
	//expires in 1500 days
	$.cookie('job_id', $('#jobs').val(), { expires: 1500 });
	$.cookie('class_id', $('#classes').val(), { expires: 1500 });
}

function saveCookieJobId() {
	//saves the job_id in a cookie
	//expires in 1500 days
	$.cookie('job_id', $('#jobs').val(), { expires: 1500 });
}

function saveCookieClassId() {
	//saves the class_id in a cookie
	//expires in 1500 days
	$.cookie('class_id', $('#classes').val(), { expires: 1500 });
}

function getCookieObj() {
	//returns the object with the saved values of the cookies
	return $.cookie();
}

function isCookieObjValid(cookieObj) {
	//checks if the attributes of the cookie object are set
	return (cookieObj.job_id != null) 
		&& (cookieObj.class_id != null);
}
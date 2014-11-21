//THERE FUNCTIONS HELP THE FORMATTING OF DATE/TIME VALUES

function getFormattedDate(date) {
	//formats date and returns it as a string
	var d = new Date(date);
	var month = parseInt(d.getMonth()) + 1;
	return prependZeros(d.getDate(), 2) + '.' + prependZeros(month, 2) + '.' + d.getFullYear();
}

function getFormattedTime(time) {
	//formats time and returns it as a string
	var dateString = 'Nov 18 2014 ' + time;
	
	var t = new Date(dateString);
	var hours = parseInt(t.getHours());
	var min = parseInt(t.getMinutes());
	return prependZeros(hours, 2) + ':' + prependZeros(min, 2);
}

function prependZeros(number, length) {
	//prepend zeros till the number length reaches the length
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
	//returns the name of the week corresponding to the number
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
	//returns the total weeks of the year
	var last_day = new Date(year + '-12-31');
	return last_day.getWeek();
}

//Quelle: http://zerosixthree.se/snippets/get-week-of-the-year-with-jquery/
Date.prototype.getWeek = function() {
	//returns the week number of the current date object's year
	var onejan = new Date(this.getFullYear(),0,0);
	var date = this;
	var dayOfYear = ((date - onejan + 86400000)/86400000);
	return Math.ceil(dayOfYear/7)
};
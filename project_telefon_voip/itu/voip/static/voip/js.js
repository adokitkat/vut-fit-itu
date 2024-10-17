$(document).ready(function() {

const user_input = $("#user-input")
const contacts = $('#replaceable-content')
const endpoint = '/'
const delay_by_in_ms = 400
let scheduled_function = false

// zachytava kliknutia pre zaciatok hovoru a meni css prvkov, pridava meno volaneho do ".call"
var callBool = false
$(document).on('click', '.start-call', function (e) {
	if (callBool == false) {
		callBool = true;
		startTimer();
		let me = $(this);
		
		$('.content').css('padding-top', '0px');
		$('.grid-container').css('grid-template-rows', '0.2fr 0.6fr 1.6fr');
		$('.grid-container').css('grid-template-areas', '". navbar ." ". call ." ". content ."');

		me.children().css('filter', 'invert(58%) sepia(30%) saturate(936%) hue-rotate(78deg) brightness(97%) contrast(90%)');

		var x = me.parent().children('.name').children('p').clone().prop('outerHTML').split(" ")[0];
		x += "</p>";

		me.parent().children('.foto').children('img').clone().addClass('callpic').appendTo($('.you'));
		$(x).appendTo($('.your-name'));
		
		$('.call').fadeIn('slow').css('display', 'grid');
	}
});
// ukoncenie hovoru
$('.end').click(function () {
	callBool = false;
	$('.call').fadeOut('slow').promise().done(function(){
		$('.call').css('display', 'none');
		$('.ring img').css('filter', 'none')
		$('.you > img').remove()
		$('.your-name > p').remove()
		$('.content').css('padding-top', '15px');
		$('.grid-container').css('grid-template-rows', '0.2fr 1.6fr');
		$('.grid-container').css('grid-template-areas', '". navbar ." ". content ."');
		stopTimer();
		resetTimer();
	});
	
});
// stisenie mikrofonu
var mute_on = false;
$('.mute').click(function() {
	if (mute_on == false) {
		$('.mute img').css('filter', 'invert(30%) sepia(80%) saturate(4113%) hue-rotate(344deg) brightness(96%) contrast(104%)');
		mute_on = true;
	} else {
		$('.mute img').css('filter', 'none')  
		mute_on = false;
	}
});

// pocitadlo casu hovoru
window.seconds = 0;
window.minutes = 0;
var timer_on = false

function startTimer() {
	if (timer_on == false) {
		window.action = setInterval(countSecs,1000);
		timer_on = true
	}
}
function resetTimer() {
	seconds = 0;
	minutes = 0;
	timer_on = false
}
function stopTimer() {
  clearInterval(action);        
  seconds = -1;
  minutes = 0;
  countSecs();
}
function zeroPad(time) {
  var numZeropad = time + '';
  while(numZeropad.length < 2) {
      numZeropad = "0" + numZeropad;
  }
  return numZeropad;
}
function countSecs() {
	seconds++;
  if (seconds > 59) {
       minutes++;
       seconds = 0;
  }
  document.getElementById("duration").innerHTML = zeroPad(minutes) + ":" + zeroPad(seconds);
}

// posiela ajax requesty, ktore zachytava Django
let ajax_call = function (endpoint, request_parameters) {
	$.getJSON(endpoint, request_parameters)
		.done(response => {
			// zaciatok efektu
			contacts.fadeTo('slow', 0).promise().then(() => {
				// vymiena HTML obsah pre dynamicku obnovu
				contacts.html(response['html_from_view'])
				// efekt
				contacts.fadeTo('slow', 1)
			})
		}
	)
}

// pri pisani znakov reaguje na eventy a zachytava ich
user_input.on('keyup', function () {

	const request_parameters = {
		q: $(this).val() // znaky vlozene pouzivatelom
	}
	// ak true, vypne sa (dokoncene)
	if (scheduled_function) {
		clearTimeout(scheduled_function)
	} 
	// vola ajax funkciu
	scheduled_function = setTimeout(ajax_call, delay_by_in_ms, endpoint, request_parameters)

})

// reaguje na kliknutie na pridanie do kontaktov
$(document).on('click', '.add', function (e) {
	
	$(this).css('display', 'none');

	var str2 = $(this).parent().children('.name').prop('innerHTML').replace('<p>', '').replace('</p>', '');
	var str1 = str2.split(' ', 1).toString(); // meno
	str2 = str2.slice(str1.length+1).toString(); // priezvisko 

	const request_parameters = {
		a: str1 , b: str2 
	}

	$.getJSON(endpoint, request_parameters) // vytvara ajax get request

});

})
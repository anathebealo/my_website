var max_id = 33;
$('img').on('click', function() {
    $(this).toggleClass('clicked');
    $('#big').remove();

	    var id = $(this).attr("id");
	    var className = $(this).attr("class");
	    var big;
	    console.log(className);
	    if(className !== "double-tall clicked") {
		   big = "big";
		} else {
			big = "big-tall";
		}
		
		if((max_id%3 === 0 && parseInt(id) === max_id) || (max_id%3 === 1 && parseInt(id) >= max_id - 1) || (max_id%3 === 2 && parseInt(id) >= max_id - 2)) {
			$( "<img id='" + big + "'  src='photos/" + (parseInt(id)+1) + ".jpg' href='#" + big + "'>").insertAfter($("#"+max_id).parent()).hide().fadeIn(500);
	    	$("#" + big).scrollTop(0);
		} else {
			if(parseInt(id)%3 === 0) {
		    	$( "<img id='" + big + "'  src='photos/" + (parseInt(id)+1) + ".jpg' href='#" + big + "'>").insertAfter($("#"+(parseInt(id)+2)).parent()).hide().fadeIn(500);
		    	$("#" + big).scrollTop(0);
		    } else if(parseInt(id)%3 === 1) {
		    	$( "<img id='" + big + "' src='photos/" + (parseInt(id)+1) + ".jpg'>" ).insertAfter($("#"+(parseInt(id)+1)).parent()).hide().fadeIn(500);
		    	$("#" + big).scrollTop(0);
		    } if(parseInt(id)%3 === 2) {
		    	$( "<img id='" + big + "' src='photos/" + (parseInt(id)+1) + ".jpg'>" ).insertAfter($("#"+parseInt(id)).parent()).hide().fadeIn(500);
		    	$("#" + big).scrollTop(0);
		    }
		}
	    
        $('#big').click(function() {
			console.log("hi");
			$('html, body').animate({
		        scrollTop: $('#' + big).offset().top - 700
		    }, 'slow');
			$('#big').fadeOut(500, function(){ $('#big').remove(); });
		})

		$('#big-tall').click(function() {
			console.log("hi");
			$('html, body').animate({
		        scrollTop: $('#' + big).offset().top - 700
		    }, 'slow');
			$('#big-tall').fadeOut(500, function(){ $('#big-tall').remove(); });
		})

		$('html, body').animate({
	        scrollTop: $('#' + big).offset().top - 20
	    }, 'slow');
});


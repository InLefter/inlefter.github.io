
function showImg() {
  var c = 0;
  var f = false;
  $(".gallery-image").each(function(i){
	if (c === 2) {
	  f = true;
	  return false;
	}
    if ($(this).css('display') === 'none') {
      $(this).css('display','inline');
	  if (!$(this).attr('src')) {
        const source = $(this).data('src');
        $(this).attr('src', source);
      }
	  c = c + 1;
	}
  });
  if (c !== 2 || (c === 2 && f === false)) {
    $("#button-text").html('End');
  }
}

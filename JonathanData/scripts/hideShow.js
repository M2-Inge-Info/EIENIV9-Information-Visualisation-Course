$('#container2').hide();
$('#container3').hide();

$('#nav-container1').click(function() {
    $('#container1').show();
    $('#container2').hide();
    $('#container3').hide();
  });

  $('#nav-container2').click(function() {
    $('#container1').hide();
    $('#container2').show();
    $('#container3').hide();
  });

  $('#nav-container3').click(function() {
    $('#container1').hide();
    $('#container2').hide();
    $('#container3').show();
  });
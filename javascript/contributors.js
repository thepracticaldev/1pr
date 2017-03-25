$(document).ready(function(){

  // function to show and build contributors list
  function getContributors(contributors) {
    // show the contributors json for troubleshooting
    console.log(contributors);

    // loop through the contributors and build the HTML
    var contributorsList = "";
    for (var i = 0; i < contributors.length; i++) {
      contributorsList += '<li>' + contributors[i].login + '</li>'
    }

    // add the contributor list to the page
    $("#contributors").html(contributorsList);
  }

  // ajax to get contributors list
  $.ajax({
    url: "https://api.github.com/repos/thepracticaldev/1pr/contributors",
    dataType: "json",
    success: getContributors
  });

});  //end of document ready

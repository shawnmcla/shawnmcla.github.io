setInterval(function () {
console.log("Checking for Kappas!");
    $('._3oh-').each(function (i) {
        console.log(i);
        var oldHtml = $(this).html();
        var newHtml = oldHtml.replace('Kappa', '<img src="http://shawnmcla.github.io/kappaweb/kappa.png"/>');
        $(this).html(newHtml);
    })
}, 500)
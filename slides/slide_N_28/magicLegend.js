pt.magicLegend = pt.magicLegend || {};

pt.magicLegend.init = function() {

	var vid = document.getElementById("magic-legend-video");

	pt.magicLegend.speedUpOne = setTimeout(function() { vid.playbackRate = 2 }, 5000);
	pt.magicLegend.speedUpTwo = setTimeout(function() { vid.playbackRate = 4 }, 10000);

}//init

pt.travelIntro = pt.travelIntro || {};

pt.travelIntro.init = function() {
	pt.travelIntro.img = d3.select("#travel-intro #travelFinal");
}//init

pt.travelIntro.setBack = function() {
	pt.travelIntro.img.style("top", 0);
}//setBack

pt.travelIntro.move = function () {
	//Move image upwards
	pt.travelIntro.img
		.transition("move").duration(10000)
		.styleTween("top", function() { return d3.interpolateString("0%", "-47%"); });
}//function move

pt.endSlide = pt.endSlide || {};

pt.endSlide.init = function() {

	var n = 7;
	var counter = 0;
	var dur = 1000;

	d3.selectAll("#end-slide .loop-bloopers img").style("opacity", 0);
	d3.select("#end-slide #blooper-1").style("opacity", 1);

	pt.endSlide.loop = setInterval(loopBloopers,dur*2);
	loopBloopers();

	function loopBloopers() {

		d3.select("#end-slide #blooper-" + ((counter-1)%n+1))
			.transition().duration(dur)
			.ease(d3.easeLinear)
			.style("opacity", 0);

		d3.select("#end-slide #blooper-" + (counter%n+1))
			.transition().duration(dur)
			.ease(d3.easeLinear)
			.style("opacity", 1);

		counter += 1;
	}//loopBloopers

}//init

(function () {
	// properties and d3 initializations
	var width = 500;
	var height = 500;
	var scale = 2.5;
	var strokeColor = '#444';
	var svg, petals, allPetalLines, petalLines, petalColors, annotations, directions;

	// animations
	var timeline = new TimelineMax({paused: true});
	var duration = 1.5;

	var colors = {green: '#55e851', blue: '#51aae8', pink: '#a651e8'}
	var linesDraw = [
    'M0,0 C50,40 50,70 20,100',
    'M20,100 L0,85',
    'M0,85 L-20,100',
    'M-20,100 C-50,70 -50,40 0,0'
  ];
	var annotationsData = [
		{
		  x: 50, y: 40,
		  dx: -50, dy: -40,
		  subject: { radius: 5},
			connector: {
				type: 'line',
			},
			disable: ['note'],
			data: {color: colors.blue},
		},
		{
		  x: 50, y: 70,
		  dx: -30, dy: 30,
		  subject: { radius: 5 },
			disable: ['note'],
			data: {color: colors.green},
		},
		{
			x: 20, y: 100,
		  subject: { radius: 7.5},
			disable: ['note', 'connector'],
			data: {color: colors.pink},
		},
		// 2nd set 'M-20,100 C-50,70 -50,40 0,0'
		{
		  x: -50, y: 70,
		  dx: 30, dy: 30,
		  subject: { radius: 5},
			disable: ['note'],
			data: {color: colors.blue},
		},
		{
		  x: -50, y: 40,
		  dx: 50, dy: -40,
		  subject: { radius: 5 },
			connector: {
				type: 'line',
			},
			disable: ['note'],
			data: {color: colors.green},
		},
		{
			x: 0, y: 0,
		  subject: { radius: 7.5},
			disable: ['note', 'connector'],
			data: {color: colors.pink},
		}
	];
	var makeAnnotations = d3.annotation()
	 .type(d3.annotationCalloutCircle)
	 .annotations(annotationsData);

	pt.codeFlowers = pt.codeFlowers || {};
	pt.codeFlowers.timeline = timeline;
	pt.codeFlowers.duration = duration;

	pt.codeFlowers.init = function() {
		// remove existing svg
		d3.select('#code-flowers-svg #codeFlowers svg').remove();

		svg = d3.select('#code-flowers-svg #codeFlowers')
			.append('svg')
			.attr('width', width).attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + [width / 2, height / 2] + ')scale(' + scale + ')')
			.style('isolation', 'isolate');

		// blur effect taken from visualcinnamon:
    // http://www.visualcinnamon.com/2016/05/real-life-motion-effects-d3-visualization.html
    var defs = svg.append("defs");
    defs.append("filter")
      .attr("id", "motionFilter") 	//Give it a unique ID
      .attr("width", "300%")		//Increase the width of the filter region to remove blur "boundary"
      .attr("x", "-100%") 			//Make sure the center of the "width" lies in the middle of the element
      .append("feGaussianBlur")	//Append a filter technique
      .attr("in", "SourceGraphic")	//Perform the blur on the applied element
      .attr("stdDeviation", "8 8");	//Do a blur of 8 standard deviations in the horizontal and vertical direction

		// add in colors
		petalColors = svg.selectAll('.petalColor')
			.data(['#CBF2BD', '#AFE9FF', '#FFC8F0'])
			.enter().append('circle')
			.classed('petalColor', true)
			.attr('transform', (d, i) => 'rotate(' + [i * 120] + ')')
			.attr('cy', 40)
			.attr('r', 60)
			.attr('fill', d => d)
			.style('opacity', 1)
			.style('mix-blend-mode', 'multiply')
			.style("filter", "url(#motionFilter)");
		// petals
		petals = svg.selectAll('.petal')
			.data(_.times(6, () => linesDraw))
			.enter().append('g')
			.classed('petal', true)
			.attr('transform', (d, i) => 'rotate(' + (i * 60) + ', 0, 0)');
		allPetalLines = petals.selectAll('.petalLine')
			.data(d => d).enter().append('path')
			.classed('petalLine', true)
			.attr('d', d => d)
    	.attr('stroke', strokeColor)
    	.attr('stroke-width', 2)
    	.attr('fill', 'none')
			.attr('stroke-dasharray', function(d) {return this.getTotalLength()})
			.attr('stroke-dashoffset', 0)
			.style('opacity', 1);
		// petalLines of first petal
		petalLines = d3.select(petals.node()).selectAll('.petalLine');

		// annotations
		annotations = svg.append("g")
		  .classed("annotation-group", true)
		  .call(makeAnnotations)
			.selectAll('.annotation')
			.attr('fill', 'none')
    	.attr('stroke-width', 1.5)
			.attr('stroke-dasharray', '2 2')
			.attr('stroke', d => d.data.color)
			.style('opacity', 0);

		// code directions
		directions = d3.selectAll('#code-flowers-svg .code')
			.style('opacity', (d, i) => i === 0 ? 1 : 0);

		// get animations ready
		timeline.add(animateSceneOne(), 'one');
		timeline.add(animateSceneTwo(), 'two');
		timeline.add(animateSceneThree(), 'three');
		timeline.add(animateSceneFour(), 'four');
		timeline.add(animateSceneFive(), 'five');
	}

	///////////////////////////////////////////////////////////////////////////
	////////// helper functions ///////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	function animateSceneOne() {
		// animate first curve in
		var tl = new TimelineLite();
		tl.add('show');

		// set everything to starting point
		// all petal lines should have stroke-dashoffset equal to their length
		allPetalLines.each(function() {
			tl.set(this, {attr: {'stroke-dashoffset': this.getTotalLength()}}, 'show+=0.01');
		});
		// set the rotation back to 0
		tl.set(petals.nodes(), {attr: {transform: 'rotate(0, 0, 0)'}}, 'show+=0.01');
		// set colors to 0
		tl.set(petalColors.nodes(), {opacity: 0}, 'show+=0.01');

		// animate petal offset
		var petal0 = petalLines.node();
		tl.to(petal0, duration, {attr: {'stroke-dashoffset': 0}}, 'show+=0.01');
		// show annotations
		var annotationDuration = duration / 4;
		var [a1, a2, a3] = annotations.nodes();
		tl.to(a1, annotationDuration, {opacity: 1}, 'show');
		tl.to(a2, annotationDuration, {opacity: 1}, 'show+=' + duration / 2);
		tl.to(a3, annotationDuration, {opacity: 1}, 'show+=' + (duration - annotationDuration));
		// show direction
		tl.to(directions.nodes()[1], duration / 2, {opacity: 1}, 'show');

		return tl;
	}

	function animateSceneTwo() {
		// animate the two lines
		var tl = new TimelineLite();
		tl.add('show');

		// animate petal offset
		tl.to(petalLines.node(), duration / 2, {opacity: 0.25}, 'show');
		tl.staggerTo(petalLines.nodes().slice(1, 3), duration / 2,
			{attr: {'stroke-dashoffset': 0}}, duration / 2, 'show');

		// fade away annotations
		tl.to(annotations.nodes().slice(0, 3), duration / 2, {opacity: 0}, 'show');

		// show direction
		tl.to(directions.nodes().slice(0, 2), duration / 2, {opacity: 0.25}, 'show');
		tl.staggerTo(directions.nodes().slice(2, 4), duration / 2,
			{opacity: 1}, duration / 2, 'show');

		return tl;
	}

	function animateSceneThree() {
		// animate last curve
		var tl = new TimelineLite();
		tl.add('show');

		// animate petal offset
		var petal3 = petalLines.nodes()[3];
		tl.to(petalLines.nodes().slice(1, 3), duration / 2, {opacity: 0.25}, 'show');
		tl.to(petal3, duration, {attr: {'stroke-dashoffset': 0}}, 'show');
		// show annotations
		var annotationDuration = duration / 4;
		var [a1, a2, a3] = annotations.nodes().slice(3, 6);
		tl.to(a1, annotationDuration, {opacity: 1}, 'show');
		tl.to(a2, annotationDuration, {opacity: 1}, 'show+=' + duration / 2);
		tl.to(a3, annotationDuration, {opacity: 1}, 'show+=' + (duration - annotationDuration));

		// show direction
		tl.to(directions.nodes().slice(0, 4), duration / 2, {opacity: 0.25}, 'show');
		tl.to(directions.nodes()[4], duration / 2, {opacity: 1}, 'show');

		return tl;
	}

	function animateSceneFour() {
		// animate rotation
		var tl = new TimelineLite();
		tl.add('show');

		// 1. animate annotations away
		// 2. set all petals to dashoffset 0, opacity 1
		// 3. make all directions opacity 1
		// 4. rotate all petals
		// 5. add in colors
		tl.to(annotations.nodes(), duration / 4, {opacity: 0})
			.to(allPetalLines.nodes(), duration / 2, {opacity: 1, attr: {'stroke-dashoffset': 0}})
			.to(directions.nodes().slice(0, 5), duration / 2, {opacity: 1}, '-=' + duration / 2)
			.staggerTo(petals.nodes(), duration / 2, {
				cycle: {attr: function(i) {return {transform: 'rotate(' + (i * 60) + ',0,0)'}}},
			});

		return tl;
	}

	function animateSceneFive() {
		// animate rotation
		var tl = new TimelineLite();
		tl.to(petalColors.nodes(), duration / 2, {opacity: 1});

		return tl;
	}

})();

(function () {
	// properties and d3 initializations
	var width = 500;
	var height = 500;
	var scale = 2.5;
	var strokeColor = '#444';
	var svg, petals, petalLines, annotations, directions;

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

	pt.codeFlowers.init = function() {
		// remove existing svg
		d3.select('#code-flowers-svg #codeFlowers svg').remove();

		svg = d3.select('#code-flowers-svg #codeFlowers')
			.append('svg')
			.attr('width', width).attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + [width / 2, height / 2] + ')scale(' + scale + ')');

		// petals
		petals = svg.selectAll('.petal')
			.data(_.times(6, () => linesDraw))
			.enter().append('g')
			.classed('petal', true);
		petals.selectAll('.petalLine')
			.data(d => d).enter().append('path')
			.classed('petalLine', true)
			.attr('d', d => d)
    	.attr('stroke', strokeColor)
    	.attr('stroke-width', 2)
    	.attr('fill', 'none')
			.attr('stroke-dasharray', function(d) {return this.getTotalLength()})
			.attr('stroke-dashoffset', function(d) {return this.getTotalLength()});
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
	}

	pt.codeFlowers.animateOne = function() {
		// timeline.seek('one');
		timeline.tweenTo('one+=' + duration);
	}
	pt.codeFlowers.animateTwo = function() {
		timeline.tweenTo('two+=' + duration);
	}

	///////////////////////////////////////////////////////////////////////////
	////////// helper functions ///////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	function animateSceneOne() {
		// animate first curve in
		var tl = new TimelineLite();
		tl.add('show');

		// animate petal offset
		var petal0 = petalLines.node();
		tl.to(petal0, duration, {attr: {'stroke-dashoffset': 0}});
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
		tl.staggerTo(petalLines.nodes().slice(1, 3), duration / 2,
			{attr: {'stroke-dashoffset': 0}}, duration / 2);

		// fade away annotations
		tl.to(annotations.nodes().slice(0, 3), duration / 2, {opacity: 0}, 'show');

		// show direction
		tl.to(directions.nodes().slice(0, 2), duration / 2, {opacity: 0.25}, 'show');
		tl.staggerTo(directions.nodes().slice(2, 4), duration / 2,
			{opacity: 1}, duration / 2, 'show');

		return tl;
	}

})();

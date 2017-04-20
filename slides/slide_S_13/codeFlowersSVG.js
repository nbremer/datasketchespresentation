(function () {
	// properties and d3 initializations
	var width = 500;
	var height = 500;
	var scale = 2.5;
	var strokeColor = '#444';
	var svg, petalLines;

	var colors = {green: '#55e851', blue: '#51aae8', pink: '#a651e8'}
	var linesDraw = [
    'M0,0',
    'M0,0 C50,40 50,70 20,100',
    'M20,100 L0,85',
    'M0,85 L-20,100',
    'M-20,100 C-50,70 -50,40 0,0'
  ];
	var annotations = [
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
	 .annotations(annotations);

	pt.codeFlowers = pt.codeFlowers || {};

	pt.codeFlowers.init = function() {
		// remove existing svg
		d3.select('#code-flowers-svg #codeFlowers svg').remove();

		svg = d3.select('#code-flowers-svg #codeFlowers')
			.append('svg')
			.attr('width', width).attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + [width / 2, height / 2] + ')scale(' + scale + ')');

		var petalLines = svg.selectAll('.petalLine')
			.data(linesDraw).enter().append('path')
			.classed('petalLine', true)
			.attr('d', d => d)
    	.attr('stroke', strokeColor)
    	.attr('stroke-width', 2)
    	.attr('fill', 'none');

		svg.append("g")
		  .classed("annotation-group", true)
		  .call(makeAnnotations)
			.selectAll('.annotation')
			.attr('fill', 'none')
    	.attr('stroke-width', 1.5)
			.attr('stroke-dasharray', '2 2')
			.attr('stroke', d => d.data.color);

	}

	///////////////////////////////////////////////////////////////////////////
	////////// helper functions ///////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

})();

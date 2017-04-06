(function () {
	// properties and d3 initializations
	var margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
	var width = window.innerWidth - margin.left - margin.right;
	var height = window.innerHeight - margin.top - margin.bottom;

	var radius = 3;
	var duration = 500;
	var fontColor = '#666';
	var radiusExtent = d3.extent(hamiltonLines, line => line.data[3]);
	var radiusScale = d3.scaleLinear()
		.domain(radiusExtent)
		.range([radius, radius * 5]);

	var simulation = d3.forceSimulation()
		.force('collide', d3.forceCollide().radius(d => d.radius + 2))
		.force('x', d3.forceX().x(d => d.focusX))
		.force('y', d3.forceY().y(d => d.focusY))
		.alphaMin(0.4)
		.stop();
	var svg, circles, text, diamonds, staffs, curves;

	pt.sketchLines = pt.sketchLines || {};

	pt.sketchLines.init = function() {
		//Remove any existing svgs
		d3.select('#sketch-lines #sketchLines svg').remove();

		// initiate SVG elements
		svg = d3.select('#sketch-lines #sketchLines')
			.append('svg')
			.attr('width', width).attr('height', height);
		svg.append('g').classed('staffs', true);
		svg.append('g').classed('circles', true);
		svg.append('g').classed('diamonds', true);
		svg.append('g').classed('curves', true);
		svg.append('g').classed('texts', true);

		pt.sketchLines.drawLines(hamiltonAllLines);
	}

	///////////////////////////////////////////////////////////////////////////
	////////// draw lines/diamonds/songs //////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	var prevLines;
	pt.sketchLines.drawLines = function(lines, animateBefore, triggerForce, callback) {
		if (prevLines) {
			_.each(lines, line => {
				var prevLine = _.find(prevLines, prevLine => prevLine.id === line.id);
				if (!prevLine) return;
				line.x = prevLine.x;
				line.y = prevLine.y;
			});
		}
		prevLines = lines;

		// first create data of ALL the lines
		circles = svg.select('.circles')
			.selectAll('path')
			.data(lines, (d) => d.id);

		circles.exit().remove();

		var enter = circles.enter().append('path')
			.attr('fill', (d) => d.fill)
			.attr('d', drawPath);

		// enter+update
		circles = enter.merge(circles)
			.attr('opacity', 1);

		if (animateBefore) {
			circles.transition().duration(duration)
				.attr('d', drawPath)
				.on('end', (d, i) => {
					// if they have all ended, then force layout
					if (i === lines.length - 1) {
						positionLines(lines, triggerForce, callback);
					}
				});
		} else {
			positionLines(lines, triggerForce, callback);
		}

	}

	pt.sketchLines.drawThemes = function(themes) {
		var transition = d3.transition().duration(duration);

		diamonds = svg.select('.diamonds').selectAll('g')
      .data(themes, (d) => d.id);

    diamonds.exit().remove();

    var enter = diamonds.enter().append('g')
      .classed('diamond', true)
			.attr('opacity', 0)
      .style('cursor', 'pointer');

    diamonds = enter.merge(diamonds)
			.attr('stroke', (d) => d.fill)
      .attr('fill', (d) => d.fill);

		diamonds.transition(transition)
			.attr('opacity', 1);

    diamonds.selectAll('path')
      .data((d) => d.positions)
      .enter().append('path');
    diamonds.filter((d) => d.positions.length > 1)
      .append('line');

    diamonds.selectAll('path')
      .attr('transform', (d) => 'translate(' + [d.x, d.y]+ ')')
      .attr('d', (d) => 'M0,-' + d.size + ' L' + d.size + ',0 L0,' + d.size + ' L-' + d.size + ',0 Z');

    // only draw lines for those with two positions
    diamonds.selectAll('line')
      .attr('x1', (d) => d.positions[0].x)
      .attr('x2', (d) => d.positions[1].x)
      .attr('y1', (d) => d.positions[0].y)
      .attr('y2', (d) => d.positions[1].y)
      .attr('stroke', (d) => d.fill);
	}

	pt.sketchLines.drawSongs = function(songs, textAnchor) {
		var transition = d3.transition().duration(duration);
		var fontSize = 12;

		text = svg.select('.texts')
			.selectAll('.song')
			.data(songs, song => song.id);

		text.exit().remove();

		var enter = text.enter().append('g')
			.classed('song', true);
		enter.append('rect')
			.attr('width', fontSize * 12)
			.attr('height', fontSize + 4)
			.attr('y', -fontSize / 2 - 2)
			.attr('fill', '#fff')
			.attr('opacity', 0.85);
		enter.append('text')
			.attr('dy', '.35em')
			.attr('font-size', 14);

		text = enter.merge(text)
			.attr('opacity', 1)
			.attr('transform', d => 'translate(' + [d.x, d.y] + ')');

		text.transition(transition)
			.attr('opacity', 1);

		text.select('rect')
			.attr('x', textAnchor === 'start' ? 0 : -fontSize * 6)
		text.select('text')
			.attr('text-anchor', textAnchor)
			.text(d => d.name);
	}

	pt.sketchLines.drawStaffs = function(songs) {
    staffs = svg.select('.staffs')
			.selectAll('.staff')
      .data(songs, d => d.id);

    staffs.exit().remove();

    staffs = staffs.enter().append('g')
      .classed('staff', true)
			.merge(staffs)
      .attr('transform', d => 'translate(' + [d.x, d.y] + ')');

    updateRows();
    updateColumns();
	}

	pt.sketchLines.drawCurves = function(themes) {
		var fontSize = 9;
    curves = svg.select('.curves')
			.selectAll('.curve')
      .data(themes, d => d.id);

		curves.exit().remove();

		var enter = curves.enter().append('g')
			.classed('curve', true);
		enter.append('path')
			.attr('fill', 'none')
			.attr('stroke', fontColor);
		enter.append('text')
			.attr('font-style', 'italic')
			.attr('font-size', fontSize)
			.attr('fill', fontColor);

		curves = enter.merge(curves);
		curves.select('path')
			.attr('d', d => drawCurves(d, fontSize));
		curves.select('text')
			.attr('x', d => d.x2 - fontSize)
			.attr('y', d => d.y1)
			.text(d => d.themeType[0].toLowerCase() + d.groupId)

	}

	///////////////////////////////////////////////////////////////////////////
	////////// helper functions ///////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	pt.sketchLines.lowerOpacity = function() {
		var transition = d3.transition().duration(duration);
		var opacity = 0.25;
		circles
			.transition(transition)
			.attr('opacity', opacity);

		diamonds
			.transition(transition)
			.attr('opacity', opacity);

		text
			.transition(transition)
			.attr('opacity', opacity);
	}

	function positionLines(lines, triggerForce, callback) {
		if (triggerForce) {
			simulation.nodes(lines)
				.on('tick', () => {
					circles.attr('transform', (d) => 'translate(' + [d.x, d.y] + ')');
				}).on('end', () => {
					afterPositionLines(callback);
				}).alpha(0.75).restart();
		} else {
			afterPositionLines(callback);
		}
	}

	function afterPositionLines(callback) {
		circles.transition().duration(duration)
			.attr('transform', (d) => {
				// set the x and y to its focus (where it should be)
				d.x = d.focusX;
				d.y = d.focusY;
				return 'translate(' + [d.x, d.y] + ')';
			}).attr('d', drawPath);

		callback && callback();
	}

	function drawPath(d) {
		var x1 = d.radius - d.fullRadius;
		var y1 = -d.radius;
		var length = d.length - 2 * d.radius;
		var x2 = x1 + length;
		var y2 = d.radius

		var result = 'M' + [x1, y1];
		result += ' L' + [x2, y1];
		result += ' A' + [d.radius, d.radius] + ' 0 0,1 ' + [x2, y2];
		result += ' L' + [x1, y2];
		result += ' A' + [d.radius, d.radius] + ' 0 0,1 ' + [x1, y1];
		result += 'Z';

		return result;
	}

	function drawCurves(d, fontSize) {
		var x = d.x2 - fontSize;
    var y = d.y2;
		if ((x - d.x1) * 0.25 <= fontSize) return '';

		var cpx = (x - d.x1) * 0.25 + d.x1;
    var cpy = y - 0.85 * fontSize;

		return 'M' + [d.x1, y] + ' C' + [cpx, cpy, x, cpy, x, cpy];
	}

	function updateRows() {
		var rows = staffs.selectAll('.row')
			.data(d => {
				return _.map(d.rows, row => {
					return {
						x2: d.width,
						y1: row,
						y2: row,
					};
				});
			});
		rows.exit().remove();
		rows.enter().append('line')
			.classed('row', true)
			.merge(rows)
			.attr('x2', d => d.x2)
			.attr('y1', d => d.y1)
			.attr('y2', d => d.y2)
			.attr('stroke', fontColor);
	}

	function updateColumns() {
		var columns = staffs.selectAll('.column')
			.data(d => {
				return _.map(d.columns, column => {
					return {
						x1: column[1],
						x2: column[1],
						y2: d.height,
						strokeWidth: column[0],
					};
				});
			});
		columns.exit().remove();
		columns.enter().append('line')
			.classed('column', true)
			.attr('stroke', fontColor)
			.merge(columns)
			.attr('x1', d => d.x1)
			.attr('x2', d => d.x2)
			.attr('y2', d => d.y2)
			.attr('stroke-width', d => d.strokeWidth);
	}
})();

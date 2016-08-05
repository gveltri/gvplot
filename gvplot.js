///////  gvplot.js
// A plotting library built on top of D3.
// Gerardo Veltri gerardo.veltri@gmail.com

var GVPLOT = (function () {

    var gvplot = {};

    gvplot.barplot = function () {
        var height = 300,
            width = 700,
            margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            xValue = function(d) { return d.x },
            yValue = function(d) { return d.y },
            plotPadding = 0,
            interactive = true,
            xLabel = 'x',
            yLabel = 'y',
            tooltip = d3.select("body").append("div")
            .attr("class", "tooltip tooltip-barplot")
            .style("opacity", 0),
            mouseOver = function(d) {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);
                tooltip.html( xLabel + ": " + xValue(d) +
                              "<br>" + yLabel + ": " + yValue(d))
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

                d3.select(this).transition()
                    .duration(50)
                    .style("fill", "blue");
            },
            mouseOut = function(d) {
                d3.select(this).transition()
                    .duration(100)
                    .style("fill", "steelblue");
                tooltip.transition()
                    .duration(300)
                    .style("opacity", 0);
            },
            click = function(d) {
            },
            beforeCreation = function() {},
            afterCreation = function() {};

        // main function
        function my(selection) {

            beforeCreation()

            selection.each(function(data) {

                width = $(this).width() - margin.left - margin.right;

                var xScale = d3.scale.ordinal().rangeRoundBands([0,width], .4),
                    xMap = function(d) { return xScale(xValue(d)); },
                    yScale = d3.scale.linear().range([height, 0]),
                    yMap = function(d) { return yScale(yValue(d)); };

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .outerTickSize(0);

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .innerTickSize(-width)
                    .outerTickSize(0);

                var svg = d3.select(this).selectAll("svg").data([data]);
                svg.enter().append("svg");

                if (svg.selectAll('g')[0].length == 0) {
                    var initialData = true;
                }
                else {
                    var initialData = false;
                }
                var g = svg.selectAll("g").data([data]);

                g.enter()
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

                svg
                    .attr("class", "gvplot-barplot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

                yScale.domain([0,d3.max(data, yValue) + plotPadding]);
                xScale.domain(data.map(xValue));

                if (initialData) {
                    g.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + 0 + "," + height + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("x", width)
                        .attr("y", -6)
                        .style("text-anchor", "end")
                        .text(xLabel);

                    g.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(yLabel);
                }
                else {
                    g.select('g.x.axis')
                        .transition()
                        .duration(1000)
                        .call(xAxis);
                    g.select('g.y.axis')
                        .transition()
                        .duration(1000)
                        .call(yAxis);
                }

                var bars = g.selectAll(".bar")
                    .data(data, xValue); // join on x-value, change in future to allow more interesting joins

                bars.transition("transition-position")
                    .duration(1000)
                    .attr("x", xMap)
                    .attr("y", yMap)
                    .attr("height", function(d) { return height - yMap(d); } );

                bars.enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", xMap)
                    .attr("y", height)
                    .attr("height", 0)
                    .attr("width", xScale.rangeBand());
                bars.transition("transition-position")
                    .duration(1000)
                    .attr("x", xMap)
                    .attr("y", yMap)
                    .attr("height", function(d) { return height - yMap(d); } );
                bars.exit()
                    .transition(200)
                    .attr("height", 0)
                    .attr("y", height)
                    .each("end", function(d) { this.remove() });

                if (interactive) {
                    bars
                        .on("mouseover", mouseOver)
                        .on("mouseout", mouseOut)
                        .on("click", click);
                }


            }

                          );

            afterCreation();

        }

        my.resize = function() {
        };

        // accessors
        my.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return my;
        };

        my.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return my;
        };

        my.margin = function(value) {
            if (!arguments.length) return margin;
            margin = value;
            return my;
        };

        my.xValue = function(value) {
            if (!arguments.length) return xValue;
            xValue = value;
            return my;
        };

        my.yValue = function(value) {
            if (!arguments.length) return yValue;
            yValue = value;
            return my;
        };

        my.plotPadding = function(value) {
            if (!arguments.length) return plotPadding;
            plotPadding = value;
            return my;
        };

        my.interactive = function(value) {
            if (!arguments.length) return interactive;
            interactive = value;
            return my;
        };

        my.xLabel = function(value) {
            if (!arguments.length) return xLabel;
            xLabel = value;
            return my;
        };

        my.yLabel = function(value) {
            if (!arguments.length) return yLabel;
            yLabel = value;
            return my;
        };

        my.mouseOver = function(value) {
            if (!arguments.length) return mouseOver;
            mouseOver = value;
            return my;
        };

        my.mouseOut = function(value) {
            if (!arguments.length) return mouseOut;
            mouseOut = value;
            return my;
        };

        my.click = function(value) {
            if (!arguments.length) return click;
            click = value;
            return my;
        };

        my.beforeCreation = function(value) {
            if (!arguments.length) return beforeCreation;
            beforeCreation = value;
            return my;
        };

        my.afterCreation = function(value) {
            if (!arguments.length) return afterCreation;
            afterCreation = value;
            return my;
        };

        return my;

    };

    gvplot.scatterPlot = function () {
        var height = 300,
            width = 700,
            margin = {
                top: 30,
                right: 20,
                bottom: 30,
                left: 40
            },
            xValue = function(d) { return d.x },
            yValue = function(d) { return d.y },
            zValue = function(d) { return d.z },
	    wValue = null,
	    jValue = xValue,
	    coloration = ['red', 'white', 'green'],
            plotPadding = 'auto',
            interactive = true,
            xLabel = 'x',
            yLabel = 'y',
	    zLabel = 'z',
            wLabel = 'w',
	    tooltipTitle = null,
            tooltip = d3.select("body").append("div")
            .attr("class", "tooltip tooltip-scatterplot")
            .style("opacity", 0),
	    customTooltip = null,
            click = function(d) {
            },
            beforeCreation = function() {},
            afterCreation = function() {},
            bubblePlot = false,
	    zoomable = false,
	    plotTitle = null,
	    trendLine = false;

        // main function
        function my(selection) {

            beforeCreation()

            selection.each(function(data) {

                width = $(this).width() - margin.left - margin.right;

                var xScale = d3.scale.linear().range([0,width]),
                    xMap = function(d) { return xScale(xValue(d)); },
                    yScale = d3.scale.linear().range([height, 0]),
                    yMap = function(d) { return yScale(yValue(d)); };

		if (wValue != null) {
		    var pivot_w = d3.median(data, wValue),
			max_w = d3.max(data, wValue),
			min_w = d3.min(data, wValue);
		    
		    var cValue = wValue,
			cScale = d3.scale.linear().domain([min_w,pivot_w,max_w]).range(coloration),
			cMap = function(d) { return cScale(cValue(d)); }
		}
                else {
		    var cValue = zValue,
			cScale = d3.scale.category20(),
			cMap = function(d) { return cScale(cValue(d)); }
		}


                if (bubblePlot) {
                    data.sort(function(x1, x2) {
                        return d3.descending(zValue(x1), zValue(x2))
                    });

                    // make these variables accessible in future releases
                    var max_bubble_size = 50,
                        min_bubble_size = 20,
                        max_value_size = d3.max(data, zValue);

                    var zScale = d3.scale.linear().range([
                        min_bubble_size/max_value_size,
	                      max_bubble_size/max_value_size
                    ]),
                        zMap = function(d) { return 5 + zScale(zValue(d)) };
                }

                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .innerTickSize(-height)
                    .outerTickSize(0);

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .innerTickSize(-width)
                    .outerTickSize(0);

		
                var svg = d3.select(this).selectAll("svg").data([data]);
                svg.enter().append("svg");

                if (svg.selectAll('g')[0].length == 0) {
                    var initialData = true;
                }
                else {
                    var initialData = false;
		    if (interactive) {
			d3.select("body").selectAll('.tooltip.tooltip-scatterplot')
			    .style('opacity', 0);
		    }
                }
                var g = svg.selectAll("g").data([data]);

                g.enter()
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

                svg
                    .attr("class", "gvplot-scatterplot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

		var yMax = d3.max(data, yValue),
		    xMax = d3.max(data, xValue);

		if (plotPadding=='auto') {
		    var xplotPadding = xMax / 10,
			yplotPadding = yMax / 9;
		}
		else {
		    var xplotPadding = plotPadding,
			yplotPadding = plotPadding;
		}

                yScale.domain([0, yMax + yplotPadding]);
                xScale.domain([0, xMax + xplotPadding]);

		var zoom = d3.behavior.zoom()
		    .x(xScale)
		    .y(yScale)
		    .scaleExtent([1, 10])
		    .on("zoom", zoom);
		g.call(zoom);

		function zoom() {
		    zoom.translate(panLimit(
			zoom,
			{x: [-xplotPadding,xMax], y: [-yplotPadding,yMax]},
			xScale,
			yScale,
			height,
			width
		    ));
		    
		    g.select(".x.axis").call(xAxis);
		    g.select(".y.axis").call(yAxis);

		    g.selectAll(".point")
			.attr("cx", xMap)
			.attr("cy", yMap);

		    g.selectAll(".bubble-point")
			.attr("cx", xMap)
			.attr("cy", yMap);

		    g.selectAll('.trendline')
			.attr("x1", function(d) { return xScale(d[0]); })
			.attr("y1", function(d) { return yScale(d[1]); })
			.attr("x2", function(d) { return xScale(d[2]); })
			.attr("y2", function(d) { return yScale(d[3]); });
		}

		if (trendLine) {
		    var trendline = g.selectAll(".trendline")
			.data(trendLineFromData(data, xValue, yValue));
		}

                if (initialData) {
		    if (plotTitle != null) {
			plot_title = g.append("text")
		            .attr("x", (width / 2))
		            .attr("y", -5)
		            .attr("text-anchor", "middle")
		            .style("font-size", "16px")
		            .text(plotTitle);
		    }

		    if (trendLine) {
			trendline.enter()
			    .append("line")
			    .attr("class", "trendline")
			    .attr("x1", function(d) { return xScale(d[0]); })
			    .attr("y1", function(d) { return yScale(d[1]); })
			    .attr("x2", function(d) { return xScale(d[2]); })
			    .attr("y2", function(d) { return yScale(d[3]); })
			    .attr("stroke", "steelblue")
			    .attr("stroke-dasharray", ("3","5"))
			    .attr("stroke-width", 2)
			    .attr("clip-path", "url(#bubble-plot-clip)");
		    }
		    
		    g.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "space-selector");
		    
                    g.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(" + 0 + "," + height + ")")
                        .call(xAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("x", width)
                        .attr("y", -6)
                        .style("text-anchor", "end")
                        .text(xLabel);

                    g.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("class", "label")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(yLabel);

		    g.append("clipPath")
			.attr("id", "bubble-plot-clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);
                }
                else {
                    g.select('g.x.axis')
                        .transition()
                        .duration(1000)
                        .call(xAxis);
                    g.select('g.y.axis')
                        .transition()
                        .duration(1000)
                        .call(yAxis);
                }
		
                if (bubblePlot) {
                    var points = g.selectAll(".bubble-point")
                        .data(data, jValue);
                }
                else {
                    var points = g.selectAll(".point")
                        .data(data, xValue);
                }

		if (trendLine) {
		    trendline
			.transition()
			.duration(500)
			.attr("x1", function(d) { return xScale(d[0]); })
			.attr("y1", function(d) { return yScale(d[1]); })
			.attr("x2", function(d) { return xScale(d[2]); })
			.attr("y2", function(d) { return yScale(d[3]); });
		}

                points.enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("r", 0)
		    .attr("clip-path", "url(#bubble-plot-clip)");
		
                points.transition("transition-position")
                    .duration(1000)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("r", 0);

                if (bubblePlot) {
                    points
                        .attr("class", "bubble-point")
                        .attr("stroke-width", 1)
                        .attr("stroke", '#333')
                        .attr("fill", cMap)
                        .attr("opacity", 0.5);
                    points
                        .transition()
                        .duration(1000)
                        .attr("r", zMap);
                }
                else {
                    points
                        .attr("fill", "steelblue")
                        .attr("stroke", "steelblue");
                    points
                        .transition()
                        .duration(1000)
                        .attr("r", 4);
                }

                points.exit()
                    .transition(200)
                    .attr("r", 0)
                    .each("end", function(d) { this.remove() });

                if (interactive) {
                    points
                        .on("mouseover", function(d) {
			    var tooltip_text = customTooltip == null ? tooltipConstructor(d) : customTooltip(d);
			    d3.select(this).transition()
				.duration(50)
				.style("stroke-width", 3);			    
			    tooltip.transition()
				.duration(100)
				.style("opacity", 1);
			    tooltip.html(tooltip_text)
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
			})
                        .on("mouseout", function(d) {
			    tooltip.transition()
				.duration(300)
				.style("opacity", 0);

			    d3.select(this).transition()
				.duration(100)
				.style("stroke-width", 1);
			})
                        .on("click", click);

		    function tooltipConstructor(d) {
			var tooltip_text = xLabel + ": " + xValue(d).toFixed(2) + "<br>" + yLabel + ": " + yValue(d).toFixed(2);
			if (bubblePlot) {
			    tooltip_text = tooltip_text + "<br>" + zLabel + ": " + zValue(d).toFixed(2);
			}
			if (wValue != null) {
			    tooltip_text = tooltip_text + "<br>" + wLabel + ": " + wValue(d).toFixed(2);
			}
			if (tooltipTitle != null) {
			    tooltip_text = "<b>" + tooltipTitle(d) + "</b><br>" + tooltip_text;
			}
			return tooltip_text
		    }
                }

		if (initialData) {
		    var container = d3.select(this)[0];
		    window.addEventListener('resize', function() {
			width = $(container).width() - margin.left - margin.right,
			xScale = d3.scale.linear().range([0,width]),
			yScale = d3.scale.linear().range([height, 0]),
			xScale.domain([0,d3.max(data, xValue) + xplotPadding]),
			yScale.domain([0,d3.max(data, yValue) + yplotPadding]);
			svg
			    .transition()
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom);
			plot_title.transition()
			    .attr("x", (width / 2))
		            .attr("y", -5)
			g.select('g.y.axis')
			    .transition()
			    .call(yAxis.scale(yScale).innerTickSize(-width));
			g.select('g.x.axis')
			    .transition()
			    .call(xAxis.scale(xScale));
			g.select('g.x.axis').select('text.label')
			    .transition()
			    .attr("x", width);
			g.selectAll('.point')
			    .transition()
			    .attr("cx", xMap)
			    .attr("cy", yMap);
			g.selectAll('.bubble-point')
			    .transition()
			    .attr("cx", xMap)
			    .attr("cy", yMap);
			g.selectAll('.trendline')
			    .transition()
			    .attr("x1", function(d) { return xScale(d[0]); })
			    .attr("y1", function(d) { return yScale(d[1]); })
			    .attr("x2", function(d) { return xScale(d[2]); })
			    .attr("y2", function(d) { return yScale(d[3]); });
			g.select('clipPath').select('rect')
			    .transition()
			    .attr("width", width);
		    });
		}
		
            }
			   
			   
                          );
	    

            afterCreation();

	    
        }

        // accessors
        my.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return my;
        };

        my.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return my;
        };

        my.margin = function(value) {
            if (!arguments.length) return margin;
            margin = value;
            return my;
        };

        my.xValue = function(value) {
            if (!arguments.length) return xValue;
            xValue = value;
            return my;
        };

        my.yValue = function(value) {
            if (!arguments.length) return yValue;
            yValue = value;
            return my;
        };

        my.plotPadding = function(value) {
            if (!arguments.length) return plotPadding;
            plotPadding = value;
            return my;
        };

        my.interactive = function(value) {
            if (!arguments.length) return interactive;
            interactive = value;
            return my;
        };

        my.xLabel = function(value) {
            if (!arguments.length) return xLabel;
            xLabel = value;
            return my;
        };

        my.yLabel = function(value) {
            if (!arguments.length) return yLabel;
            yLabel = value;
            return my;
        };

	my.zLabel = function(value) {
            if (!arguments.length) return zLabel;
            zLabel = value;
            return my;
        };

	my.wLabel = function(value) {
            if (!arguments.length) return wLabel;
            wLabel = value;
            return my;
        };

        my.click = function(value) {
            if (!arguments.length) return click;
            click = value;
            return my;
        };

	my.customTooltip = function(value) {
            if (!arguments.length) return customTooltip;
            customTooltip = value;
            return my;
        };

        my.beforeCreation = function(value) {
            if (!arguments.length) return beforeCreation;
            beforeCreation = value;
            return my;
        };

        my.afterCreation = function(value) {
            if (!arguments.length) return afterCreation;
            afterCreation = value;
            return my;
        };

        my.bubblePlot = function(value) {
            if (!arguments.length) return bubblePlot;
            bubblePlot = value;
            return my;
        };

        my.zValue = function(value) {
            if (!arguments.length) return zValue;
            zValue = value;
            return my;
        };

	my.wValue = function(value) {
            if (!arguments.length) return wValue;
            wValue = value;
            return my;
        };

	my.coloration = function(value) {
            if (!arguments.length) return coloration;
            coloration = value;
            return my;
        };

	my.jValue = function(value) {
            if (!arguments.length) return jValue;
            jValue = value;
            return my;
        };

	my.tooltipTitle = function(value) {
            if (!arguments.length) return tooltipTitle;
            tooltipTitle = value;
            return my;
        };

	my.zoomable = function(value) {
            if (!arguments.length) return zoomable;
            zoomable = value;
            return my;
        };

	my.plotTitle = function(value) {
            if (!arguments.length) return plotTitle;
            plotTitle = value;
            return my;
        };

	my.trendLine = function(value) {
            if (!arguments.length) return trendLine;
            trendLine = value;
            return my;
        };

        return my;

    };

    return gvplot;

    function panLimit(zoom, panExtent, x, y, height, width) {
	var divisor = {h: height / ((y.domain()[1]-y.domain()[0])*zoom.scale()), w: width / ((x.domain()[1]-x.domain()[0])*zoom.scale())},
	    minX = -(((x.domain()[0]-x.domain()[1])*zoom.scale())+(panExtent.x[1]-(panExtent.x[1]-(width/divisor.w)))),
	    minY = -(((y.domain()[0]-y.domain()[1])*zoom.scale())+(panExtent.y[1]-(panExtent.y[1]-(height*(zoom.scale())/divisor.h))))*divisor.h,
	    maxX = -(((x.domain()[0]-x.domain()[1]))+(panExtent.x[1]-panExtent.x[0]))*divisor.w*zoom.scale(),
	    maxY = (((y.domain()[0]-y.domain()[1])*zoom.scale())+(panExtent.y[1]-panExtent.y[0]))*divisor.h*zoom.scale(),

	    tx = x.domain()[0] < panExtent.x[0] ?
	    minX :
	    x.domain()[1] > panExtent.x[1] ?
	    maxX :
	    zoom.translate()[0],
	    ty = y.domain()[0]  < panExtent.y[0]?
	    minY :
	    y.domain()[1] > panExtent.y[1] ?
	    maxY :
	    zoom.translate()[1];

	return [tx,ty];
    }

    function trendLineFromData(data, xValue, yValue) {
	var trend_line_data = data.slice()

	trend_line_data.sort(function(x1, x2) {
	    return d3.ascending(xValue(x1), xValue(x2))
	});

	var xSeries = trend_line_data.map(xValue),
	    ySeries = trend_line_data.map(yValue);
	var leastSquaresCoeff = leastSquares(xSeries, ySeries);

	var x1 = xSeries[0],
	    y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1],
	    x2 = xSeries[xSeries.length-1],
	    y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
	return [[x1,y1,x2,y2]];
    }

    function leastSquares(xSeries, ySeries) {
	var reduceSumFunc = function(prev, cur) { return prev + cur; };

	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
	    .reduce(reduceSumFunc);

	var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
	    .reduce(reduceSumFunc);

	var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
	    .reduce(reduceSumFunc);

	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

	return [slope, intercept, rSquare];
    }
    
}());


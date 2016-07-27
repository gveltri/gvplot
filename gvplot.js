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
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            xValue = function(d) { return d.x },
            yValue = function(d) { return d.y },
            zValue = function(d) { return d.z },
            plotPadding = 0,
            interactive = true,
            xLabel = 'x',
            yLabel = 'y',
            tooltip = d3.select("body").append("div")
            .attr("class", "tooltip tooltip-scatterPlot")
            .style("opacity", 0),
            mouseOver = function(d) {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);
                tooltip.html( xLabel + ": " + xValue(d) +
                              "<br>" + yLabel + ": " + yValue(d))
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

                if (bubblePlot) {
                    d3.select(this).transition()
                        .duration(50)
                        .style("stroke-width", 10);
                }
                else {
                    d3.select(this).transition()
                        .duration(50)
                        .style("stroke-width", 10);
                }
            },
            mouseOut = function(d) {
                tooltip.transition()
                    .duration(300)
                    .style("opacity", 0);

                if (bubblePlot) {
                    d3.select(this).transition()
                        .duration(100)
                        .style("stroke-width", 1);
                }
                else {
                    d3.select(this).transition()
                        .duration(100)
                        .style("stroke-width", 1);
                }
            },
            click = function(d) {
            },
            beforeCreation = function() {},
            afterCreation = function() {},
            bubblePlot = false;

        // main function
        function my(selection) {

            beforeCreation()

            selection.each(function(data) {

                width = $(this).width() - margin.left - margin.right;

                var xScale = d3.scale.linear().range([0,width]),
                    xMap = function(d) { return xScale(xValue(d)); },
                    yScale = d3.scale.linear().range([height, 0]),
                    yMap = function(d) { return yScale(yValue(d)); },
                    cValue = xValue,
	                  cScale = d3.scale.category20(),
                    cMap = function(d) { return cScale(cValue(d)); }


                if (bubblePlot) {
                    // sort bubbles so that smallest are drawn last
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
                }
                var g = svg.selectAll("g").data([data]);

                g.enter()
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

                svg
                    .attr("class", "gvplot-scatterplot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

                yScale.domain([0,d3.max(data, yValue) + plotPadding]);
                xScale.domain([0,d3.max(data, xValue) + plotPadding]);

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

                if (bubblePlot) {
                    var points = g.selectAll(".bubble-point")
                        .data(data, xValue);
                }
                else {
                    var points = g.selectAll(".point")
                        .data(data, xValue);
                }

                points.enter()
                    .append("circle")
                    .attr("class", "point")
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("r", 0);

                points.transition("transition-position")
                    .duration(1000)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("r", 0);

                if (bubblePlot) {
                    points
                        .attr("class", "bubble-point")
                        .attr("stroke-width", 1)
                        .attr("stroke", cMap)
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

        my.bubblePlot = function(value) {
            if (!arguments.length) return bubblePlot;
            bubblePlot = value;
            return my;
        };

        my.zValue = function(value) {
            if (!arguments.zValue) return zValue;
            zValue = value;
            return my;
        };

        return my;

    };

    return gvplot;

}());

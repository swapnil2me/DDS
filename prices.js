var marginStocks = { top: 30, right: 30, bottom: 30, left: 30 },
    widthStocks = 550 - marginStocks.left - marginStocks.right,
    heightStocks = 350 - marginStocks.top - marginStocks.bottom;

var parseDate = d3.timeParse("%x"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
    dateFormatter = d3.timeFormat("%m/%y");

var xsclScocks = d3.scaleTime()
        .range([0, widthStocks]);

var ysclScocks = d3.scaleLinear()
        .range([heightStocks, 0]);

var xAxisStocks = d3.axisBottom()
    .scale(xsclScocks)
    .tickFormat(dateFormatter);

var yAxisStocks = d3.axisLeft()
    .scale(ysclScocks)
    .tickFormat(d3.format(".0s"));

var lineStocks = d3.line()
    .x(function(d) { return xsclScocks(d.date); })
    .y(function(d) { return ysclScocks(d.likes); });

var lineAreaStocks = d3.area()
          .x(function(d){ return xsclScocks(d.x); })
          .y0(ysclScocks(0))
          .y1(function(d){ return ysclScocks(d.y); })
          .curve(d3.curveCardinal);

var smoothLineStocks = d3.line().curve(d3.curveCardinal)
					    .x(function(d){ return xsclScocks(d.date); })
					    .y(function(d){ return ysclScocks(d.likes); });

var svg = d3.select("#linePlot").append("svg")
    .attr("width", widthStocks + marginStocks.left + marginStocks.right)
    .attr("height", heightStocks + marginStocks.top + marginStocks.bottom)
    .append("g")
    .attr("transform", "translate(" + marginStocks.left + "," + marginStocks.top + ")");

d3.tsv("prices.tsv", function(error, data) {
    if (error) throw error;

    console.log(data[0].date);
    console.log(parseDate("5/10/2020"));

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.likes = +d.likes;
    });

    data.sort(function(a, b) {
        return a.date - b.date;
    });


    xsclScocks.domain([data[0].date, data[data.length - 1].date]);
    ysclScocks.domain(d3.extent(data, function(d) { return d.likes; }));
    svg.append("g")
        .attr("class", "xstock axisStock")
        .attr("transform", "translate(0," + heightStocks + ")")
        .call(xAxisStocks)
        .append("text")
        .attr("x", widthStocks)
        .attr("y", -5)
        .style("text-anchor", "end")
        .text("Month");

    svg.append("g")
        .attr("class", "ystock axisStock")
        .call(yAxisStocks)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 8)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price in USD");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", smoothLineStocks);

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 5);

    var focusBox = svg.append("g").attr("class", "toolBox").style("display", "none");

    focusBox.append("rect")
        .attr("class", "toolBox-rect")
        .attr("width", widthStocks/5.5)
        .attr("height", heightStocks/6)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focusBox.append("text")
        .attr("class", "toolBox-date")
        .attr("x", 18)
        .attr("y", -2);

    focusBox.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("Price:");

    focusBox.append("text")
        .attr("class", "toolBox-likes")
        .attr("x", 60)
        .attr("y", 18);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", widthStocks)
        .attr("height", heightStocks)
        .on("mouseover", function() { focus.style("display", null); focusBox.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); focusBox.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = xsclScocks.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        console.log(ysclScocks(d.likes) , heightStocks/2);
        xcord = xsclScocks(d.date)  < widthStocks/2 ? xsclScocks(d.date) : xsclScocks(d.date)-widthStocks/4;
        ycord = ysclScocks(d.likes) < heightStocks/1.25 ? ysclScocks(d.likes) : ysclScocks(d.likes)-heightStocks/6;
        focus.attr("transform", "translate(" + xsclScocks(d.date) + "," + ysclScocks(d.likes) + ")");
        focusBox.attr("transform", "translate(" + xcord + "," + ycord + ")");
        focusBox.select(".toolBox-date").text(dateFormatter(d.date));
        focusBox.select(".toolBox-likes").text(formatValue(d.likes));
    }
});

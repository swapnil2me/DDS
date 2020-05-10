var marginStocks = { top: 30, right: 30, bottom: 50, left: 50 },
    widthStocks = 550 - marginStocks.left - marginStocks.right,
    heightStocks = 350 - marginStocks.top - marginStocks.bottom;
var xBaxWidth = widthStocks/5.5;
var yBaxWidth = heightStocks/7;
var bottomShift = yBaxWidth / 1.5;

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
          .x(function(d){ return xsclScocks(d.date); })
          .y0(ysclScocks(0))
          .y1(function(d){ return ysclScocks(d.likes); })
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
    ysclScocks.domain(d3.extent([ysclScocks.domain()[0]-bottomShift,ysclScocks.domain()[1]+10]));
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
        .style("display", "null");

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
        .on("mouseover", function() { focus.style("display", null);
                                      focusBox.style("display", null);
                                      xBox.style("display", null);
                                      yBox.style("display", null);
                                    })
        // .on("mouseout", function() { focus.style("display", "none");
        //                              focusBox.style("display", "none");
        //                              xBox.style("display", "none");
        //                              yBox.style("display", "none");})
        .on("mousemove", mousemove);

    var xBox = svg.append("g").attr("class", "xBox").style("display", "none");
    var yBox = svg.append("g").attr("class", "yBox").style("display", "none");


    xBox.append("rect")
        .attr("class", "bax")
        .attr("width", xBaxWidth/1.5)
        .attr("height", yBaxWidth/1.5)
        .attr("x", -0.35*xBaxWidth)
        .attr("y", -0.47*yBaxWidth)
        .attr("rx", 4)
        .attr("ry", 4);

    yBox.append("rect")
        .attr("class", "bax")
        .attr("width", yBaxWidth)
        .attr("height", xBaxWidth/3)
        .attr("x", -1.1*yBaxWidth)
        .attr("y", -0.15*xBaxWidth)
        .attr("rx", 4)
        .attr("ry", 4);

    yBox.append("text")
        .attr("class", "baxText")
        .attr("x", -0.45*xBaxWidth)
        .attr("y", 7);

    xBox.append("text")
        .attr("class", "baxText")
        .attr("x", -0.30*xBaxWidth)
        .attr("y", 0);

    xBox.attr("transform", "translate(" + 0 + "," + 1.09*heightStocks + ")");
    yBox.attr("transform", "translate(" + 0 + "," + 0 + ")");

    var xGrid = svg.append("g").attr("class", "Grid");
    xGrid.append("rect")
        .attr("class", "xGrid")
        .attr("width", xBaxWidth*0.01)
        .attr("height", heightStocks)
        .attr("x", 0.0)
        .attr("y", 0);

    var yGrid = svg.append("g").attr("class", "Grid");
    yGrid.append("rect")
        .attr("class", "xGrid")
        .attr("width", widthStocks)
        .attr("height", yBaxWidth*0.01)
        .attr("x", 0.0)
        .attr("y", 0);

    function mousemove() {
        var x0 = xsclScocks.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        console.log(ysclScocks(d.likes) , heightStocks/2);
        xcord = xsclScocks(d.date)  < widthStocks/1.25 ? xsclScocks(d.date) : xsclScocks(d.date)-widthStocks/4;
        ycord = ysclScocks(d.likes) < heightStocks/1.25 ? ysclScocks(d.likes) : ysclScocks(d.likes)-heightStocks/6;
        focus.attr("transform", "translate(" + xsclScocks(d.date) + "," + ysclScocks(d.likes) + ")");
        focusBox.attr("transform", "translate(" + xcord + "," + 0 + ")");
        xBox.attr("transform", "translate(" + xsclScocks(d.date) + "," + 1.09*heightStocks + ")");
        yBox.attr("transform", "translate(" + 0 + "," + ysclScocks(d.likes) + ")");
        focusBox.select(".toolBox-date").text(dateFormatter(d.date));
        focusBox.select(".toolBox-likes").text(formatValue(d.likes));
        yBox.select(".baxText").text(formatValue(d.likes));
        xBox.select(".baxText").text(dateFormatter(d.date));
        xGrid.select(".xGrid")
              .attr("height", heightStocks-ysclScocks(d.likes))
              .attr("transform","translate(" + xsclScocks(d.date) + "," + ysclScocks(d.likes) + ")");
        yGrid.select(".xGrid").attr("transform","translate(" + 0 + "," + ysclScocks(d.likes) + ")");
    }
});

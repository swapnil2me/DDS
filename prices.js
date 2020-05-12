var marginStocks = { top: 30, right: 30, bottom: 50, left: 50 },
    widthStocks = 550 - marginStocks.left - marginStocks.right,
    heightStocks = 350 - marginStocks.top - marginStocks.bottom;
var xBaxWidth = widthStocks/5.5;
var yBaxWidth = heightStocks/7;
var bottomShift = yBaxWidth / 1.5;

var freqData=[{'State': 'MH', 'freq': {'P0': 6691, 'P1': 12508, 'P2': 12538}},
              {'State': 'GJ', 'freq': {'P0': 5765, 'P1': 10412, 'P2': 10856}},
              {'State': 'KA', 'freq': {'P0': 4750, 'P1': 8751, 'P2': 8352}},
              {'State': 'TN', 'freq': {'P0': 5260, 'P1': 9125, 'P2': 9326}},
              {'State': 'UP', 'freq': {'P0': 7071, 'P1': 11742, 'P2': 12404}},
              {'State': 'DL', 'freq': {'P0': 4076, 'P1': 7056, 'P2': 6497}},
              {'State': 'RJ', 'freq': {'P0': 3997, 'P1': 5874, 'P2': 5560}},
              {'State': 'MP', 'freq': {'P0': 4900, 'P1': 8599, 'P2': 8529}},
              {'State': 'WB', 'freq': {'P0': 4206, 'P1': 7992, 'P2': 7827}},
              {'State': 'GOA', 'freq': {'P0': 3782, 'P1': 5243, 'P2': 4731}}];

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


var lineStocks = d3.line()
    .x(function(d) { return xsclScocks(d.date); })
    .y(function(d) { return ysclScocks(d.shareValue); });

var lineAreaStocks = d3.area()
          .x(function(d){ return xsclScocks(d.date); })
          .y0(ysclScocks(0))
          .y1(function(d){ return ysclScocks(d.shareValue); })
          .curve(d3.curveCardinal);

var smoothLineStocks = d3.line().curve(d3.curveCardinal)
					    .x(function(d){ return xsclScocks(d.date); })
					    .y(function(d){ return ysclScocks(d.shareValue); });




d3.tsv("swap.tsv", function (error,tsvData) {
  // var clonedArray = JSON.parse(JSON.stringify(dataOuterFunction.slice(0,20)))
  // console.log(typeof(tsvData));
  // console.log(tsvData);
  var stateData = [],
      stateDataC1 = [],
      stateDataC2 = [];

  // setTimeout(() => {
  //   plotPrices(error, tsvData.slice(50,100));
  // },5000);
  selectStateAndPlot("MH")
  dashboard('#dashboard',freqData);

  function changeProductLine(pid) {
    let pids = [0,1,2];
    pids.map(function (id) {
      if (id === pid) {
        let swap = document.getElementsByClassName("lineC"+id+"")[0];
        swap.style["stroke-width"]=3;
      }else {
        let swap = document.getElementsByClassName("lineC"+id+"")[0];
        swap.style["stroke-width"]=1;
      }
      // if (pid !== 0) {
      //
      //   let iList = ["bax","toolBox","xBox","yBox","xGrid","yGrid","baxText"];
      //   iList.map((i) => {
      //     let emnt = document.getElementsByClassName(""+i+"")[0];
      //     console.log(emnt);
      //     if (emnt) {
      //       emnt.style.display="none";
      //     }
      //   })
      // }
    })
  }

  function selectStateAndPlot(stateTag) {
    stateData = [],
    stateDataC1 = [],
    stateDataC2 = [];
    // console.log(stateTag);
    tsvData.forEach(function(d) {
      if (d.STATES === stateTag) {
        stateData.push({"date":parseDate(d.month),"shareValue":+d.P1});
        stateDataC1.push({"date":parseDate(d.month),"shareValue":+d.P2});
        stateDataC2.push({"date":parseDate(d.month),"shareValue":+d.P3});
      }
    });
    plotPrices(error, stateData,stateDataC1,stateDataC2);
  }

  function plotPrices(error, data,dataC1,dataC2) {

      // console.log(data.length);
      if (error) throw error;

      var svgtest = d3.select("#linePlot").select("svg");
      if (!svgtest.empty()) {
        svgtest.remove();
      }

      var svg = d3.select("#linePlot").append("svg")
          .attr("width", widthStocks + marginStocks.left + marginStocks.right)
          .attr("height", heightStocks + marginStocks.top + marginStocks.bottom)
          .append("g")
          .attr("transform", "translate(" + marginStocks.left + "," + marginStocks.top + ")");


      xsclScocks.domain([data[0].date, data[data.length - 1].date]);
      ysclScocks.domain(d3.extent(data.concat(dataC1).concat(dataC2), function(d) { return d.shareValue; }));

      ysclScocks.domain(d3.extent([ysclScocks.domain()[0]-bottomShift,ysclScocks.domain()[1]+10]));
      // console.log(ysclScocks.domain());

      svg.append("g")
          .attr("class", "xstock axisStock")
          .attr("transform", "translate(0," + heightStocks + ")")
          .call(xAxisStocks.ticks(4))
          .append("text")
          .attr("x", widthStocks)
          .attr("y", -5)
          .style("text-anchor", "end")
          .text("Month");

      svg.append("g")
          .attr("class", "ystock axisStock")
          .call(yAxisStocks.ticks(4))
          .append("text")
          .attr("transform", "rotate(-90)","translate(-20,0)")
          .attr("y", 8)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Price in USD");

          //

      var linePath = svg.append("path");

      linePath.datum(data).transition().duration(10)
          .attr("class", "lineC0")
          .attr("d", smoothLineStocks);

      var linePathC1 = svg.append("path");

      linePathC1.datum(dataC1).transition().duration(10)
                .attr("class", "lineC1")
                .attr("d", smoothLineStocks);

      var linePathC2 = svg.append("path");

      linePathC2.datum(dataC2).transition().duration(10)
                .attr("class", "lineC2")
                .attr("d", smoothLineStocks);

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
          .text("Price:  ");

      focusBox.append("text")
          .attr("class", "toolBox-shareValue")
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
                                        xGrid.style("display", null);
                                        yGrid.style("display", null);
                                        changeProductLine(0);
                                        // updateLine();
                                      })
          // .on("mouseout", function() { focus.style("display", "none");
          //                              focusBox.style("display", "none");
          //                              xBox.style("display", "none");
          //                              yBox.style("display", "none");
          //                              xGrid.style("display", "none");
          //                              yGrid.style("display", "none");})
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

      var xGrid = svg.append("g").attr("class", "Grid").style("display", "none");
      xGrid.append("rect")
          .attr("class", "xGrid")
          .attr("width", xBaxWidth*0.01)
          .attr("height", heightStocks)
          .attr("x", 0.0)
          .attr("y", 0);

      var yGrid = svg.append("g").attr("class", "Grid").style("display", "none");
      yGrid.append("rect")
          .attr("class", "xGrid")
          .attr("width", widthStocks)
          .attr("height", yBaxWidth*0.01)
          .attr("x", 0.0)
          .attr("y", 0);

      var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "null");

      focus.append("circle")
          .attr("r", 5);


      // movePointer(xsclScocks(data[data.length-2].date),
      //             ysclScocks(data[data.length-2].shareValue),
      //             data[data.length-2]);

      function mousemove() {
          let x0 = xsclScocks.invert(d3.mouse(this)[0]),
              i = bisectDate(data, x0, 1),
              d0 = data[i - 1],
              d1 = data[i - 1],
              d = x0 - d0.date > d1.date - x0 ? d1 : d0,
              dt = xsclScocks(d.date),
              lk = ysclScocks(d.shareValue);
          // console.log(ysclScocks(d.shareValue) , heightStocks/2);
          movePointer(dt,lk,d);
      }

      function movePointer(xCord,yCord,dataPoint) {
        xcord = xCord  < widthStocks/1.25 ? xCord : xCord-widthStocks/4;

        focus.attr("transform", "translate(" + xCord + "," + yCord + ")");
        focusBox.transition().duration(100).attr("transform", "translate(" + xcord + "," + 0 + ")")
                .select(".toolBox-date").text(dateFormatter(dataPoint.date));
        focusBox.select(".toolBox-shareValue").text(formatValue(dataPoint.shareValue));

        xBox.transition().duration(10)
            .attr("transform", "translate(" + xCord + "," + 1.09*heightStocks + ")")
            .select(".baxText")
            .text(dateFormatter(dataPoint.date));
        yBox.transition().duration(10)
            .attr("transform", "translate(" + 0 + "," + yCord + ")")
            .select(".baxText").text(formatValue(dataPoint.shareValue));


        xGrid.transition().duration(10).select(".xGrid")
              .attr("height", heightStocks-yCord)
              .attr("transform","translate(" + xCord + "," + yCord + ")");
        yGrid.transition().duration(10).select(".xGrid")
              .attr("transform","translate(" + 0 + "," + yCord + ")");
      }

      // function updateLine() {
      //   console.log(data.slice(10,20));
      //   // console.log(svg.select(".line"));
      //   svg.select(".line").datum(data.slice(10,20))
      //       .attr("d",smoothLineStocks);
      // }
  }
  function dashboard(id, fData){
      var barColor = 'steelblue';
      function segColor(c){ return {P0:"#807dba", P1:"#e08214",P2:"#41ab5d"}[c]; }

      // compute total for each state.
      fData.forEach(function(d){d.total=d.freq.P0+d.freq.P1+d.freq.P2;});

      // function to handle histogram.
      function histoGram(fD){
          var hG={},    hGDim = {t: 100, r: 0, b: 30, l: 0};
          hGDim.w = 500 - hGDim.l - hGDim.r,
          hGDim.h = 300 - hGDim.t - hGDim.b;

          //create svg for histogram.
          var hGsvg = d3.select(id).append("svg")
              .attr("width", hGDim.w + hGDim.l + hGDim.r)
              .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
              .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

          // create function for x-axis mapping.
          var xScaleHist = d3.scaleBand().range([0, hGDim.w]).paddingInner(0.1)
                  .domain(fD.map(function(d) { return d[0]; }));

          // Add x-axis to the histogram svg.
          hGsvg.append("g").attr("class","hg-title").append("text").text("Key Markets")
                                                                  .attr("x",hGDim.w/2)
                                                                  .attr("y",-50)
                                                                  .attr("text-anchor", "middle");
          hGsvg.append("g").attr("class", "x dashAxis")
              .attr("transform", "translate(0," + hGDim.h + ")")
              .call(d3.axisBottom().scale(xScaleHist));

          // Create function for y-axis map.
          var yScaleHist = d3.scaleLinear().range([hGDim.h, 0])
                  .domain([0, d3.max(fD, function(d) { return d[1]; })]);

          // Create bars for histogram to contain rectangles and freq labels.
          var bars = hGsvg.selectAll(".bar").data(fD).enter()
                  .append("g").attr("class", "bar");

          //create the rectangles.
          bars.append("rect")
              .attr("class", "dashRect")
              .attr("x", function(d) { return xScaleHist(d[0]); })
              .attr("y", function(d) { return yScaleHist(d[1]); })
              .attr("width", xScaleHist.bandwidth())
              .attr("height", function(d) { return hGDim.h - yScaleHist(d[1]); })
              .attr('fill',barColor)
              .on("mouseover",mouseover)// mouseover is defined below.
              .on("mouseout",mouseout);// mouseout is defined below.

          //Create the frequency labels above the rectangles.
          bars.append("text").attr("class", "dashRectText").text(function(d){ return d3.format(",")(d[1])})
              .attr("x", function(d) { return xScaleHist(d[0])+xScaleHist.bandwidth()/2; })
              .attr("y", function(d) { return yScaleHist(d[1])-5; })
              .attr("text-anchor", "middle");

          var barBox = hGsvg.append("g").attr("class", "dashBarBox").style("display", "null");

          barBox.append("rect")
              .attr("class", "dashBarBox")
              .attr("width", xScaleHist.bandwidth())
              .attr("height", 5)
              .attr("x", 0)
              .attr("y", 0)
              .attr("rx", 4)
              .attr("ry", 4);

          // console.log();
          barBox.attr("transform", "translate(" + xScaleHist(fD[0][0]) + "," + hGDim.h + ")");

          function mouseover(d){  // utility function to be called on mouseover.
              // filter for selected state.
              var st = fData.filter(function(s){ return s.State == d[0];})[0],
                  nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
              barBox.select(".dashBarBox").transition().duration(200)
                .attr("transform", "translate(" + xScaleHist(d[0]) + "," + 0 + ")")
              // call update functions of pie-chart and legend.
              pC.update(nD);
              leg.update(nD);
              selectStateAndPlot(d[0]);
              // plotPrices(null, tsvData.slice(50,96));
              // console.log(d[0]);
          }

          function mouseout(d){    // utility function to be called on mouseout.
              // reset the pie-chart and legend.
              pC.update(tF);
              leg.update(tF);

          }

          // create function to update the bars. This will be used by pie-chart.
          hG.update = function(nD, color){
              // update the domain of the y-axis map to reflect change in frequencies.
              yScaleHist.domain([0, d3.max(nD, function(d) { return d[1]; })]);

              // Attach the new data to the bars.
              var bars = hGsvg.selectAll(".bar").data(nD);

              // transition the height and color of rectangles.
              bars.select("rect").transition().duration(500)
                  .attr("y", function(d) {return yScaleHist(d[1]); })
                  .attr("height", function(d) { return hGDim.h - yScaleHist(d[1]); })
                  .attr("fill", color);

              // transition the frequency labels location and change value.
              bars.select("text").transition().duration(500)
                  .text(function(d){ return d3.format(",")(d[1])})
                  .attr("y", function(d) {return yScaleHist(d[1])-5; });
          }
          return hG;
      }

      // function to handle pieChart.
      function pieChart(pD){
          piePadding = {t: 50, r: 0, b: 0, l: 0};
          var pC ={},    pieDim ={w:250, h: 250+piePadding.t};
          pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

          // create svg for pie chart.
          var piesvg = d3.select(id).append("svg").attr("class","pieChartGroup")
              .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
              .attr("transform", "translate("+pieDim.w/2+","+(pieDim.h/2+piePadding.t/2)+")");

          piesvg.append("text").attr("class","pi-title").text("Market Share")
                                                                  .attr("x",0)
                                                                  .attr("y",-130)
                                                                  .attr("text-anchor", "middle");

          // create function to draw the arcs of the pie slices.
          var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

          // create a function to compute the pie slice angles.
          var pie = d3.pie().sort(null).value(function(d) { return d.freq; });

          // Draw the pie slices.
          piesvg.selectAll("path").data(pie(pD)).enter()
              .append("path")
              .attr("class","dashPath")
              .attr("d", arc)
              .each(function(d) { this._current = d; })
              .style("fill", function(d) { return segColor(d.data.type); })
              .on("mouseover",mouseover).on("mouseout",mouseout);

          // create function to update pie-chart. This will be used by histogram.
          pC.update = function(nD){
              piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                  .attrTween("d", arcTween);
          }
          // Utility function to be called on mouseover a pie slice.
            function mouseover(d){
              // call the update function of histogram with new data.
              let plist = ['P1','P2','P0'];
              hG.update(fData.map(function(v){
                  return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));

              pid = plist.findIndex((i)=>i===d.data.type);
              changeProductLine(pid);
          }
          //Utility function to be called on mouseout a pie slice.
          function mouseout(d){
              // call the update function of histogram with all data.
              hG.update(fData.map(function(v){
                  return [v.State,v.total];}), barColor);

          }
          // Animating the pie-slice requiring a custom function which specifies
          // how the intermediate paths should be drawn.
          function arcTween(a) {
              var i = d3.interpolate(this._current, a);
              this._current = i(0);
              return function(t) { return arc(i(t));    };
          }
          return pC;
      }

      // function to handle legend.
      function legend(lD){
          var leg = {};

          // create table for legend.
          var legend = d3.select(id).append("table").attr('class','legend');

          // create one row per segment.
          var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

          // create the first column for each segment.
          tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
              .attr("width", '16').attr("height", '16')
        .attr("fill",function(d){ return segColor(d.type); });

          // create the second column for each segment.
          tr.append("td").text(function(d){ return d.type;});

          // create the third column for each segment.
          tr.append("td").attr("class",'legendFreq')
              .text(function(d){ return d3.format(",")(d.freq);});

          // create the fourth column for each segment.
          tr.append("td").attr("class",'legendPerc')
              .text(function(d){ return getLegend(d,lD);});

          // Utility function to be used to update the legend.
          leg.update = function(nD){
              // update the data attached to the row elements.
              var l = legend.select("tbody").selectAll("tr").data(nD);

              // update the frequencies.
              l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

              // update the percentage column.
              l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
          };


          function getLegend(d,aD){ // Utility function to compute percentage.
              let p = Math.max(0, d3.precisionFixed(0.05) - 2),
              f = d3.format("." + p + "%");
              return f(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
          }

          return leg;
      }

      // calculate total frequency by segment for all state.
      var tF = ['P0','P1','P2'].map(function(d){
          return {type:d,
                  freq: d3.sum(fData.map(function(t){
                                            return t.freq[d];
                                            }
                                        )
                              )
                };
          });

      // calculate total frequency by state for all segment.
      var sF = fData.map(function(d){return [d.State,d.total];});

      var hG = histoGram(sF), // create the histogram.
          pC = pieChart(tF), // create the pie-chart.
          leg= legend(tF);  // create the legend.
  }

});

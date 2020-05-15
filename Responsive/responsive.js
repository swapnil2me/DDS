d3.tsv("swap.tsv", function (error,tsvData) {

  if (error) {
    console.log(error);
  }

  var stateDataC0 = [],
      stateDataC1 = [],
      stateDataC2 = [];

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

  d3.select(window).on("resize",respond);
  respond()

  function respond() {

    let domWIDTH = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    let domMarginLR = 8;
    let emMarginLR = 2;

    WIDTHtr = (domWIDTH-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("topright")[0].offsetWidth;
    WIDTHtl = (domWIDTH-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("topleft")[0].offsetWidth;
    WIDTHbr = (domWIDTH-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("bottomright")[0].offsetWidth;
    WIDTHbl = (domWIDTH-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("bottomleft")[0].offsetWidth;
    // console.log(WIDTHtr);

    HEIGHTtr = 0.65*WIDTHtr;
    HEIGHTtl = 0.65*WIDTHtl;
    HEIGHTbr = 0.65*WIDTHbr;
    HEIGHTbl = 0.65*WIDTHbl;


    MARGINtr = {left:0.05*WIDTHtr,
                right:0.01*WIDTHtr,
                bottom:0.05*WIDTHtr,
                top:0.01*WIDTHtr
              };
    MARGINtl = {left:0.05*WIDTHtl,
                right:0.01*WIDTHtl,
                bottom:0.05*WIDTHtl,
                top:0.01*WIDTHtl
              };
    MARGINbr = {left:0.05*WIDTHbr,
                right:0.01*WIDTHbr,
                bottom:0.05*WIDTHbr,
                top:0.01*WIDTHbr
              };
    MARGINbl = {left:0.10*WIDTHbl,
                right:0.01*WIDTHbl,
                bottom:0.07*WIDTHbl,
                top:0.05*WIDTHbl
              };

    quadnames = ['topright','topleft','bottomright','bottomleft']

    quadnames.map((quad) => {
        let svgtest = d3.select("."+quad).select("svg");
        if (!svgtest.empty()) {
          // console.log("updating !");
          svgtest.remove();
        }
      })



    let svgtr = d3.select(".topright").append("svg").attr("height",HEIGHTtr+"px").attr("width",WIDTHtr+"px");
    let svgtl = d3.select(".topleft").append("svg").attr("height",HEIGHTtl+"px").attr("width",WIDTHtl+"px");
    let svgbr = d3.select(".bottomright").append("svg").attr("height",HEIGHTbr+"px").attr("width",WIDTHbr+"px");
    let svgbl = d3.select(".bottomleft").append("svg").attr("height",HEIGHTbl+"px").attr("width",WIDTHbl+"px");

    let chartGrouptr = svgtr.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHtr/2+","+ HEIGHTtr/2+")");
    let chartGrouptl = svgtl.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHtl/2+","+ HEIGHTtl/2+")");
    let chartGroupbr = svgbr.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHbr/2+","+ HEIGHTbr/2+")");
    let chartGroupbl = svgbl.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHbl/2+","+ HEIGHTbl/2+")");

    let rectGrouptr = svgtr.append("g").attr("class","rectGroup")
                         .attr("transform","translate("+WIDTHtr/2+","+ HEIGHTtr/2+")");

    let textGrouptr = svgtr.append("g").attr("class","textGroup")
                         .attr("transform","translate("+WIDTHtr/2+","+ HEIGHTtr/2+")");

    rectGrouptr.append("rect")
         .attr("width", WIDTHtr*0.2)
         .attr("height", HEIGHTtr*0.2)
         .attr("x", -WIDTHtr*0.2/2)
         .attr("y", -HEIGHTtr*0.2/2)
         .attr("fill","none")
         .attr("stroke","red")
    textGrouptr.append("text")
         .attr("x", 0)
         .attr("y", 0)
         .attr("fill","blue")
         .attr("stroke","none")
         .attr("dominant-baseline","middle")
         .attr("text-anchor","middle")
         .attr("font-size",WIDTHtr*0.1)
         .text("TOP RIGHT");


  // SCALES ----------------------------------
    let x_stocks_scale = d3.scaleTime().range([0,(WIDTHbl-MARGINbl.left-MARGINbl.right)]);
    let y_stocks_scale = d3.scaleLinear().range([(HEIGHTbr-MARGINbl.top-MARGINbl.bottom),0]);


  // AXIS ------------------------------------

    let x_stocks_axis = d3.axisBottom().scale(x_stocks_scale).tickFormat(dateFormatter);
    let y_stocks_axis = d3.axisLeft().scale(y_stocks_scale);

  // LINE Formats ----------------------------

    let line_stocks = d3.line().x(function(d){return x_stocks_scale(d.date);})
                               .y(function(d){return y_stocks_scale(d.shareValue);});
    let line_stocks_smooth = d3.line().curve(d3.curveCardinal)
                               .x(function(d){return x_stocks_scale(d.date);})
                               .y(function(d){return y_stocks_scale(d.shareValue);});
    // let areaLine_stocks = d3.area()
    //                         .x(function(d){ return x_stocks_axis(d.date); })
    //                         .y0(y_stocks_axis(0))
    //                         .y1(function(d){ return y_stocks_axis(d.shareValue); })
    //                         .curve(d3.curveCardinal);

    selectStateAndPlot("MH")
    function selectStateAndPlot(stateTag) {
        stateDataC0 = [],
        stateDataC1 = [],
        stateDataC2 = [];
        // console.log(stateTag);
        tsvData.forEach(function(d) {
          if (d.STATES === stateTag) {
            stateDataC0.push({"date":parseDate(d.month),"shareValue":+d.P1});
            stateDataC1.push({"date":parseDate(d.month),"shareValue":+d.P2});
            stateDataC2.push({"date":parseDate(d.month),"shareValue":+d.P3});
          }
        });
        plotPrices(error, stateDataC0,stateDataC1,stateDataC2);
      }

    function plotPrices(error, dataC0, dataC1, dataC2) {
      if (error) throw error;
      // console.log(chartGroupbl.selectAll(".stockHistory"));

      let stockHistory = chartGroupbl.append("g").attr("class","stockHistory");

      x_stocks_scale.domain([dataC0[0].date, dataC0[dataC0.length - 1].date]);
      y_stocks_scale.domain(d3.extent(dataC0.concat(dataC1).concat(dataC2), function(d) { return d.shareValue; }));

      let axisFontSize = (0.03*WIDTHbl)<2 ? 2 : 0.03*WIDTHbl;

      stockHistory.append("g")
          .attr("class", "axisStock")
          .attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (HEIGHTbl/2-MARGINbl.bottom) + ")")
          .call(x_stocks_axis.ticks(4))
          .attr("font-size",axisFontSize+"px")

      stockHistory.append("g").append("text")
          .attr("x", (WIDTHbl/2))
          .attr("y", (HEIGHTbl/2-MARGINbl.bottom-2))
          .style("text-anchor", "end")
          .attr("font-size",axisFontSize+"px")
          .text("Month");


      stockHistory.append("g")
          .attr("class", "axisStock")
          .attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (-HEIGHTbl/2+MARGINbl.top) + ")")
          .call(y_stocks_axis.ticks(4))
          .attr("font-size",axisFontSize+"px")

      stockHistory.append("g").append("text")
          .attr("transform","rotate(-90)")
          .attr("x", (HEIGHTbl/2-MARGINbl.top))
          .attr("y", (-WIDTHbl/2+MARGINbl.left+axisFontSize+2))
          .style("text-anchor", "end")
          .attr("font-size",axisFontSize+"px")
          .text("Price in INR");

      let linePath = stockHistory.append("g").attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (-HEIGHTbl/2+MARGINbl.top) + ")")
                                 .append("path");

      linePath.datum(dataC0).transition().duration(10)
          .attr("class", "lineC0")
          .attr("fill","none")
          .attr("stroke",'red')
          .attr("d", line_stocks_smooth);


console.log(axisFontSize);




      stockHistory.append("g").append("rect")
           .attr("width", WIDTHtr*0.2)
           .attr("height", HEIGHTtr*0.2)
           .attr("x", -WIDTHtr*0.2/2)
           .attr("y", -HEIGHTtr*0.2/2)
           .attr("fill","none")
           .attr("stroke","red")



    }//plot prices

















  }//respond
});//D3 TSV

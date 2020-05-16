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

    console.log(domWIDTH>1080);

    if (domWIDTH>1080) {
      var activeWidth = 1080;
      var WIDTHtr = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("topright")[0].offsetWidth;
      var WIDTHtl = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("topleft")[0].offsetWidth;
      var WIDTHbr = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("bottomright")[0].offsetWidth;
      var WIDTHbl = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("bottomleft")[0].offsetWidth;

      var HEIGHTtr = 0.65*WIDTHtr;
      var HEIGHTtl = 0.65*WIDTHtl;
      var HEIGHTbr = 0.65*WIDTHbr;
      var HEIGHTbl = 0.65*WIDTHbl;

    } else if (domWIDTH<=600) {
      var activeWidth = domWIDTH;
      var WIDTHtr = (activeWidth-2*domMarginLR-4*emMarginLR);//document.getElementsByClassName("topright")[0].offsetWidth;
      var WIDTHtl = (activeWidth-2*domMarginLR-4*emMarginLR);//document.getElementsByClassName("topleft")[0].offsetWidth;
      var WIDTHbr = (activeWidth-2*domMarginLR-4*emMarginLR);//document.getElementsByClassName("bottomright")[0].offsetWidth;
      var WIDTHbl = (activeWidth-2*domMarginLR-4*emMarginLR);//document.getElementsByClassName("bottomleft")[0].offsetWidth;

      var HEIGHTtr = 0.65*WIDTHtr;
      var HEIGHTtl = 0.65*WIDTHtl;
      var HEIGHTbr = 0.65*WIDTHbr;
      var HEIGHTbl = 0.65*WIDTHbl;

    } else {
      var activeWidth = domWIDTH;
      var WIDTHtr = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("topright")[0].offsetWidth;
      var WIDTHtl = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("topleft")[0].offsetWidth;
      var WIDTHbr = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("bottomright")[0].offsetWidth;
      var WIDTHbl = (activeWidth-2*domMarginLR-4*emMarginLR)/2;//document.getElementsByClassName("bottomleft")[0].offsetWidth;

      var HEIGHTtr = 0.65*WIDTHtr;
      var HEIGHTtl = 0.65*WIDTHtl;
      var HEIGHTbr = 0.65*WIDTHbr;
      var HEIGHTbl = 0.65*WIDTHbl;

    }



    console.log(activeWidth);



    // console.log(WIDTHtr);




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
    let areaLine_stocks = d3.area()
                            .x(function(d){ return x_stocks_scale(d.date); })
                            .y0(y_stocks_scale(0))
                            .y1(function(d){ return y_stocks_scale(d.shareValue); })
                            .curve(d3.curveCardinal);

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

      stockHistory.append("g")
          .attr("class", "axisStock")
          .attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (-HEIGHTbl/2+MARGINbl.top) + ")")
          .call(y_stocks_axis.ticks(4))
          .attr("font-size",axisFontSize+"px")

      let linePath = stockHistory.append("g").attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (-HEIGHTbl/2+MARGINbl.top) + ")");

      let areaOpacity = 0.55;
      let lcolor = ["#8856a7","#2ca25f","#f03b20"]
         ,acolor = ["#9ebcda","#f7fcb9","#feb24c"];
     let fusColr = ["#fde0dd","#f7fcb9","#fee8c8"];

     [dataC2,dataC1,dataC0].map((e,i) => {
       linePath.append("path").datum(e).attr("class", "areaC"+i).attr("fill",fusColr[i]).attr("opacity",areaOpacity).attr("stroke",acolor[i]).attr("d", areaLine_stocks);
     });// To Move all ahadow areas below lines

      [dataC2,dataC1,dataC0].map((e,i) => {
        linePath.append("path").datum(e).attr("class", "lineC"+i).attr("fill","none").attr("stroke",lcolor[i]).attr("stroke-width",2)
          .attr("d", line_stocks_smooth)
          .on('mouseover',mousemoveLine)
          // .on('mouseout',mouseoutLine)
          ;
      });

    let widthStocks = WIDTHbl - MARGINbl.left - MARGINbl.right,
        heightStocks = HEIGHTbl - MARGINbl.top - MARGINbl.bottom;
    let xBaxWidth = widthStocks/6;
    let yBaxWidth = heightStocks/10;
    let xGrid = stockHistory.append("g").attr("class", "Grid").style("display", "null");
    xGrid.append("rect")
        .attr("class", "xGrid")
        .attr("width", xBaxWidth*0.025)
        .attr("height", heightStocks)
        .attr("fill","#AAA")
        .attr("x", 0.0)
        .attr("y", -HEIGHTbl/2+MARGINbl.top);

    let yGrid = stockHistory.append("g").attr("class", "Grid").style("display", "null");
    yGrid.append("rect")
        .attr("class", "xGrid")
        .attr("width", widthStocks)
        .attr("height", yBaxWidth*0.025)
        .attr("fill","#AAA")
        .attr("x", -WIDTHbl/2+MARGINbl.left)
        .attr("y", 0.0);

      let focus = stockHistory.append("g")
          .attr("fill","#EEE")
          .style("display", "null");

      focus.append("circle")
          .attr("class","tootip")
          .attr("stroke-width",2)
          .attr("r", 5);




      let tooltipBox = stockHistory.append("g").attr("class","tooltipBox");


      let tootipW = WIDTHbl*0.15;
      let tootipH = HEIGHTbl*0.12;
      tooltipBox.append("rect").attr("class","toorect")
                              .attr("rx",5)
                              .attr("ry",5).attr("stroke-width",2)
                              .attr("fill","#EEE")
                              .attr("stroke","#AAA")
                              .attr("width", tootipW)
                              .attr("height", tootipH);


      tooltipBox.append("text").attr("class","tooltextX")
      .attr("font-size",axisFontSize+"px")
      .attr("dominant-baseline","middle")
      .style("text-anchor", "middle")
      .attr("x",tootipW/2)
      .attr("y",tootipH/3)
      .text("-");

      tooltipBox.append("text").attr("class","tooltextY")
      .attr("font-size",axisFontSize+"px")
      .attr("dominant-baseline","middle")
      .style("text-anchor", "middle")
      .attr("x",tootipW/2)
      .attr("y",tootipH/1.25)
      .text("-");
          // .append("rect");


      tooltipBox.attr("transform","translate("+(WIDTHbl/4)+","+(-HEIGHTbl/2+MARGINbl.top)+")")
      // let tooltext = stockHistory.append("g").attr("class", "baxText").append("text")
      //           .attr("x", (WIDTHtr/2-MARGINbl.left+5-WIDTHtr*0.2))
      //           .attr("y", -HEIGHTtr/2+MARGINbl.top).text("swapnil");
      //
      // console.log(tooltext);


      var xBox = stockHistory.append("g").attr("class", "xBox").style("display", "null");
      var yBox = stockHistory.append("g").attr("class", "yBox").style("display", "null");


      xBox.append("rect")
          .attr("class", "bax")
          .attr("width", xBaxWidth)
          .attr("height", yBaxWidth)
          .attr("x", (-xBaxWidth/2))
          .attr("y", (HEIGHTbl/2-MARGINbl.bottom+3))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill","#EEE")
          .attr("stroke","#AAA");

      yBox.append("rect")
          .attr("class", "bax")
          .attr("width", yBaxWidth*1.8)
          .attr("height", xBaxWidth/2.85)
          .attr("x", (-WIDTHbl/2+MARGINbl.left-yBaxWidth*1.8-2))
          .attr("y", (-xBaxWidth/2/2.85))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill","#EEE")
          .attr("stroke","#AAA");

      yBox.append("text")
          .attr("font-size",axisFontSize+"px")
          .attr("dominant-baseline","middle")
          .attr("class", "baxText")
          .attr("x", (-WIDTHbl/2+MARGINbl.left-yBaxWidth*1.5))
          .attr("y", (-xBaxWidth/50/2.85));

      xBox.append("text")
          .attr("font-size",axisFontSize+"px")
          .attr("dominant-baseline","middle")
          .attr("class", "baxText")
          .attr("x", -0.30*xBaxWidth)
          .attr("y", (HEIGHTbl/2-MARGINbl.bottom+yBaxWidth/1.5));

      xBox.attr("transform", "translate(" + 0 + "," + 0 + ")");
      yBox.attr("transform", "translate(" + 0 + "," + 0 + ")");



      function mousemoveLine() {
        // console.log(dateFormatter(x_stocks_scale.invert(d3.mouse(this)[0])));
        let cindex = +this.attributes.class.nodeValue.split("C")[1];
        // console.log(this.attributes["stroke-width"].nodeValue);
        xCord = d3.mouse(this)[0];
        yCord = d3.mouse(this)[1];
        this.attributes["stroke-width"].nodeValue = axisFontSize/5;

        [0,1,2].map((e,i) => {
          if (i !== cindex) {
              // console.log(e);
              // console.log(linePath.select("path.lineC"+e)._groups[0][0]);
              linePath.select("path.lineC"+e)._groups[0][0].attributes["stroke-width"].nodeValue= axisFontSize/7;
          }
        })

        let data = [dataC2,dataC1,dataC0][cindex];
        let x0 = x_stocks_scale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i - 1],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0,
            dt = (d.date),
            sv = (d.shareValue);


        tooltipBox.select(".tooltextX")
                  .attr("fill",lcolor[cindex])
                  .text(dateFormatter(dt));

        tooltipBox.select(".tooltextY")
                  .attr("fill",lcolor[cindex])
                  .text(sv);
        focus.transition().duration(250).attr("transform", "translate(" + (xCord-WIDTHbl/2+MARGINbl.left) + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");
        focus.attr("stroke",lcolor[cindex]).attr("fill",acolor[cindex]);
        tooltipBox.select(".toorect").attr("stroke",lcolor[cindex]).attr("fill",fusColr[cindex]);

        xGrid.transition().duration(250).select(".xGrid")
              .attr("height", heightStocks-yCord)
              .attr("transform","translate(" + (xCord-WIDTHbl/2+MARGINbl.left) + "," + yCord + ")");
        yGrid.transition().duration(250).select(".xGrid")
              .attr("transform","translate(" + 0 + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");


        xBoxPos = (xCord>WIDTHbl-1.25*xBaxWidth)?(WIDTHbl/2-0.5*xBaxWidth):(xCord-WIDTHbl/2+MARGINbl.left);
        console.log(xCord,WIDTHbl-1.25*xBaxWidth);

        xBox.transition().duration(250).attr("transform", "translate(" + (xBoxPos) + "," + 0 + ")");
        yBox.transition().duration(250).attr("transform", "translate(" + 0 + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");

        xBox.select(".baxText").attr("stroke",lcolor[cindex]).attr("fill",lcolor[cindex]).text(dateFormatter(dt));
        yBox.select(".baxText").attr("stroke",lcolor[cindex]).attr("fill",lcolor[cindex]).text(sv);

        xBox.select(".bax").attr("stroke",lcolor[cindex]).attr("fill",fusColr[cindex]);
        yBox.select(".bax").attr("stroke",lcolor[cindex]).attr("fill",fusColr[cindex]);

      }

      // function mouseoutLine() {
      //   // this.attributes["stroke-width"].nodeValue = 2;
      //   console.log(this.attributes.stroke.nodeValue===focus._groups[0][0].attributes.stroke.nodeValue);
      //   this.attributes["stroke-width"].nodeValue = (this.attributes.stroke.nodeValue===focus._groups[0][0].attributes.stroke.nodeValue) ? 3:1;
      //
      // }





      stockHistory.append("g").append("text")
          .attr("x", (axisFontSize*1.5))
          .attr("y", (-HEIGHTbl/2+MARGINbl.top))
          .attr("dominant-baseline","middle")
          .style("text-anchor", "middle")
          .attr("font-size",(axisFontSize*1.5)+"px")
          .text("Historic Data");

      stockHistory.append("g").append("text")
          .attr("x", (WIDTHbl/2-MARGINbl.right))
          .attr("y", (HEIGHTbl/2-MARGINbl.bottom-2))
          .style("text-anchor", "end")
          .attr("font-size",axisFontSize+"px")
          .text("Month");

      stockHistory.append("g").append("text")
          .attr("transform","rotate(-90)")
          .attr("x", (HEIGHTbl/2-MARGINbl.top))
          .attr("y", (-WIDTHbl/2+MARGINbl.left+axisFontSize+2))
          .style("text-anchor", "end")
          .attr("font-size",axisFontSize+"px")
          .text("Price in INR");




    }//plot prices

















  }//respond
});//D3 TSV

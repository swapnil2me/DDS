d3.tsv("swap.tsv", function (error,tsvData) {

  if (error) {
    console.log(error);
  }

  var stateDataC0 = [],
      stateDataC1 = [],
      stateDataC2 = [];

  var statesData=[{'State': 'MH', 'share': {'P0': 6691, 'P1': 12508, 'P2': 12538}},
                {'State': 'GJ', 'share': {'P0': 5765, 'P1': 10412, 'P2': 10856}},
                {'State': 'KA', 'share': {'P0': 4750, 'P1': 8751, 'P2': 8352}},
                {'State': 'TN', 'share': {'P0': 5260, 'P1': 9125, 'P2': 9326}},
                {'State': 'UP', 'share': {'P0': 7071, 'P1': 11742, 'P2': 12404}},
                {'State': 'DL', 'share': {'P0': 4076, 'P1': 7056, 'P2': 6497}},
                {'State': 'RJ', 'share': {'P0': 3997, 'P1': 5874, 'P2': 5560}},
                {'State': 'MP', 'share': {'P0': 4900, 'P1': 8599, 'P2': 8529}},
                {'State': 'WB', 'share': {'P0': 4206, 'P1': 7992, 'P2': 7827}},
                {'State': 'GOA', 'share': {'P0': 3782, 'P1': 5243, 'P2': 4731}}];
  var parseDate = d3.timeParse("%x"),
      bisectDate = d3.bisector(function(d) { return d.date; }).left,
      formatValue = d3.format(","),
      dateFormatter = d3.timeFormat("%m/%y");

  d3.select(window).on("resize",respond);
  respond()

  function respond() {

    let domWIDTH = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    let domMarginLR = 10;
    let emMarginLR = 5;

    // console.log(domWIDTH>1080);

    if (domWIDTH>1080) {
      var activeWidth = 1080;
      var WIDTHtr = (activeWidth)/2;//document.getElementsByClassName("topright")[0].offsetWidth;
      var WIDTHtl = (activeWidth)/2;//document.getElementsByClassName("topleft")[0].offsetWidth;
      var WIDTHbr = (activeWidth)/2;//document.getElementsByClassName("bottomright")[0].offsetWidth;
      var WIDTHbl = (activeWidth)/2;//document.getElementsByClassName("bottomleft")[0].offsetWidth;

      var HEIGHTtr = 0.55*WIDTHtr;
      var HEIGHTtl = 0.55*WIDTHtl;
      var HEIGHTbr = 0.55*WIDTHbr;
      var HEIGHTbl = 0.55*WIDTHbl;

      var axisFontSize = (0.035*WIDTHtl)<2 ? 1 : 0.025*WIDTHtl;


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

      var axisFontSize = (0.035*WIDTHtl)<2 ? 1 : 0.025*WIDTHtl;


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

      var axisFontSize = (0.035*WIDTHtl)<2 ? 1 : 0.025*WIDTHtl;

    }


    MARGINtr = {left:0.12*WIDTHtr,
                right:0.00*WIDTHtr,
                bottom:0.01*WIDTHtr,
                top:0.08*WIDTHtr
              };

    MARGINbr = {left:0.05*WIDTHbr,
                right:0.01*WIDTHbr,
                bottom:0.05*WIDTHbr,
                top:0.01*WIDTHbr
              };
    MARGINbl = {left:0.12*WIDTHbl,
                right:0.01*WIDTHbl,
                bottom:0.08*WIDTHbl,
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
    let svgbr = d3.select(".bottomright").append("svg").attr("height",HEIGHTbr+"px").attr("width",1*WIDTHbr/2+"px");
    let svgbl = d3.select(".bottomleft").append("svg").attr("height",HEIGHTbl+"px").attr("width",WIDTHbl+"px");

    // let chartGroupbr = svgbr.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHbr/2+","+ HEIGHTbr/2+")");
    let chartGroupbl = svgbl.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHbl/2+","+ HEIGHTbl/2+")");

  // SCALES ----------------------------------
    let x_stocks_scale = d3.scaleTime().range([0,(WIDTHbl-MARGINbl.left-MARGINbl.right)]);
    let y_stocks_scale = d3.scaleLinear().range([(HEIGHTbl-MARGINbl.top-MARGINbl.bottom),0]);


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

    let lineWidth = 0.002*WIDTHbl;
    selectStateAndPlot("MH");
    barPieChart(statesData);
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
        plotPrices(error, stateDataC0,stateDataC1,stateDataC2,stateTag);
    }//selectStateAndPlot


    function changeProductLine(pid) {

      let pids = [0,1,2];
      pids.map(function (id) {
        if (id === pid) {
          let swap = document.getElementsByClassName("lineC"+id+"")[0];
          swap.style["stroke-width"]=lineWidth*1.5;
        }else {
          let swap = document.getElementsByClassName("lineC"+id+"")[0];
          swap.style["stroke-width"]=lineWidth/3;
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
    }//changeProductLine

    function plotPrices(error, dataC0, dataC1, dataC2,stateTag) {
      // console.log(stateTag);
      if (error) throw error;
      // console.log(chartGroupbl.selectAll(".stockHistory"));
      // console.log(chartGroupbl.selectAll(".stockHistory")._groups[0]);
      // console.log(chartGroupbl.selectAll(".stockHistory")._groups[0][0]);
      let gswap = chartGroupbl.selectAll(".stockHistory")._groups[0][0];
      if (gswap) {
          gswap.remove();
      }

      let stockHistory = chartGroupbl.append("g").attr("class","stockHistory");

      x_stocks_scale.domain([dataC0[0].date, dataC0[dataC0.length - 1].date]);
      y_stocks_scale.domain(d3.extent(dataC0.concat(dataC1).concat(dataC2), function(d) { return d.shareValue; }));

      // y_stocks_scale.domain([y_stocks_scale.domain()[0], y_stocks_scale.domain()[1]+125])
      // console.log(y_stocks_scale.domain()[1]);

      stockHistory.append("g")
          .attr("class", "axisStock")
          .attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (HEIGHTbl/2-MARGINbl.bottom) + ")")
          .call(x_stocks_axis.ticks(4))
          .attr("font-size",axisFontSize+"px")

      stockHistory.append("g")
          .attr("class", "axisStock")
          .attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (-HEIGHTbl/2+MARGINbl.top) + ")")
          .call(y_stocks_axis.ticks(4))
          .attr("font-size",axisFontSize+"px");

      let linePath = stockHistory.append("g").attr("transform", "translate("+(-WIDTHbl/2+MARGINbl.left)+"," + (-HEIGHTbl/2+MARGINbl.top) + ")");

      let areaOpacity = 0.55;
      let lcolor = ["#8856a7","#2ca25f","#f03b20"]
         ,acolor = ["#9ebcda","#f7fcb9","#feb24c"],
         fusColr = ["#fde0dd","#f7fcb9","#fee8c8"];

     [dataC2,dataC1,dataC0].map((e,i) => {
       linePath.append("path").datum(e).attr("class", "areaC"+i).attr("fill",fusColr[i]).attr("opacity",areaOpacity).attr("stroke",acolor[i]).attr("d", areaLine_stocks);
     });// To Move all ahadow areas below lines

      [dataC2,dataC1,dataC0].map((e,i) => {
        linePath.append("path").datum(e).attr("class", "lineC"+i).attr("fill","none").attr("stroke",lcolor[i]).attr("stroke-width",lineWidth)
          .attr("d", line_stocks_smooth)
          .on('mouseover',mousemoveLine)
          .on("touchstart", touchLine)
          .on("touchmove", touchLine)
          // .on('mouseout',mouseoutLine)
          ;
      });

    let widthStocks = WIDTHbl - MARGINbl.left - MARGINbl.right,
        heightStocks = HEIGHTbl - MARGINbl.top - MARGINbl.bottom;
    let xBaxWidth = widthStocks/8;
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


      var xBox = stockHistory.append("g").attr("class", "xBox").style("display", "null");
      var yBox = stockHistory.append("g").attr("class", "yBox").style("display", "null");

      xBox.append("rect")
          .attr("class", "bax")
          .attr("width", xBaxWidth)
          .attr("height", yBaxWidth)
          .attr("x", (-xBaxWidth/2))
          .attr("y", (HEIGHTbl/2-MARGINbl.bottom+5))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill","#EEE")
          .attr("stroke","#AAA");

      yBox.append("rect")
          .attr("class", "bax")
          .attr("width", yBaxWidth*1.8)
          .attr("height", yBaxWidth)
          .attr("x", (-WIDTHbl/2+MARGINbl.left-yBaxWidth*1.8-5))
          .attr("y", (-yBaxWidth/2))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill","#EEE")
          .attr("stroke","#AAA");

      yBox.append("text")
          .attr("font-size",axisFontSize+"px")
          .attr("dominant-baseline","middle")
          .style("text-anchor", "middle")
          .attr("class", "baxText")
          .attr("x", (-WIDTHbl/2+MARGINbl.left-yBaxWidth*1))
          .attr("y", 0);

      xBox.append("text")
          .attr("font-size",axisFontSize+"px")
          .attr("dominant-baseline","middle")
          .style("text-anchor", "middle")
          .attr("class", "baxText")
          .attr("x", 0)
          .attr("y", (HEIGHTbl/2-MARGINbl.bottom+yBaxWidth/1.5+3));

      xBox.attr("transform", "translate(" + 0 + "," + 0 + ")");
      yBox.attr("transform", "translate(" + 0 + "," + 0 + ")");

      function touchLine() {

        let cindex = +this.attributes.class.nodeValue.split("C")[1];
        // console.log(this.attributes["stroke-width"].nodeValue);
        xCord = d3.touches(this)[0][0];
        yCord = d3.touches(this)[0][1];
        this.attributes["stroke-width"].nodeValue = axisFontSize/5;
        // console.log(d3.touches(this),xCord,yCord);
        changeProductLine(cindex);

        let data = [dataC2,dataC1,dataC0][cindex];
        let x0 = x_stocks_scale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i - 1],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0,
            dt = (d.date),
            sv = (d.shareValue);
        focus.transition().duration(250).attr("transform", "translate(" + (xCord-WIDTHbl/2+MARGINbl.left) + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");
        focus.attr("stroke",lcolor[cindex]).attr("fill",acolor[cindex]);

        xGrid.transition().duration(250).select(".xGrid")
              .attr("height", heightStocks-yCord)
              .attr("transform","translate(" + (xCord-WIDTHbl/2+MARGINbl.left) + "," + yCord + ")");
        yGrid.transition().duration(250).select(".xGrid")
              .attr("transform","translate(" + 0 + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");


        xBoxPos = (xCord>WIDTHbl-1.25*xBaxWidth)?(WIDTHbl/2-0.5*xBaxWidth):(xCord-WIDTHbl/2+MARGINbl.left);

        xBox.transition().duration(250).attr("transform", "translate(" + (xBoxPos) + "," + 0 + ")");
        yBox.transition().duration(250).attr("transform", "translate(" + 0 + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");

        xBox.select(".baxText").attr("stroke",lcolor[cindex]).attr("fill",lcolor[cindex]).text(dateFormatter(dt));
        yBox.select(".baxText").attr("stroke",lcolor[cindex]).attr("fill",lcolor[cindex]).text(sv);

        xBox.select(".bax").attr("stroke",lcolor[cindex]).attr("fill",fusColr[cindex]);
        yBox.select(".bax").attr("stroke",lcolor[cindex]).attr("fill",fusColr[cindex]);
      }

      function mousemoveLine() {
        // console.log(dateFormatter(x_stocks_scale.invert(d3.mouse(this)[0])));
        let cindex = +this.attributes.class.nodeValue.split("C")[1];
        // console.log(this.attributes["stroke-width"].nodeValue);
        xCord = d3.mouse(this)[0];
        yCord = d3.mouse(this)[1];
        this.attributes["stroke-width"].nodeValue = axisFontSize/5;
        // console.log(xCord,yCord);
        changeProductLine(cindex);

        let data = [dataC2,dataC1,dataC0][cindex];
        let x0 = x_stocks_scale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i - 1],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0,
            dt = (d.date),
            sv = (d.shareValue);


        focus.transition().duration(250).attr("transform", "translate(" + (xCord-WIDTHbl/2+MARGINbl.left) + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");
        focus.attr("stroke",lcolor[cindex]).attr("fill",acolor[cindex]);

        xGrid.transition().duration(250).select(".xGrid")
              .attr("height", heightStocks-yCord)
              .attr("transform","translate(" + (xCord-WIDTHbl/2+MARGINbl.left) + "," + yCord + ")");
        yGrid.transition().duration(250).select(".xGrid")
              .attr("transform","translate(" + 0 + "," + (yCord-HEIGHTbl/2+MARGINbl.top) + ")");


        xBoxPos = (xCord>WIDTHbl-1.25*xBaxWidth)?(WIDTHbl/2-0.5*xBaxWidth):(xCord-WIDTHbl/2+MARGINbl.left);

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
          .attr("font-size",(axisFontSize*1.25)+"px")
          .attr("stroke","black")
          .attr("stroke-width",0.5)
          .text("Historic Data:"+stateTag);

      stockHistory.append("g").attr("class","axlabel").append("text")
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

    function barPieChart(stDt) {
      // let chartGrouptl = svgtl.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHtl/2+","+ HEIGHTtl/2+")");
      // console.log(svgtl);

      // let chartGrouptr = svgtr.append("g").attr("class","rectGroup").attr("transform","translate("+WIDTHtr/2+","+ HEIGHTtr/2+")");
      let rectGroupbr = svgbr.append("g").attr("class","rectGroup")
                           .attr("transform","translate("+1*WIDTHbl/4+","+1*HEIGHTbl/2+")");

      // let textGroupbr = svgbr.append("g").attr("class","textGroup")
      //                      .attr("transform","translate("+WIDTHtr/2+","+ HEIGHTtr/2+")");

      // rectGrouptr.append("rect")
      //      .attr("width", WIDTHtr*0.2)
      //      .attr("height", HEIGHTtr*0.2)
      //      .attr("x", -WIDTHtr*0.2/2)
      //      .attr("y", -HEIGHTtr*0.2/2)
      //      .attr("fill","none")
      //      .attr("stroke","red")
      // textGrouptr.append("text")
      //      .attr("x", 0)
           // .attr("y", 0)
           // .attr("fill","blue")
           // .attr("stroke","none")
           // .attr("dominant-baseline","middle")
           // .attr("text-anchor","middle")
           // .attr("font-size",WIDTHtr*0.1)
      //      .text("TOP RIGHT");


      var barColor = '#96ae8d';
      // ["#8856a7","#2ca25f","#f03b20"]
      function segColor(c){ return {P0:"#f03b20", P1:"#8856a7",P2:"#2ca25f"}[c]; }

      // compute total for each state.
      stDt.forEach(function(d){d.total=d.share.P0+d.share.P1+d.share.P2;});

      // function to handle histogram.
      function histoGram(fD){
          var hG={},    hGDim = {};
          hGDim.w = WIDTHtr - MARGINtr.left - MARGINtr.right,
          hGDim.h = HEIGHTtr - MARGINtr.top - MARGINtr.bottom;

          //create svg for histogram.
          var hGsvg = svgtr;

          // create function for x-axis mapping.
          var xScaleHist = d3.scaleBand().range([MARGINtr.left, WIDTHtr-MARGINtr.right]).paddingInner(0.15)
                  .domain(fD.map(function(d) { return d[0]; }));


          // Add x-axis to the histogram svg.
          hGsvg.append("g").attr("class","hg-title").append("text").text("Key Markets")
                                                                  .attr("x",hGDim.w/2)
                                                                  .attr("y",-50)
                                                                  .attr("text-anchor", "middle");
          hGsvg.append("g").attr("class", "x dashAxis")
              .attr("transform", "translate(0," + hGDim.h + ")")
              .call(d3.axisBottom().scale(xScaleHist)).attr("font-size",axisFontSize+"px");

          // Create function for y-axis map.
          var yScaleHist = d3.scaleLinear().range([HEIGHTtr-MARGINtr.bottom, MARGINtr.top])
                  .domain([0, d3.max(fD, function(d) { return d[1]; })]);

          // Create bars for histogram to contain rectangles and share labels.
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
            .attr("fill","#05696b")
            .attr("stroke","#05696b")
            .attr("dominant-baseline","middle")
            .attr("text-anchor","middle")
            .attr("font-size",axisFontSize*0.95);

          var barBox = hGsvg.append("g").attr("class", "dashBarBox").style("display", "null");

          barBox.append("rect")
              .attr("class", "dashBarBox")
              .attr("width", xScaleHist.bandwidth())
              .attr("height", axisFontSize*2)
              .attr("fill","none")
              .attr("stroke","red")
              .attr("stroke-width",3)
              .attr("x", 0)
              .attr("y", (hGDim.h+2))
              .attr("rx", 4)
              .attr("ry", 4);

          // console.log();
          // barBox.attr("transform", "translate(" + xScaleHist(fD[0][0]) + "," + (hGDim.h+2) + ")");
          barBox.select(".dashBarBox").attr("transform", "translate(" + (xScaleHist("MH")) + "," + 0 + ")")

          function mouseover(d){  // utility function to be called on mouseover.
              // filter for selected state.
              var st = stDt.filter(function(s){ return s.State == d[0];})[0],
                  nD = d3.keys(st.share).map(function(s){ return {type:s, share:st.share[s]};});
              barBox.select(".dashBarBox").transition().duration(200)
                .attr("transform", "translate(" + (xScaleHist(d[0])) + "," + 0 + ")")
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
          piePadding = {t: 0, r: 0, b: 0, l: 0};
          var pC ={},    pieDim ={w: 2*WIDTHbr/3, h: HEIGHTbr};
          pieDim.r = Math.min(pieDim.w, pieDim.h) / 2.65 ;

          let piID = "#pieChart";
          // create svg for pie chart.
          let piesvg = rectGroupbr;

          piesvg.append("text").attr("class","pi-title").text("Market Share")
                                                                  .attr("x",0)
                                                                  .attr("y",-1*HEIGHTbr/2.55)
                                                                  .attr("fill","black")
                                                                  .attr("stroke","black")
                                                                  .attr("stroke-width",0.5)
                                                                  .attr("dominant-baseline","middle")
                                                                  .attr("text-anchor","middle")
                                                                  .attr("font-size",axisFontSize*1.5);

          // create function to draw the arcs of the pie slices.
          var arc = d3.arc().outerRadius(pieDim.r - 10).innerRadius(0);

          // create a function to compute the pie slice angles.
          var pie = d3.pie().sort(null).value(function(d) { return d.share; });

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
              hG.update(stDt.map(function(v){
                  return [v.State,v.share[d.data.type]];}),segColor(d.data.type));

              pid = plist.findIndex((i)=>i===d.data.type);
              changeProductLine(pid);
          }
          //Utility function to be called on mouseout a pie slice.
          function mouseout(d){
              // call the update function of histogram with all data.
              hG.update(stDt.map(function(v){
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
          let legID = "#pieChart";
          let gswap = d3.select(".bottomright")._groups[0][0].childNodes;
          gswap.forEach((item, i) => {
            item.remove();
          });

          let legend = d3.select(".bottomright").append("table").attr('class','legend');
          // create one row per segment.
          let tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

          // create the first column for each segment.
          tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
              .attr("width", '16').attr("height", '16')
              .attr("fill",function(d){ return segColor(d.type); });

          // create the second column for each segment.
          tr.append("td").attr("class",'legendRec').text(function(d){ return d.type;}).style("font-size",(axisFontSize)+"px");

          // create the third column for each segment.
          tr.append("td").attr("class",'legendFreq')
              .text(function(d){ return d3.format(",")(d.share);}).style("font-size",(axisFontSize)+"px");

          // create the fourth column for each segment.
          tr.append("td").attr("class",'legendPerc')
              .text(function(d){ return getLegend(d,lD);}).style("font-size",(axisFontSize)+"px");

          // Utility function to be used to update the legend.
          leg.update = function(nD){
              // update the data attached to the row elements.
              var l = legend.select("tbody").selectAll("tr").data(nD);

              // update the frequencies.
              l.select(".legendFreq").text(function(d){ return d3.format(",")(d.share);});

              // update the percentage column.
              l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});
          };


          function getLegend(d,aD){ // Utility function to compute percentage.
              let p = Math.max(0, d3.precisionFixed(0.05) - 2),
              f = d3.format("." + p + "%");
              return f(d.share/d3.sum(aD.map(function(v){ return v.share; })));
          }

          return leg;
      }

      // calculate total frequency by segment for all state.
      var tF = ['P0','P1','P2'].map(function(d){
          return {type:d,
                  share: d3.sum(stDt.map(function(t){
                                            return t.share[d];
                                            }
                                        )
                              )
                };
          });

      // calculate total frequency by state for all segment.
      var sF = stDt.map(function(d){return [d.State,d.total];});

      var hG = histoGram(sF), // create the histogram.
          pC = pieChart(tF), // create the pie-chart.
          leg= legend(tF);  // create the legend.

    };//barPieChart


// --------------------------------------------------------------
    MARGINtl = {left:0.12*WIDTHtl,
                right:0.01*WIDTHtl,
                bottom:0.06*WIDTHtl,
                top:0.045*WIDTHtl
              };

    let svgtl = d3.select(".topleft").append("svg").attr("height",HEIGHTtl+"px").attr("width",WIDTHtl+"px");

    let liveDateFormatter = d3.timeFormat("%H:%M:%S");
    let tnow = new Date();
    let tm5 = new Date();

    tm5.setMinutes(tnow.getMinutes()-1);

    let x_live_scale = d3.scaleTime().domain([tm5,tnow]).range([0,(WIDTHtl-MARGINtl.left-MARGINtl.right)]);
    let y_live_scale = d3.scaleLinear().domain([60,310]).range([(HEIGHTtl-MARGINtl.top-MARGINtl.bottom),0]);

   // AXIS ------------------------------------

     let x_live_axis = d3.axisBottom().scale(x_live_scale).tickFormat(liveDateFormatter);
     let y_live_axis = d3.axisLeft().scale(y_live_scale);

   // LINE Formats ----------------------------

     let line_live = d3.line().x(function(d){return x_live_scale(d.x);})
                                .y(function(d){return y_live_scale(d.y);});
     let line_live_smooth = d3.line().curve(d3.curveCardinal)
                                .x(function(d){return x_live_scale(d.x);})
                                .y(function(d){return y_live_scale(d.y);});
     let areaLine_live = d3.area()
                             .x(function(d){ return x_live_scale(d.x); })
                             .y0(0+HEIGHTtl-MARGINtl.bottom)
                             .y1(function(d){ return y_live_scale(d.y); });


    let xax = svgtl.append('g').attr("class",'liveAxisX')
          .attr("transform","translate("+(MARGINtl.left)+","+(HEIGHTtl-MARGINtl.bottom)+")")
          .call(x_live_axis.ticks(4)).attr("font-size",axisFontSize+"px");

    let yax = svgtl.append('g').attr("class",'liveAxisY')
          .attr("transform","translate("+(MARGINtl.left)+","+(MARGINtl.top)+")")
          .call(y_live_axis.ticks(4)).attr("font-size",axisFontSize+"px");


    svgtl.append("g").append("text")
        .attr("x", (WIDTHtl/2))
        .attr("y", (MARGINtl.top))
        .attr("dominant-baseline","middle")
        .style("text-anchor", "middle")
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .attr("font-size",(axisFontSize*1.25)+"px")
        .text("Live Updates");


    let pastData1=[],pastData2=[],pastData3=[];

    // Date(year, month, day, hours, minutes, seconds, milliseconds)

    for (let i = 0; i < 50; i++) {
      pastData1.push({x:new Date(tm5.valueOf() + i*(tnow-tm5)/50),y:((Math.random() * 10 + 100) >> 0)});
      pastData2.push({x:new Date(tm5.valueOf() + i*(tnow-tm5)/50),y:((Math.random() * 30 + 120) >> 0)});
      pastData3.push({x:new Date(tm5.valueOf() + i*(tnow-tm5)/50),y:((Math.random() * 5 + 170) >> 0)});
    };

    let liveLineGroup = svgtl.append("g").attr("transform","translate("+(MARGINtl.left)+",0)");
    let liveAreaGroup = svgtl.append("g").attr("transform","translate("+(MARGINtl.left)+","+(0)+")");
    let lcolor = ["#8856a7","#2ca25f","#f03b20"],
        acolor = ["#9ebcda","#f7fcb9","#feb24c"],
        fusColr = ["#fde0dd","#f7fcb9","#fee8c8"];



    let areaL1 = liveAreaGroup.append("path"),areaL2 = liveAreaGroup.append("path"),areaL3 = liveAreaGroup.append("path");
    let live1 = liveLineGroup.append("path"),live2 = liveLineGroup.append("path"),live3 = liveLineGroup.append("path");

    areaL1.datum(pastData1).attr("class","timeLine1").attr("d",areaLine_live).attr("fill",lcolor[0]).attr("opacity",0.05);
    areaL2.datum(pastData2).attr("class","timeLine2").attr("d",areaLine_live).attr("fill",lcolor[1]).attr("opacity",0.05);
    areaL3.datum(pastData3).attr("class","timeLine3").attr("d",areaLine_live).attr("fill",lcolor[2]).attr("opacity",0.05);

    live1.datum(pastData1).attr("class","timeLine1").attr("d",line_live).attr("fill","none").attr("stroke",lcolor[0]).attr("stroke-width",lineWidth);
    live2.datum(pastData2).attr("class","timeLine2").attr("d",line_live).attr("fill","none").attr("stroke",lcolor[1]).attr("stroke-width",lineWidth);
    live3.datum(pastData3).attr("class","timeLine3").attr("d",line_live).attr("fill","none").attr("stroke",lcolor[2]).attr("stroke-width",lineWidth);

    function tick(){
      tnow = new Date();
      let point1 = {x: tnow,y: ((Math.random() * 10 + 100) >> 0)},
          point2 = {x: tnow,y: ((Math.random() * 30 + 120) >> 0)},
            point3 = {x: tnow,y: ((Math.random() * 5 + 170) >> 0)};
      pastData1.push(point1);pastData2.push(point2);pastData3.push(point3);
      x_live_scale.domain([pastData1[0].x,pastData1[pastData1.length-1].x]);
      xax.transition().duration(2000).ease(d3.easeLinear,3).call(x_live_axis);

      live1.datum(pastData1).attr("d",line_live);
      live2.datum(pastData2).attr("d",line_live);
      live3.datum(pastData3).attr("d",line_live);

      areaL1.datum(pastData1).attr("d",areaLine_live);
      areaL2.datum(pastData2).attr("d",areaLine_live);
      areaL3.datum(pastData3).attr("d",areaLine_live);

      areaL1.attr('transform', null).transition().duration(2000).ease(d3.easeLinear,3).attr('transform', 'translate(' + x_live_scale(pastData1[0].x) + ')');
      areaL2.attr('transform', null).transition().duration(2000).ease(d3.easeLinear,3).attr('transform', 'translate(' + x_live_scale(pastData2[0].x) + ')');
      areaL3.attr('transform', null).transition().duration(2000).ease(d3.easeLinear,3).attr('transform', 'translate(' + x_live_scale(pastData3[0].x) + ')');

      live1.attr('transform', null).transition().duration(2000).ease(d3.easeLinear,3).attr('transform', 'translate(' + x_live_scale(pastData1[0].x) + ')');
      live2.attr('transform', null).transition().duration(2000).ease(d3.easeLinear,3).attr('transform', 'translate(' + x_live_scale(pastData2[0].x) + ')');
      live3.attr('transform', null).transition().duration(2000).ease(d3.easeLinear,3).attr('transform', 'translate(' + x_live_scale(pastData3[0].x) + ')').on('end', tick);

      if (pastData1.length > 50) {pastData1.shift(),pastData2.shift(),pastData3.shift()};

    }

    tick();
    respondListen();
  }//respond
});//D3 TSV

function respondListen() {
  let clear = document.querySelector("#clear");


  let domWIDTH = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
  let domMarginLR = 10;
  let emMarginLR = 5;

  // console.log(domWIDTH>1080);

  if (domWIDTH>1080) {
    var activeWidth = 500;

  } else if (domWIDTH<=600 & domWIDTH>400) {
    var activeWidth = domWIDTH/1.75;
    // console.log(activeWidth);
  } else if (domWIDTH<=400) {
    var activeWidth = domWIDTH/1.25;
    // console.log(activeWidth,"400");
  } else {
    var activeWidth = domWIDTH/1.75;
    // console.log(activeWidth);
  }


  let marginListen = {left:activeWidth*0.15, right:activeWidth*0.05, top:activeWidth*0.05, bottom:activeWidth*0.08};

  let imageWidth = activeWidth;
  let imageHeight = imageWidth*301.0/201.0;


  // ##############################################
  let widthListen = (imageWidth+marginListen.left+marginListen.right),
      heightListen = (imageHeight+marginListen.top+marginListen.bottom);
  let yScaleGip = d3.scaleLinear().domain([0,300]).range([imageHeight,0]);
  let xScaleGip = d3.scaleLinear().domain([0,200]).range([0,imageWidth]);

  let yAxisGip = d3.axisLeft().scale(yScaleGip);
  let xAxisGip = d3.axisBottom().scale(xScaleGip);

  let smoothLineGridData = d3.line()
                .x(function(d){ return (d.x); })
                .y(function(d){ return (d.y); });

  let svgtest = d3.select(".subtracted").select("svg");
  if (!svgtest.empty()) {
    svgtest.remove();
  }

  let gipSVG = d3.select(".subtracted").append("svg").attr("height",heightListen).attr("width",widthListen);

  let gipContainer = gipSVG.append("g")
                          .attr("class","gipContainer")
                          .attr("transform","translate("+marginListen.left+","+marginListen.top+")");

  gipContainer.append("image")
              .attr("xlink:href", "amp.png")
              .attr('height', imageHeight)
              .on("click", onImageClick)
              .on("mousemove", onImageMove);

  gipSVG.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+marginListen.left+","+(heightListen-marginListen.bottom)+")")
                            // .attr("stroke","black")
                            .call(xAxisGip.ticks(5));
  gipSVG.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+marginListen.left+","+(marginListen.top)+")")
                            // .attr("stroke","black")
                            .call(yAxisGip.ticks(5));

  let ximgGrid = gipContainer.append("g").attr("class", "imgGrid").style("display", "null");
  ximgGrid.append("rect")
      .attr("class", "xGridListen")
      .attr("width", 0.5)
      .attr("height", imageHeight)
      .attr("x", 0.0)
      .attr("y", 0);

  let yimgGrid = gipContainer.append("g").attr("class", "Grid").style("display", "null");
  yimgGrid.append("rect")
      .attr("class", "xGridListen")
      .attr("width", imageWidth)
      .attr("height", 0.5)
      .attr("x", 0.0)
      .attr("y", 0);

  let imgfocus = gipContainer.append("g")
      .style("display", "null");
  //

  function onImageMove() {
    // console.log(d3.mouse(this));
    // .transition().duration(100).select(".gridO")
    // imgfocus.select(".gridO")
    //         .attr("transform", "translate(" + d3.mouse(this)[0] + "," + d3.mouse(this)[1] + ")");
    ximgGrid.select(".xGridListen")
          .attr("transform","translate(" + (d3.mouse(this)[0]-5) + "," + (0) + ")");
    yimgGrid.select(".xGridListen")
          .attr("transform","translate(" + (0) + "," + (d3.mouse(this)[1]-5) + ")");
  }//ON IMAGE MOVE

  let gridData = [];

  function onImageClick() {
    // console.log(d3.mouse(this));
    imgfocus.append("circle")
        .attr("class", "gridO")
        .attr("cx",d3.mouse(this)[0]-5)
        .attr("cy",d3.mouse(this)[1]-5)
        .attr("r", 5)
        .attr("stroke","red").attr("fill","red")
        .on("click",removeImgFocus);

  gridData.push({x:(d3.mouse(this)[0]-5),y:(d3.mouse(this)[1]-5)});
  gridData.sort((a, b) => {return a.x>b.x});
  computeLoss();
  connectTheDots();
  }//ON IMAGE CLICK

  function removeImgFocus() {
    this.remove()
  }


  // ##############################################

  let eqnBoxWidth = imageWidth/1.05,
      eqnBoxMargin = (imageWidth - eqnBoxWidth)/2;

  let gridDataPath = gipContainer.append("g")
                                 .attr("transform","translate("+(0)+","+(0)+")");

  let gridDataFit = gipContainer.append("g")
                                .attr("transform","translate("+(0)+","+(0)+")");


  let eqNloss = gipContainer.append("g")
                                .attr("transform","translate("+(0)+","+(0)+")");

  let sliderHeight = imageWidth/5;
  let sliderBallRadius = sliderHeight/7;
  let gipSliders = gipContainer.append("g")
                              .attr("transform","translate("+(imageWidth/2-sliderHeight)+","+(imageHeight-sliderHeight-3*MARGINbr.bottom)+")");

gipSliders.append("rect").attr("class", "gipSliders").attr("width", 2).attr("height", sliderHeight).attr("fill","#fff").attr("x", 0).attr("y", 0);
gipSliders.append("circle").attr("class", "xShift").attr("cx",1).attr("cy",0).attr("r",sliderBallRadius).call(d3.drag().on("start",xShift).on("drag",xShift).on("end",xShift));
gipSliders.append("text").attr("x", 0).attr("y", sliderHeight+30).attr("font-size",eqnBoxWidth/35+"px").attr("fill","#fff").attr("dominant-baseline","middle").style("text-anchor", "middle").text("X-shift");

gipSliders.append("rect").attr("class", "gipSliders").attr("width", 2).attr("height", sliderHeight).attr("fill","#fff").attr("x", eqnBoxWidth/8).attr("y", 0);
gipSliders.append("circle").attr("class", "yShift").attr("cx",eqnBoxWidth/8+1).attr("cy",0).attr("r",sliderBallRadius).call(d3.drag().on("start",yShift).on("drag",yShift).on("end",yShift));
gipSliders.append("text").attr("x", eqnBoxWidth/8).attr("y", sliderHeight+30).attr("font-size",eqnBoxWidth/35+"px").attr("fill","#fff").attr("dominant-baseline","middle").style("text-anchor", "middle").text("Y-shift");

gipSliders.append("rect").attr("class", "gipSliders").attr("width", 2).attr("height", sliderHeight).attr("fill","#fff").attr("x", 2*eqnBoxWidth/8).attr("y", 0);
gipSliders.append("circle").attr("class", "quad").attr("cx",2*eqnBoxWidth/8+1).attr("cy",0).attr("r",sliderBallRadius).call(d3.drag().on("start",quadShift).on("drag",quadShift).on("end",quadShift));
gipSliders.append("text").attr("x", 2*eqnBoxWidth/8).attr("y", sliderHeight+30).attr("font-size",eqnBoxWidth/35+"px").attr("fill","#fff").attr("dominant-baseline","middle").style("text-anchor", "middle").text("__²");

gipSliders.append("rect").attr("class", "gipSliders").attr("width", 2).attr("height", sliderHeight).attr("fill","#fff").attr("x", 3*eqnBoxWidth/8).attr("y", 0);
gipSliders.append("circle").attr("class", "forth").attr("cx",3*eqnBoxWidth/8+1).attr("cy",0).attr("r",sliderBallRadius).call(d3.drag().on("start",forthShift).on("drag",forthShift).on("end",forthShift));
gipSliders.append("text").attr("x", 3*eqnBoxWidth/8).attr("y", sliderHeight+30).attr("font-size",eqnBoxWidth/35+"px").attr("fill","#fff").attr("dominant-baseline","middle").style("text-anchor", "middle").text("__⁴");


d3.select(".xShift").attr("transform","translate("+(0)+","+(1*sliderHeight/2)+")");
d3.select(".yShift").attr("transform","translate("+(0)+","+(1*sliderHeight/2)+")");
d3.select(".quad").attr("transform","translate("+(0)+","+(2*sliderHeight/3)+")");
d3.select(".forth").attr("transform","translate("+(0)+","+(1*sliderHeight/2)+")");



let theforthbe = 100000000;
let thesecondbe = 10000;

let fxSlider = mapXshift(1*sliderHeight/2);
let fySlider = mapYshift(1*sliderHeight/2);
let quadSlider = mapQuad(2*sliderHeight/3);
let cubSlider = mapForth(1*sliderHeight/2);

function mapXshift(u) {
  return 200-(u/sliderHeight)*(200);
}

function mapYshift(u) {
  return 200-(u/sliderHeight)*(200);
}

function mapQuad(u) {
  return 90-(u/sliderHeight)*(100);
}

function mapForth(u) {
  return 10-(u/sliderHeight)*(20);
}

function xShift() {
  if (d3.event.y>0 & d3.event.y<sliderHeight+sliderBallRadius) {
    fxSlider=mapXshift(d3.event.y);
    d3.select(this).attr("transform","translate("+(0)+","+(d3.event.y)+")");
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${+(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }
}

function yShift() {
  if (d3.event.y>0 & d3.event.y<sliderHeight+sliderBallRadius) {
    fySlider=mapYshift(d3.event.y);
    d3.select(this).attr("transform","translate("+(0)+","+(d3.event.y)+")");
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }
}

function quadShift() {
  if (d3.event.y>0 & d3.event.y<sliderHeight+sliderBallRadius) {
    quadSlider=mapQuad(d3.event.y);
    d3.select(this).attr("transform","translate("+(0)+","+(d3.event.y)+")");
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }
}

function forthShift() {
  if (d3.event.y>0 & d3.event.y<sliderHeight+sliderBallRadius) {
    cubSlider=mapForth(d3.event.y);
    d3.select(this).attr("transform","translate("+(0)+","+(d3.event.y)+")");
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }
}

  eqnRect = eqNloss.append("rect")
      .attr("class", "eqNloss")
      .attr("width", eqnBoxWidth)
      .attr("height", eqnBoxWidth/5)
      .attr("fill","none")
      .attr("stroke","#fff")
      .attr("x", eqnBoxMargin)
      .attr("y", eqnBoxMargin);

  eqNloss.append("text").attr("class","eqnText")
      .attr("font-size",eqnBoxWidth/30+"px")
      .attr("dominant-baseline","middle")
      .style("text-anchor", "middle")
      .attr("fill","#fff")
      .attr("x", eqnBoxMargin+eqnBoxWidth/2)
      .attr("y", eqnBoxMargin+eqnBoxWidth/5/4);

eqNloss.append("text").attr("class","lossText")
    .attr("font-size",eqnBoxWidth/35+"px")
    .attr("dominant-baseline","middle")
    .style("text-anchor", "middle")
    .attr("fill","#fff")
    .attr("x", eqnBoxMargin+eqnBoxWidth/2)
    .attr("y", eqnBoxMargin+eqnBoxWidth/5/1.7);

eqNloss.append("text").attr("class","hint")
    .attr("font-size",eqnBoxWidth/50+"px")
    .attr("dominant-baseline","middle")
    .style("text-anchor", "middle")
    .attr("fill","#fff")
    .attr("x", eqnBoxMargin+eqnBoxWidth/2)
    .attr("y", eqnBoxMargin+eqnBoxWidth/5.5);



  function connectTheDots() {
    // console.log('extract');
    gridDataPath.remove();
    gridDataPath = gipContainer.append("g")
                                   .attr("transform","translate("+(0)+","+(0)+")");
    gridData.sort((a, b) => {return a.x-b.x});

    gridDataPath.append("path").attr("d",smoothLineGridData(gridData))
                .attr("stroke-width","1px")
                .attr("fill","none")
                .attr("stroke","white");
  }// connectTheDots

  let fx,fy,quad,cub;

  let smoothFitGridData = d3.line().curve(d3.curveCardinal)
                .x(function(d){ return (d.x); })
                .y(function(d){
                    if ((quad*(d.x-xScaleGip(fx))**2+cub*(d.x-xScaleGip(fx))**4+(fy))<0) {
                      return yScaleGip(0);
                    }else if ((quad*(d.x-xScaleGip(fx))**2+cub*(d.x-xScaleGip(fx))**4+(fy))>300) {
                      return yScaleGip(299.95);
                    }else {
                      return yScaleGip((quad*(d.x-xScaleGip(fx))**2+cub*(d.x-xScaleGip(fx))**4+(fy)));
                    }});

  // superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹"
  eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                       (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                       (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);

  fxSlider.oninput = () => {

  }

  fySlider.oninput = () => {
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }

  quadSlider.oninput = () => {
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }

  cubSlider.oninput = () => {
    drawFit();
    eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                         (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                         (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
  }


  function drawFit() {
    // console.log('fit');
    gridData.sort((a, b) => {return a.x>b.x});
    gridDataFit.remove();
    gridDataFit = gipContainer.append("g").attr("class","fitline")
                                   .attr("transform","translate("+(0)+","+(0)+")");

    let fitabsisa = [];
    for (let xi = 0; xi <= imageWidth;) {
      fitabsisa.push({x:xi});
      xi += 1 * imageWidth / 200.0;
    }
    fx = +fxSlider;
    fy = +fySlider;
    quad = +quadSlider / thesecondbe;
    cub = +cubSlider / theforthbe;
    // console.log(fx,fy,quad,cub);
    // console.log(fitabsisa,gridData);
    gridDataFit.append("path").attr("d",smoothFitGridData(fitabsisa))
                .attr("stroke-width","2px")
                .attr("fill","none")
                .attr("stroke","red");

    computeLoss();
  } //DRAW FIT

  function computeLoss() {
    let cumsum = 0;

    // console.log(gridData.length);
    if (gridData.length===0) {
      eqNloss.select(".lossText").attr("font-size",eqnBoxWidth/30+"px").text(`Go ahead and pick some point to compute the loss`);
      eqNloss.select(".hint").text(`These points will be the ground truth for loss computation.`);

    }
    else {
      gridData.forEach((item, i) => {
        cumsum += (item.y - yScaleGip(quad*(item.x-xScaleGip(fx))**2+cub*(item.x-xScaleGip(fx))**4+fy))**2;
      });
      cumsum /= gridData.length;
      eqNloss.select(".lossText").attr("font-size",eqnBoxWidth/25+"px").text(`Loss: ${+cumsum.toFixed(2)}`);
      eqNloss.select(".hint").text(`Now use the slider to optimize the loss or pick some more ponts. Have Fun!`);
    }


    let x = gridData.map((d) => {
      return d.x;
    });

    let y = gridData.map((d) => {
      return d.y;
    });

    let yModel = x.map((i) => {
      return 425-(quad*(i-fx-25)**2+cub*(i-fx-25)**4+fy);
    });

  }//COMPUTE LOSS

  clear.addEventListener('click',function subtract() {
    // console.log('fit');


    fxSlider = mapXshift(1*sliderHeight/2);
    fySlider = mapYshift(1*sliderHeight/2);
    quadSlider = mapQuad(2*sliderHeight/3);
    cubSlider = mapForth(1*sliderHeight/2);

    gridDataFit.remove();
    gridDataFit = gipContainer.append("g")
                                   .attr("transform","translate("+(0)+","+(0)+")");
    imgfocus.remove();
    imgfocus = gipContainer.append("g")
       .style("display", "null");

    gridDataPath.remove();
    gridDataPath = gipContainer.append("g")
                                  .attr("transform","translate("+(0)+","+(0)+")");
   gridData = [];
   eqNloss.select(".eqnText").text(`y = ${(fySlider).toFixed(2)} +
                                        (${+(quadSlider/thesecondbe).toPrecision(1)}) (x - ${(fxSlider).toFixed(2)})² +
                                        (${+(cubSlider/theforthbe).toPrecision(2)}) (x - ${(fxSlider).toFixed(2)})⁴`);
   drawFit();
  },false);

  drawFit();
} // RESPOND LISTEN

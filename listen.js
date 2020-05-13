d3.tsv("phase_bkg.tsv",(error,phase) => {
  let subtract = document.querySelector("#subtract");
  let extract = document.querySelector("#extract");
  let fit = document.querySelector("#fit");
  let clear = document.querySelector("#clear");

  let marginListen = {left:40, right:20, top:100, bottom:100};

  let widthListen = 500;
  let heightListen = 500;

  let vgDC = Object.keys(phase[0]);
  var dataListen = vgDC.map((i) => {
                        let yv = [];
                        // let xv = [];
                        phase.forEach((item, j) => {
                          yv.push({"x":j,"y":+item[i]});
                          // xv.push(j);
                        });
                        // console.log(i);
                        return yv;
                      })
  let zeroIndex = vgDC.findIndex((i)=>i==0)


  let singleData = dataListen[0];
  console.log(singleData);

  let maxXListen = d3.max(singleData,function(d){return d.x; });
  let maxYListen = d3.max(singleData,function(d){return d.y; }) + 1*dataListen.length;
  let minYListen = d3.min(singleData,function(d){return d.y; });

  console.log(maxYListen,maxXListen);

  let yScaleListen = d3.scaleLinear().domain([minYListen,250]).range([(heightListen-marginListen.top-marginListen.bottom),0]);
  let xScaleListen = d3.scaleLinear().domain([0,maxXListen]).range([0,(widthListen-marginListen.left-marginListen.right)]);

  let yAxisListen = d3.axisLeft().scale(yScaleListen);
  let xAxisListen = d3.axisBottom().scale(xScaleListen);

  var smoothLineListen = d3.line()
                .x(function(d){ return xScaleListen(d.x); })
                .y(function(d){ return yScaleListen(d.y); });

  let lineSVG = d3.select(".rawdata").append("svg").attr("height","100%").attr("width","100%");

  let graphContainer = lineSVG.append("g")
                          .attr("class","graphContainer")
                          .attr("transform","translate("+0+","+heightListen+")rotate(270)");

  graphContainer.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+(marginListen.left)+","+(heightListen-marginListen.bottom)+")")
                            // .attr("stroke","black")
                            .call(xAxisListen.ticks(5));
  graphContainer.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+(marginListen.left)+","+marginListen.bottom+")")
                            // .attr("stroke","black")
                            .call(yAxisListen.ticks(5));

  console.log(singleData);
  // lineSVG.append('path').datum(singleData)
  //             .attr('class', 'grid').attr("stroke","black")
  //             .attr('d', smoothLineListen);

  let listenPath = graphContainer.append("g")
                                 .attr("transform","translate("+(marginListen.left)+","+(marginListen.top)+")");

  dataListen.forEach((item, i) => {
    let sdt = item.map((e,v) => {
      return {"x":e.x,"y":e.y + i*1.25}
    })
    listenPath.append("path").attr("d",smoothLineListen(sdt)).attr("stroke-width","0.5px");
  });

// ##############################################
  let yScaleGip = d3.scaleLinear().domain([0,maxXListen]).range([475,0]);
  let xScaleGip = d3.scaleLinear().domain([0,250]).range([0,475/1.5]);

  let yAxisGip = d3.axisLeft().scale(yScaleGip);
  let xAxisGip = d3.axisBottom().scale(xScaleGip);

  var smoothLineGridData = d3.line()
                .x(function(d){ return (d.x); })
                .y(function(d){ return (d.y); });

  let gipSVG = d3.select(".subtracted").append("svg").attr("height","550px").attr("width","500px");

  let gipContainer = gipSVG.append("g")
                          .attr("class","gipContainer")
                          .attr("transform","translate("+95+","+30+")");

  gipContainer.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+0+","+475+")")
                            // .attr("stroke","black")
                            .call(xAxisGip.ticks(5));
  gipContainer.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+0+","+0+")")
                            // .attr("stroke","black")
                            .call(yAxisGip.ticks(5));

  gipContainer.append("image")
              .attr("xlink:href", "amp.png")
              .attr('height', 475)
              .on("click", onImageClick)
              .on("mousemove", onImageMove);

  // ximgBox.attr("transform", "translate(" + 0 + "," + 1.09*heightStocks + ")");
  // yimgBox.attr("transform", "translate(" + 0 + "," + 0 + ")");

  var ximgGrid = gipContainer.append("g").attr("class", "imgGrid").style("display", "null");
  ximgGrid.append("rect")
      .attr("class", "xGrid")
      .attr("width", 0.5)
      .attr("height", 475)
      .attr("x", 0.0)
      .attr("y", 0);

  var yimgGrid = gipContainer.append("g").attr("class", "Grid").style("display", "null");
  yimgGrid.append("rect")
      .attr("class", "xGrid")
      .attr("width", 475/1.5)
      .attr("height", 0.5)
      .attr("x", 0.0)
      .attr("y", 0);

  var imgfocus = gipContainer.append("g")
      .style("display", "null");
  //




  function onImageMove() {
    // console.log(d3.mouse(this));
    // .transition().duration(100).select(".gridO")
    // imgfocus.select(".gridO")
    //         .attr("transform", "translate(" + d3.mouse(this)[0] + "," + d3.mouse(this)[1] + ")");
    ximgGrid.select(".xGrid")
          .attr("transform","translate(" + (d3.mouse(this)[0]-5) + "," + (0) + ")");
    yimgGrid.select(".xGrid")
          .attr("transform","translate(" + (0) + "," + (d3.mouse(this)[1]-5) + ")");
  }

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
  }
  function removeImgFocus() {
    this.remove()
  }


// ##############################################



  subtract.addEventListener('click',function subtract() {
    console.log('subtract');
    gridData.sort((a, b) => {return a.x>b.x});
    console.log(gridData);
      // phase.forEach((item, i) => {
      //   console.log(Object.keys(item));
      // });

      // console.log(zeroIndex);

  },false);

  let gridDataPath = gipContainer.append("g")
                                 .attr("transform","translate("+(0)+","+(0)+")");

  extract.addEventListener('click',function subtract() {
    console.log('extract');
    gridData.sort((a, b) => {return a.x>b.x});
    gridDataPath.append("path").attr("d",smoothLineGridData(gridData))
                .attr("stroke-width","1px")
                .attr("fill","none")
                .attr("stroke","white");
  },false);

  let fx,fy,quad,cub;

  var smoothFitGridData = d3.line().curve(d3.curveCardinal)
                .x(function(d){ return (d.x); })
                .y(function(d){ return 425-(quad*(d.x-fx-25)**2+cub*(d.x-fx-25)**4+fy); });

  let fxSlider = document.getElementById("fx");
  let fxOP = document.getElementById("fxCV");
  let fySlider = document.getElementById("fy");
  let fyOP = document.getElementById("fyCV");
  let quadSlider = document.getElementById("quad");
  let quadOP = document.getElementById("quadCV");
  let cubSlider = document.getElementById("cub");
  let cubOP = document.getElementById("cubCV");

  fxOP.innerHTML = +fxSlider.value;
  fyOP.innerHTML = +fySlider.value;
  quadOP.innerHTML = +quadSlider.value/1000;
  cubOP.innerHTML = +cubSlider.value;

  fxSlider.oninput = () => {
    drawFit();
    fxOP.innerHTML = +fxSlider.value;
  }

  fySlider.oninput = () => {
    drawFit();
    fyOP.innerHTML = +fySlider.value;
  }

  quadSlider.oninput = () => {
    drawFit();
    quadOP.innerHTML = +quadSlider.value/1000;
  }

  cubSlider.oninput = () => {
    drawFit();
    cubOP.innerHTML = +cubSlider.value/100000;
  }

  fit.addEventListener('click',drawFit,false);

  function drawFit() {
    // console.log('fit');
    gridData.sort((a, b) => {return a.x>b.x});
    gridDataPath.remove();
    gridDataPath = gipContainer.append("g")
                                   .attr("transform","translate("+(0)+","+(0)+")");
    fx = +fxSlider.value;
    fy = +fySlider.value;
    quad = +quadSlider.value / 1000;
    cub = +cubSlider.value / 100000;
    // console.log(fx,fy,quad,cub);
    gridDataPath.append("path").attr("d",smoothFitGridData(gridData))
                .attr("stroke-width","2px")
                .attr("fill","none")
                .attr("stroke","red");

    computeLoss();
  }

  let lossCV = document.getElementById("lossCV");

  function computeLoss() {
    let cumsum = 0;
    gridData.forEach((item, i) => {
      // console.log(item.y,425-(quad*(item.x-fx-25)**2+cub*(item.x-fx-25)**4+fy));
      console.log(cumsum);
      cumsum += (item.y - 425+(quad*(item.x-fx-25)**2+cub*(item.x-fx-25)**4+fy))**2;
      console.log(item.y,425-(quad*(item.x-fx-25)**2+cub*(item.x-fx-25)**4+fy),cumsum);
    });
    cumsum /= gridData.length;
    lossCV.innerHTML = +cumsum;
    // console.log(cumsum);

    let x = gridData.map((d) => {
      return d.x;
    });

    let y = gridData.map((d) => {
      return d.y;
    });

    let yModel = x.map((i) => {
      return 425-(quad*(i-fx-25)**2+cub*(i-fx-25)**4+fy);
    });



    console.log(y,yModel,cumsum);
  }



  clear.addEventListener('click',function subtract() {
    console.log('fit');
    imgfocus.remove();
    gridDataPath.remove();
    gridDataPath = gipContainer.append("g")
                                   .attr("transform","translate("+(0)+","+(0)+")");
   imgfocus = gipContainer.append("g")
       .style("display", "null");
   gridData = [];
  },false);
})

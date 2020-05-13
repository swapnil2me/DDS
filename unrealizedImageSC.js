d3.tsv("phase_bkg.tsv",(error,phase) => {
  let subtract = document.querySelector("#subtract");
  let extract = document.querySelector("#extract");
  let fit = document.querySelector("#fit");

  let marginListen = {left:50, right:50, top:40, bottom:40};

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

  let yScaleListen = d3.scaleLinear().domain([minYListen,maxYListen]).range([(heightListen-marginListen.top-marginListen.bottom),0]);
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
      return {"x":e.x,"y":e.y + i*1.15}
    })
    listenPath.append("path").attr("d",smoothLineListen(sdt)).attr("stroke-width","0.5px");
  });

// ##############################################

  let contourSVG = d3.select(".subtracted").append("svg").attr("height","100%").attr("width","100%");


  let contourContainer = contourSVG.append("g")
                          .attr("class","contourContainer")
                          .attr("transform","translate("+marginListen.left+","+heightListen+")rotate(270)");

  contourContainer.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+(marginListen.left)+","+(heightListen-marginListen.bottom)+")")
                            // .attr("stroke","black")
                            .call(xAxisListen.ticks(5));
  contourContainer.append("g").attr("class", "listenAxis")
                            .attr("transform","translate("+(marginListen.left)+","+marginListen.bottom+")")
                            // .attr("stroke","black")
                            .call(yAxisListen.ticks(5));

  let mCon = dataListen.length
  let nCon = dataListen[0].length

  console.log(dataListen[0][0]["y"]);

  let valuesCon = new Array(nCon*mCon);

  for (var j = 0, k = 0; j < mCon; ++j) {
    for (var i = 0; i < nCon; ++i, ++k) {
      valuesCon[k] = dataListen[+j][+i]["y"];
    }
  }

  let contours = d3.contours()
                    .size([nCon, mCon]);
                    // .thresholds(d3.range(2, 21).map(p => Math.pow(2, p)))
                    // (valuesCon);

  let interpolateTerrain = ()=>{
    const i0 = d3.interpolateHsvLong(d3.hsv(120, 1, 0.65), d3.hsv(60, 1, 0.90));
    const i1 = d3.interpolateHsvLong(d3.hsv(60, 1, 0.90), d3.hsv(0, 0, 0.95));
    return t => t < 0.5 ? i0(t * 2) : i1((t - 0.5) * 2);
  }
  let color = d3.scaleSequential(d3.extent(valuesCon), d3.interpolateSpectral);
  let thresholds = color.ticks(20);
  const path = d3.geoPath();
  for (const threshold of thresholds) {
    contourContainer.append("path")
        .attr("d", path(contours.contour(valuesCon, threshold)))
        .attr("fill", color(threshold));

    // yield contourSVG.node();
  }

  // contourContainer.append("g").attr("fill", "none")
  //                 .attr("stroke", "#fff")
  //                 .attr("stroke-opacity", 0.5)
  //                 .selectAll("path")
  //                 .data(contours)
  //                 // .join("path")
  //                 .attr("fill", d => color(d.value))
  //                 .attr("stroke", d => d3.lab(color(d.value)).darker(1))
  //                 .attr("d", d3.geoPath());
console.log(contours);
console.log(contourContainer);
// ##############################################



  subtract.addEventListener('click',function subtract() {
    console.log('subtract');

      // phase.forEach((item, i) => {
      //   console.log(Object.keys(item));
      // });

      console.log(zeroIndex);

  },false);

  extract.addEventListener('click',function subtract() {
    console.log('extract');
  },false);

  fit.addEventListener('click',function subtract() {
    console.log('fit');
  },false);
})


// ###############################################33
let mCon = dataListen.length;
let nCon = dataListen[0].length;
let buffer = new Uint8ClampedArray(width * height * 3); // have enough bytes

console.log(dataListen[0][0]["y"]);

let valuesCon = new Array(nCon*mCon);

for (var j = 0; j < mCon; ++j) {
  for (var i = 0; i < nCon; ++i) {
    var pos = (j * nCon + i) * 3;
    buffer[pos  ] = 255-dataListen[+j][+i]["y"];           // some R value [0, 255]
    buffer[pos+1] = 0;//255-dataListen[+j][+i]["y"];           // some G value
    buffer[pos+2] = 0;//255-dataListen[+j][+i]["y"];           // some B value
    // buffer[pos+3] = 255;           // set alpha channel
    // valuesCon[k] = ;
  }
}

// create off-screen canvas element
var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

// create imageData object
var idata = ctx.createImageData(width, height);

// set our buffer as source
idata.data.set(buffer);

// update canvas with new data
ctx.putImageData(idata, 0, 0);

var dataUri = canvas.toDataURL(); // produces a PNG file
var img = new Image();
img.src = dataUri;
// img.style.height=700+'px';
img.style.width=200+'px';
// img.width = 500;
console.log(img.height,img.width);
let myElement = document.getElementsByClassName('subtracted')[0];
console.log(canvas);
myElement.appendChild(img);

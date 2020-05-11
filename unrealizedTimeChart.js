var data1 = [],data2 = [];
var margin = { top: 30, right: 30, bottom: 50, left: 30 };
var width = 550;
var height = 350;
let dataPointLimit = 5;
var duration = 2000;

var chart = d3.select('#liveChart').append("svg")
              .attr('width', width-margin.right)
              .attr('height', height);

//
let dtHigh = new Date;
let dtLow = new Date;
dtLow.setSeconds(dtHigh.getSeconds()-10);
var liveDateFormatter = d3.timeFormat("%H:%M:%S");
//

dtHigh.setSeconds(dtHigh.getSeconds()+100);
var x = d3.scaleTime().domain([dtLow, dtHigh]).range([0, width]);
var globalX = dtLow;
var max = dtHigh;

// globalX.setSeconds(globalX.getSeconds() + duration);
console.log(globalX);
var step = x(5);
var y = d3.scaleLinear().domain([0, height-margin.bottom]).range([height-margin.bottom, 0]);

var xAxis = d3.axisBottom().scale(x).tickFormat(liveDateFormatter);;
var yAxis = d3.axisLeft().scale(y);

var axisX = chart.append('g').attr('class', 'x axis')
       .attr('transform', 'translate('+(margin.left)+', '+(height-margin.bottom)+')')
       .call(xAxis.ticks(5));
var axisY = chart.append('g').attr('class', 'x axis')
      .attr('transform', 'translate('+(margin.left)+', '+0+')')
      .call(yAxis.ticks(5));


//

let globalXtmp = globalX;
console.log(globalXtmp);
    globalXtmp.setSeconds(globalXtmp.getSeconds() - dataPointLimit*duration/1000);
console.log(globalXtmp);
console.log(data1[0]);
for (var i = 0; i < dataPointLimit; i++) {

      data1.push({x: new Date(globalXtmp),y: ((Math.random() * 100 + 50) >> 0)});
      data2.push({x: globalXtmp,y: ((Math.random() * 10 + 250) >> 0)});
      console.log((data1[0].x));
      globalXtmp.setSeconds(globalXtmp.getSeconds() + duration/1000);
      console.log(globalX);
}
console.log(data1);
// -----------------------------------
var line = d3.line()
          .x(function(d){ return x(d.x); })
          .y(function(d){ return y(d.y); });
var smoothLine = d3.line().curve(d3.curveCardinal)
          .x(function(d){ return x(d.x); })
          .y(function(d){ return y(d.y); });
var lineArea = d3.area()
          .x(function(d){ return x(d.x); })
          .y0(y(0))
          .y1(function(d){ return y(d.y); })
          .curve(d3.curveCardinal);
let plotGroup =chart.append('g')
                    .attr('transform', 'translate('+(margin.left+15)+', '+0+')');
var path1 = plotGroup.append('path');
var path2 = plotGroup.append('path');
var areaPath1 = plotGroup.append('path');
var areaPath2 = plotGroup.append('path');
// Main loop
function tick() {
  // Generate new data
  var point1 = {
                x: globalX,
                y: ((Math.random() * 100 + 50) >> 0)
              },
      point2 = {
                    x: globalX,
                    y: ((Math.random() * 10 + 250) >> 0)
                   };

  data1.push(point1);
  data2.push(point2);
  globalX.setSeconds(globalX.getSeconds() + duration/1000);

  addDataPoint(data1,path1,areaPath1,'smoothline','area');
  addDataPoint(data2,path2,areaPath2,'smoothline','area');

  function addDataPoint(dataPoint,patH,areA,lineClass,areaClass) {
    x.domain([dtLow.setSeconds(), dtHigh]);
    axisX.transition()
       .duration(duration)
       .ease(d3.easeLinear,3)
       .call(xAxis);

    patH.datum(dataPoint)
      .attr('class', lineClass)
      .attr('d', smoothLine);
    areA.datum(dataPoint)
      .attr('class', areaClass)
      .attr('d', lineArea);

    patH.attr('transform', null)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear,3)
      .attr('transform', 'translate(' + x(dtLow) + ')')
    areA.attr('transform', null)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear,3)
      .attr('transform', 'translate(' + x(dtLow) + ')')
      .on('end', tick)

  }
  // Remote old data (max 50 points)
  if (data1.length > dataPointLimit) {data1.shift();data2.shift()};
}
tick();

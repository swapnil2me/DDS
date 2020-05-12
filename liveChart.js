      var data1 = [],data2 = [],data3 = [];
      var margin = { top: 30, right: 30, bottom: 50, left: 50 };
      var width = 550;
      var height = 375;
      let dataPointLimit = 100;
      var duration = 3000;
      var max = 500;
      var step = 5;
      var chart = d3.select('#liveChart').append("svg")
                    .attr('width', width-margin.right)
                    .attr('height', height);

      //
      let dtHigh = new Date;
      let dtLow = new Date;
      dtLow.setHours(dtHigh.getHours()-3);
      var xsclS = d3.scaleTime().range([0, width]);
          xsclS.domain([dtLow, dtHigh]);
      var liveDateFormatter = d3.timeFormat("%H:%M:%S");
      var xAxisS = d3.axisBottom()
          .scale(xsclS)
          .tickFormat(liveDateFormatter);
      // -----------------------------------



      //
      var x = d3.scaleTime().domain([0, width]).range([0, width]);
      var globalX = x(dtHigh);
      var y = d3.scaleLinear().domain([35, height-margin.bottom-margin.top]).range([height-margin.bottom-margin.top, 0]);

      var xAxis = d3.axisBottom().scale(x).tickFormat(liveDateFormatter);;
      var yAxis = d3.axisLeft().scale(y);

      var axisX = chart.append('g').attr('class', 'liveAxis')
             .attr('transform', 'translate('+(margin.left)+', '+(height-margin.bottom)+')')
             .call(xAxis.ticks(5));
      var axisY = chart.append('g').attr('class', 'liveAxis')
            .attr('transform', 'translate('+((margin.left))+', '+margin.top+')')
            .call(yAxis.ticks(5));


      //

      let globalXtmp = globalX-dataPointLimit*step;
      for (var i = 0; i < dataPointLimit; i++) {

            data1.push({x: globalXtmp,y: ((Math.random() * 10 + 250) >> 0)});
            data2.push({x: globalXtmp,y: ((Math.random() * 100 + 50) >> 0)});
            data3.push({x: globalXtmp,y: ((Math.random() * 30 + 100) >> 0)});
            globalXtmp += step;
      }
      // -----------------------------------
      var line = d3.line()
  					    .x(function(d){ return x(d.x); })
  					    .y(function(d){ return y(d.y); });
      var smoothLine = d3.line().curve(d3.curveCardinal)
  					    .x(function(d){ return x(d.x); })
  					    .y(function(d){ return y(d.y); });
      var lineArea = d3.area()
  					    .x(function(d){ return x(d.x); })
  					    .y0(y(40))
  					    .y1(function(d){ return y(d.y); })
  					    .curve(d3.curveCardinal);
      // -----------------------------------
      // Draw the axis
      // console.log(height-margin.bottom);

      // Draw the grid
      // chart.append('path').datum([{x: 0, y: 150}, {x: width, y: 150}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // chart.append('path').datum([{x: 0, y: 300}, {x: width, y: 300}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // chart.append('path').datum([{x: 0, y: 450}, {x: width, y: 450}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // chart.append('path').datum([{x: 50, y: 0}, {x: 50, y: height}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // chart.append('path').datum([{x: 250, y: 0}, {x: 250, y: height}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // chart.append('path').datum([{x: 450, y: 0}, {x: 450, y: height}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // chart.append('path').datum([{x: 650, y: 0}, {x: 650, y: height}])
  		// 			    .attr('class', 'grid')
  		// 			    .attr('d', line);
      // Append the holder for line chart and fill area
      let plotGroup =chart.append('g')
                          .attr('transform', 'translate('+(margin.left+18)+', '+(margin.top+5)+')');
      var path1 = plotGroup.append('path');
      var path2 = plotGroup.append('path');
      var path3 = plotGroup.append('path');
      var areaPath1 = plotGroup.append('path');
      var areaPath2 = plotGroup.append('path');
      var areaPath3 = plotGroup.append('path');

      let title = chart.append('g').attr('transform', 'translate('+(width)/2+','+margin.top+')');

      title.append("text").attr("class","d3Text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill","white")
      .attr("stroke","white")
      .attr("stroke-width","0.1")
      .attr("font-size","20")
      .attr("dominant-baseline","middle")
      .attr("text-anchor","middle")
      .text("Live Updates");


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
            point3 = {
                 		    x: globalX,
                 		    y: ((Math.random() * 30 + 180) >> 0)
                 	     };

  	    data1.push(point1);
        data2.push(point2);
        data3.push(point3);
  	    globalX += step;

        addDataPoint(data1,path1,areaPath1,'smoothline1','area1');
        addDataPoint(data2,path2,areaPath2,'smoothline2','area2');
        addDataPoint(data3,path3,areaPath3,'smoothline3','area3');

        function addDataPoint(dataPoint,patH,areA,lineClass,areaClass) {
          x.domain([globalX - (max-step), globalX]);
    	    axisX.transition()
    		     .duration(duration)
             .ease(d3.easeLinear,1)
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
            .attr('transform', 'translate(' + x(globalX - max) + ')')
          areA.attr('transform', null)
    		    .transition()
    		    .duration(duration)
            .ease(d3.easeLinear,3)
    		    .attr('transform', 'translate(' + x(globalX - max) + ')')
    		    .on('end', tick)

        }
  	    // Remote old data (max 50 points)
  	    if (data1.length > dataPointLimit) {data1.shift();data2.shift();data3.shift()};
      }
      tick();

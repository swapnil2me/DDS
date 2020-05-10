      var data = [
            ];
      var margin = { top: 30, right: 30, bottom: 30, left: 30 };
      var width = 350;
      var height = 350;
      var globalX = 0;
      var duration = 500;
      var max = 500;
      var step = 10;
      var chart = d3.select('#liveChart').append("svg")
                    .attr('width', width)
                    .attr('height', height);
      var x = d3.scaleLinear().domain([0, width]).range([0, width]);
      var y = d3.scaleLinear().domain([0, height-margin.bottom]).range([height-margin.bottom, 0]);
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
      // -----------------------------------
      // Draw the axis
      console.log(height-margin.bottom);
      var xAxis = d3.axisBottom().scale(x);
      var axisX = chart.append('g').attr('class', 'x axis')
  			     .attr('transform', 'translate(0, '+(height-margin.bottom)+')')
  			     .call(xAxis);
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
      var path = chart.append('path');
      var areaPath = chart.append('path');
      // Main loop
      function tick() {
  	    // Generate new data
  	    var point = {
  		    x: globalX,
  		    y: ((Math.random() * 100 + 50) >> 0)
  	    };

  	    data.push(point);
  	    globalX += step;
  	    // Draw new line
  	    path.datum(data)
  		    .attr('class', 'smoothline')
  		    .attr('d', smoothLine);
  	    // Draw new fill area
  	    areaPath.datum(data)
  		    .attr('class', 'area')
  		    .attr('d', lineArea);
  	    // Shift the chart left
  	    x.domain([globalX - (max - step), globalX]);
  	    axisX.transition()
  		     .duration(duration)
  		     .ease(d3.easeLinear,2)
  		     .call(xAxis);
  	    path.attr('transform', null)
  		    .transition()
  		    .duration(duration)
  		    .ease(d3.easeLinear,2)
  		    .attr('transform', 'translate(' + x(globalX - max) + ')')
  	    areaPath.attr('transform', null)
  		    .transition()
  		    .duration(duration)
  		    .ease(d3.easeLinear,2)
  		    .attr('transform', 'translate(' + x(globalX - max) + ')')
  		    .on('end', tick)
  	    // Remote old data (max 50 points)
  	    if (data.length > 50) data.shift();
      }
      tick();

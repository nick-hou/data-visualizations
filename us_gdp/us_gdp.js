document.addEventListener('DOMContentLoaded', () => {

  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(dataset => plotData(dataset))

})

const plotData = dataset => {
  const w = 1000;
  const h = 500;
  const padding = 50;

  const minYear = d3.min(dataset.data, d => d[0].substring(0,4))
  const maxYear = d3.max(dataset.data, d => d[0].substring(0,4))

  const maxGDP = d3.max(dataset.data, d => d[1])


  //axis scales
  const xScale = d3.scaleLinear()
                   .domain([minYear-1, maxYear])
                   .range([padding, w-padding])

  const yScale = d3.scaleLinear()
                   .domain([0, maxGDP])
                   .range([h-2*padding, 0])

  //create graph
  const svg = d3.select("#data")
                .append("svg")
                .attr("class", "plot")
                .attr("width", w)
                .attr("height", h);

  var tooltip = d3.select("#data")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  var rect = svg.selectAll("rect")
     .data(dataset.data)
     .enter()
     .append('rect')
     .attr('class', 'plotvalue')
     .attr('x', d => {
       const year = parseInt(d[0].substring(0,4))
       const month = parseInt(d[0].substring(5,7))
       if(month > 9) return xScale(year + .75)
       else if(month > 6) return xScale(year + .5)
       else if (month > 3) return xScale(year + .25)
       else return xScale(year)
     })
     .attr('y', d => yScale(d[1]) + padding)
     .attr('width', '2')
     .attr('height', d => yScale(maxGDP - d[1]))

     .on('mouseover', function (d, i) {
       d3.select(this).transition()
                      .duration('200')
                      .attr('opacity', '.85');
       // document.getElementById('tooltip_' + i).setAttribute('visibility', 'visible')
       tooltip.transition()
              .duration(50)
              .style("opacity", 1)
       tooltip.html(() => {
                 const year = d[0].substring(0,4)
                 const month = d[0].substring(5,7)
                 switch (month) {
                  case '01':
                  case '02':
                  case '03':
                    return "Q1 " + year + "<br>" + d[1]
                  case '04':
                  case '05':
                  case '06':
                    return "Q2 " + year + "<br>" + d[1]
                  case '07':
                  case '08':
                  case '09':
                    return "Q3 " + year + "<br>" + d[1]
                  case '10':
                  case '11':
                  case '12':
                    return "Q4 " + year + "<br>" + d[1]
                  default:
                    return year
                }
              })
              .style('left', () => {
                const year = parseInt(d[0].substring(0,4))
                const month = parseInt(d[0].substring(5,7))
                if(month > 9) return (xScale(year + .75) + 5) + 'px'
                else if(month > 6) return (xScale(year + .5) + 5) + 'px'
                else if (month > 3) return (xScale(year + .25) + 5) + 'px'
                else return (xScale(year) + 5) + 'px'
              })
              .style('top', h/2 + 80 + 'px')

     })
     .on('mouseout', function (d, i) {
       d3.select(this).transition()
                      .duration('200')
                      .attr('opacity', '1');
       // document.getElementById('tooltip_' + i).setAttribute('visibility', 'hidden')
       tooltip.transition()
              .duration('50')
              .style("opacity", 0)
     })

  //
  // svg.selectAll("div")
  //    .data(dataset.data)
  //    .enter()
  //    .append("div")
  //    .attr('class', 'tooltip')
  //    .attr('visibility', 'hidden')
  //    .attr('id', (d, i) => 'tooltip_'  + i)
  //    .html(d => {
  //      const year = d[0].substring(0,4)
  //      const month = d[0].substring(5,7)
  //      switch (month) {
  //       case '01':
  //       case '02':
  //       case '03':
  //         return "Q1 " + year + "<br>" + d[1]
  //       case '04':
  //       case '05':
  //       case '06':
  //         return "Q2 " + year + "<br>" + d[1]
  //       case '07':
  //       case '08':
  //       case '09':
  //         return "Q3 " + year + "<br>" + d[1]
  //       case '10':
  //       case '11':
  //       case '12':
  //         return "Q4 " + year + "<br>" + d[1]
  //       default:
  //         return year
  //     }
  //    })
  //    .attr('x', d => {
  //      const year = parseInt(d[0].substring(0,4))
  //      const month = parseInt(d[0].substring(5,7))
  //      if(month > 9) return xScale(year + .75) + 5
  //      else if(month > 6) return xScale(year + .5) + 5
  //      else if (month > 3) return xScale(year + .25) + 5
  //      else return xScale(year) + 5
  //    })
  //    .attr('y', h/2)
  //    .attr('font-size', '12px')
  //

   const xAxis = d3.axisBottom(xScale)
                   //remove commas from year
                   .tickFormat(d3.format(".0f"))
                   .tickSize(10)
   const yAxis = d3.axisLeft(yScale)

   svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

   svg.append("g")
      .attr("transform", "translate(" + padding + ", " + padding + ")")
      .call(yAxis);
}

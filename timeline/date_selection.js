
const datebar_width = 80
const unselected_width = 10

function setUpDateSelector(dates){
    d3.select("#date-label").text(dates[0])
    const timeline_bar = d3.select("#timeline-bar")

    timeline_bar.selectAll("*").remove() 
    const bar_svg = timeline_bar.append('svg')
                    .attr('class', "timeline-bar-svg")
                    .attr("viewBox", [0,0, datebar_width, innerHeight])
                    .attr("width", datebar_width)
                    .attr("height", innerHeight)
                    .style("border", "none");


    const yScale = d3.scaleTime()
        .domain([dates[0], dates[dates.length-1]]) 
        .range([0, height]); 

    for(const timeStamp of dates){
        bar_svg.append('text')
                .text(`${String(timeStamp)}s`)
                .attr('class', `bar-text hidden`)
                .attr('id', `bar-text-${String(timeStamp)}`)
                .attr('x', 0)
                .attr('y', yScale(timeStamp) - 5)

        //place it as a rect
        bar_svg.append('rect')
                .attr('class', `bar unselected`)
                .attr('id', `bar-date-${String(timeStamp)}`)
                .attr('x', 0)
                .attr('width', unselected_width)
                .attr('height', 1)
                .attr('y', yScale(timeStamp))
    }
    changeDate(dates)
}
function changeDate(dates){
    d3.select("#card").style('display','none').selectAll("*").remove()
    const scrollY = window.scrollY;
  
    //create buckets (sized by scroll_increment) based on the date range
    const scroll_increment = 15
    const index = Math.floor(scrollY / scroll_increment);
    const date = dates[dates.length- index%dates.length]
    // console.log("selecting the date", date)

    d3.select("#date-label")
        .text(date)

    // format the bar 
    d3.selectAll('.bar')
        .attr('x', datebar_width-unselected_width)
        .attr('class', 'bar unselected')
        .attr('width', unselected_width)
    d3.select(`#bar-date-${String(date)}`)
        .attr('x',0)
        .attr('class', 'bar selected')
        .attr('width', datebar_width)
   
    //format the bar text
    d3.selectAll('.bar-text')
        .attr('class', 'bar-text hidden')
    d3.select(`#bar-text-${String(date)}`)
        .attr('class', 'bar-text shown')

    d3.selectAll(`.timeline-svg`)
        .attr('class', 'timeline-svg hidden')
        .style('display', 'none')
    d3.select(`#timeline-${String(date)}`)
        .attr('class', 'timeline-svg visible')
        .style('display', 'inherit')

}

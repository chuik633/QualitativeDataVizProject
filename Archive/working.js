const datebar_width = 80
const unselected_width = 10

//determines how sensititve the scroll/date change is
const scroll_increment = 30

//height = height of svg (this is fixed)
//full_height = full scroll height (this depends on the scrollincrement and dates)
let full_height;
let dateToHeightScale;

function setUpDateSelector(dates){
    //dates are distributed across the svg height
    full_height = scroll_increment*(dates.length)
    d3.select(".scrolly").style('height', `${full_height+ window.innerHeight}px`)

    //create the scales
    dateToHeightScale = d3.scaleLinear()
        .domain([dates[0], dates[dates.length-1]]) 
        .range([0, height]); 

    //create the timeline_bar
    d3.select("#date-label").text(dates[0])
    const timeline_bar = d3.select("#timeline-bar")
    timeline_bar.selectAll("*").remove() 
    const bar_svg = timeline_bar.append('svg')
                    .attr('class', "timeline-bar-svg")
                    .attr("viewBox", [0,0, datebar_width, innerHeight])
                    .attr("width", datebar_width)
                    .attr("height", innerHeight)
                    .style("border", "none");

    for(const timeStamp of dates){
        bar_svg.append('text')
                .text(`${String(timeStamp)}s`)
                .attr('class', `bar-text hidden`)
                .attr('id', `bar-text-${String(timeStamp)}`)
                .attr('x', 0)
                .attr('y', dateToHeightScale(timeStamp) - 5)

        //place it as a rect
        bar_svg.append('rect')
                .attr('class', `bar unselected`)
                .attr('id', `bar-date-${String(timeStamp)}`)
                .attr('x', 0)
                .attr('width', unselected_width)
                .attr('height', 1)
                .attr('y', dateToHeightScale(timeStamp))
    }
    changeDate(dates)
}

function changeDate(dates){
    d3.select("#card").style('display','none').selectAll("*").remove()

    //get current scroll Position
    const scrollY = window.scrollY;
    //positon of the svg height
    const y_pos = ((scrollY%height)/full_height)*height
    const exact_scrollDate = dateToHeightScale.invert(y_pos)

    //place a line for the current scroll position

    const exact_scrollLine = d3.select("#scroll-line").style('top',`${y_pos + 102}px`)
    d3.select('#scroll-line-text').style('top',`${y_pos + 90}px`).text(Math.round(exact_scrollDate))

    //determine the date to display
    const index = Math.floor((scrollY) / scroll_increment)-1;
    const date = parseInt(dates[index%dates.length])
    if(isNaN(date)){
        return
    }
    

    //get surrounding dates
    let date_after = 2010
    if(index<dates.length-1){
        date_after = dates[(index+1)%dates.length]
    }
    //get the date difference
    const date_difference = date_after - date

    //shrink and scale the bars accordingly
    const barShrinkScale = d3.scalePow().exponent(.5)
        .domain([date, date + date_difference/2])
        .range([datebar_width-10, unselected_width])
    const barGrowScale = d3.scalePow().exponent(2)
        .domain([date + date_difference/2, date_after])
        .range([unselected_width,datebar_width-10])
    
    if(exact_scrollDate<date + date_difference/2){//before the half way
        const bar_length = barShrinkScale(exact_scrollDate)
        exact_scrollLine.style('width',bar_length + "px")
    }else{
        const bar_length = barGrowScale(exact_scrollDate)
        exact_scrollLine.style('width',bar_length + "px")
    }

    //display the date
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


     //I only want to fade timelines if its in the final half
     if(date_after - date_difference/3 < exact_scrollDate && exact_scrollDate < date_after){
        //Fade out if its in the final quarter of the current selected date
        const opacityDecScale = d3.scaleLinear()
            .domain([date_after - date_difference/3, date_after])
            .range([1,0])

        const fadeOutOpacity = opacityDecScale(exact_scrollDate)
        const fadeInOpacity = 1-fadeOutOpacity
        tooltip_help_me_code(100, 100, `#timeline-${String(date_after)}`)
        
        d3.select(`#timeline-${String(date)}`).style("opacity", fadeOutOpacity)
        d3.select(`#timeline-${String(date_after)}`)
            .attr('class', 'timeline-svg visible')
            .style('display', 'inherit').style("opacity", fadeInOpacity)
    }else{
        d3.select(`#timeline-${String(date)}`).style("opacity", 1)
    }

        

}
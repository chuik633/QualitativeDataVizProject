// ---------------------------------------------------------------------------------------------------------
//                                                 PLOTTING
// ---------------------------------------------------------------------------------------------------------

//adjust this all later
const padding = {
    "top":10,
    "bottom":10,
    "left": 10,
    "right": 10
}

const width = window.innerWidth -100
const height = window.innerHeight - 100
const innerHeight = height - padding.top - padding.bottom
const innerWidth = width - padding.left - padding.right
let display_mode = "reveal"


function setup_color_timelines(color_data, dates){
    const all_x_vals = Object.values(color_data).flatMap(d_map=> Object.values(d_map).map(d=>d.x))
    const all_y_vals = Object.values(color_data).flatMap(d_map=> Object.values(d_map).map(d=>d.y))
    console.log("X", all_x_vals, all_y_vals)
    const xScale = d3.scaleLinear()  //colorful <--> b/w (SATURATION)
        .domain([d3.min(all_x_vals), d3.max(all_x_vals)]) //TODO: can change the min max based on all the data 
        .range([100, innerWidth-50])
 
    const yScale = d3.scaleLinear() //HUE
        .domain([d3.min(all_y_vals), d3.max(all_y_vals)])
        .range([100, innerHeight - 150])

    for(const date of dates){
        color_timeline(color_data, date,xScale,yScale)
    }
    d3.select(`#timeline-${String(dates[0])}`)
        .attr('class', 'timeline-svg shown')


    // console.log("Images have been loaded...")
}

function color_timeline(color_data, date,xScale,yScale){
    //just look at this date to display (can modify this if we want a date range)
    let data = color_data[date]
    let cap = 100
    if(data.length > cap){
        data = data.slice(0, cap)
    }
    //create the svg
    const container = d3.select("#timeline-container")
                        .style("width", `${width}px`)
                        .style("height", `${height}px`)
                        // .style("background-color", `lightgray`)
    // container.selectAll("*").remove()
    const svg = container.append('svg')
                    .attr("viewBox", [0,0, innerWidth, innerHeight])
                    .attr("transform", `translate(${padding.left}, ${padding.top})`)
                    .attr("width", innerWidth)
                    .attr("height", innerHeight)
                    .attr("id", `timeline-${date}`)
                    .attr("class", `timeline-svg hidden`)
                    .style("border", "none");
    //place in the axis
     svg.append("g")
            .attr("transform", `translate(0, ${innerHeight/2})`)
            .attr("class", "x-axis")
            .call(
                d3.axisBottom(xScale)
            )
            .selectAll('.tick').remove()
    //----------------------------------------------------------------------------------------
    //1. create force nodes using our data
    let nodes = data.map(entry => {
        //load image to get the dimensions
        let img_width = 50
        let img_height = 30
        return {
            "entry": entry,
            "x": xScale(entry.x),  
            "y": yScale(entry.y),
            "img_width": img_width,
            "img_height": img_height,
            'vibrant': entry.vibrant
        } 
            
    });
    // console.log('nodes',nodes)
    nodes = data.map(entry =>{
        // const aspect_ratio = img.naturalWidth / img.naturalHeight;
        // const img_width = img_height*aspect_ratio

        return {
        "entry": entry,
        "x": xScale(entry.x),  
        "y": yScale(entry.y),
        "img_width": 50,
        "img_height": 50,
        'cluster':entry["K-means cluster"],
        'vibrant': entry.vibrant,
        'palete':[entry.vibrant, entry.muted, entry.darkVibrant, entry.darkMuted, entry.lightVibrant]
    }

    })
    const cluster_groups = d3.group(
        nodes,
        d=>d.cluster
    )
    
    function testCircles(){      
        svg.selectAll('g')
            .data(Array.from(cluster_groups))
            .join('g')
            .attr('class', d=>{
                // console.log("D1", d[1])
                return "cluster c-"+d[0]
            })
            .selectAll('circle')
                .data(d=>{
                    // console.log('d', d[1])
                    return d[1]
                })
                .join('circle')
                .attr('r', (d) => {
                    return d.img_width/2
                })
                .attr('cx', (d) => d.x)
                .attr('cy', (d) => d.y)
                .attr('fill', (d)=>d.vibrant)
                // .on("mouseover", function(event, d) {
                //     const className = `.c-${d.cluster}`
                //     d3.selectAll(".cluster").style("opacity",.5)
                //     d3.selectAll(className).style("opacity",.9)
                // })
                // .on("mouseout", function() {
                //     d3.selectAll(".cluster").style("opacity",1)
                    
                // });
    }
    function layoutImages() {
        svg.selectAll("image")
            .data(nodes)
            .join(
                enter => enter.append("image")
                    .attr('href', d => d.entry.imageUrl)
                    .attr('id', d => String(d.entry.id))
                    .attr('class', d => String(d.entry.date) + " svg-image " + String(d.entry.material))
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
                    .attr('width', d => d.img_width)
                    .attr('height', d => d.img_height)
                    .on('mouseover', (event, d) => {
                        // d3.select(`#${String(d.entry.id)}`)
                        //     .transition().duration(500)
                        //     .attr("width", 100)
                        //     .attr("height", d => 100)
                        //     d.img_width = 100
                        //     d.img_height = 100
                        // updateSimulation(100)
                        // d3.selectAll(`.svg-image`).attr('opacity', .2)
                        // console.log("MATERIAL",`.${d.entry}`)
                        // d3.selectAll(`.${d.entry.material}`).attr('opacity', 1)
                    })
                    .on('mouseout', (event, d) => {
                        // d3.select(`#${String(d.entry.id)}`)
                        //     .attr('opacity', 1);
                        // d3.select(`#${String(d.entry.id)}`)
                        //     .transition().duration(500)
                        //     .attr("width", 50)
                        //     .attr("height", d => 50)
                        //     d.img_width = 50
                        //     d.img_height = 50
                    })
                    .on('mousedown', (event, d) => {
                        d3.select(`#${String(d.entry.id)}`)
                            .attr('opacity', 0.1);
                    })
                    .on('click', (event, d) => {
                        console.log('click')
                        show_card(d.entry);
                        d3.select("#card")
                            .attr('x', d.x)
                            .attr('y', d.y)
                            .style('left', `${d.x}px`)
                            .style('top', `${d.y}px`);
                    }),
                update => update
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
                    .attr('width', d => d.img_width)
                    .attr('height', d => d.img_height),
                exit => exit.remove()
            );
    }

    function layoutColors(){
        svg.selectAll("rect")
        .data(nodes)
        .join(
            enter => enter.append("rect")
                .attr('id', d => "color-"+String(d.entry.id))
                .attr('class', d => String(d.entry.date)+ ' color-block')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .attr('faded', "false")
                .attr('fill', d=>d.entry.vibrant)
                .attr('width', d => d.img_width)
                .attr('height', d => d.img_height)
                .on('click', (event, d) => {
                    console.log('click')
                    show_card(d.entry);
                    d3.select("#card")
                        .attr('x', d.x)
                        .attr('y', d.y)
                        .style('left', `${d.x}px`)
                        .style('top', `${d.y}px`);
                })
               ,
            update => update
                .attr('x', d => d.x)
                .attr('y', d => d.y),
                // .attr('width', d => d.img_width),
            exit => exit.remove()
        );

    }

    layoutImages()
  
    layoutColors()
    

    // //handle image loading
    // d3.selectAll('.svg-image').each(function() {
    //     const svgImage = d3.select(this); // Current image selection
    //     svgImage.on('load', function() {
    //         const img_width = this.width.baseVal.value;  // Get the width
    //         const img_height = this.height.baseVal.value; // Get the height
    //         console.log(`SVG Image Width: ${img_width}, SVG Image Height: ${img_height}`);
    //     });

    //     // Check if the image is already loaded (cached)
    //     if (this.complete) {
    //         const img_width = this.width.baseVal.value;
    //         const img_height = this.height.baseVal.value;
    //         cconsole.log(`COMPLETE: ${img_width}, SVG Image Height: ${img_height}`);
    //     }
    // });

    function fade_nearby_color_blocks(mouseX, mouseY){
        const color_blocks = svg.selectAll(".color-block")
        for(const block of color_blocks){
            if(block.faded == "true" && display_mode == "image"){
                continue
            }
            
            const rect = block.getBoundingClientRect();
            const x_center = rect.left + rect.width/2
            const y_center = rect.top + rect.height/2

            const dx = Math.abs(x_center-mouseX)
            const dy = Math.abs(y_center-mouseY)
            
            const distance = Math.sqrt(dx**2 + dy**2)
           
            
            const insideRect = (
                mouseX>= rect.left && mouseX <=rect.right 
                && mouseY >= rect.top && mouseY <=rect.bottom
            );

            if(distance< 100){
                // console.log(nodes)
                console.log("changing height")
                const hat_id = block.id.split("color-")[1]
                // console.log("#"+hat_id)
                const hat_img = svg.select("#"+hat_id)
                // hat_img.transition()
                //     .duration(1000)
                //     .attr("width", 150)
                //     // .attr("height", 150)
      

            //     console.log("HEIGHT", hat_img)
            //     // block.width = 100
            //     // block.height = 100
            // }

            const detection_threshold = 100

            

        }

    }
    // testCircles()
    let activeNodes = [];

    // only activate the simulation for the active nodes
    function updateSimulation() {
        // console.log('updating simulation for xize:', size)
        if (activeNodes.length > 0) {
            const sim = d3.forceSimulation(activeNodes)
                .force("x", d3.forceX(d => d.x).strength(.05))
                .force("y", d3.forceY(d => d.y).strength(.01))
                .force("collide", d3.forceCollide(d=>(d.img_width + 20) / 2))
                .alphaDecay(0.005)
                .on("tick", () => {
                    nodes.forEach(d => {
                        // console.log("TICK", d)
                        let leftBound = d.img_width/2
                        let rightBound = Math.min(innerWidth-d.img_width/2, d.x)
                        let topBound = d.img_height /2 + 50
                        let bottomBound = Math.min(innerHeight - d.img_height /2, d.y)
                        d.x = Math.max(leftBound,rightBound);
                        d.y = Math.max(topBound,bottomBound);
                    });
            
                    // testCircles(); 
                    layoutImages()
                    layoutColors()
                 
                    
                    
                });
            sim.alpha(1).restart();
        }
    }

   //only move when near
    svg.on('mousemove', (event) => {
        let [mouseX, mouseY] = d3.pointer(event);
        // console.log("Y", mouseY, mouseY + window.screenY, event.screenY)
        mouseY +=100
        fade_nearby_color_blocks(mouseX, mouseY)
        activeNodes = nodes.filter(d => {
            // console.log("DHEHR", d)
            const dx = d.x - mouseX;
            const dy = d.y - mouseY;
            return Math.sqrt(dx * dx + dy * dy) < 100; 
        });
        updateSimulation();
        
    });

    //clear when not near
    svg.on('mouseout', () => {
        activeNodes = []; 
    });
}


function show_card(entry, x,y){
    const img_height = 200
    const card = d3.select("#card")
                    .attr('x', x)
                    .attr('y', y)
                    .style('left', `${x}px`)
                    .style('top', `${y}px`);
    card.selectAll("*").remove() //clear the card
    card.style('display','flex')

    let text_width_constraint = 200
   
    const img_container = card.append('div').attr('class', 'card-image-container')
    img_container.append('img')
        .attr('width', 100)
        .attr('height', 100)
        .attr('class', 'card-image')
        .attr('style', 'display:inherit')

    const color_fields = ["hue","saturation",	"lightness"	,"vibrant",	"muted",	"darkVibrant"	,"darkMuted",	"lightVibrant" ]  
    const colors_palette = img_container.append('div').attr("class", 'card-colors')    
    for(const color_field of color_fields){
        const color = entry[color_field]
        // console.log("color", color)
        if (String(color).includes('#')){
            colors_palette.append('div').attr("class", 'card-color').style('background', color)
        }else{
            console.log('color empty')
        }
        
    }

    const info_container = card.append('div').attr("class", 'card-info')
    info_container.append('text')
        .attr('class', 'card-title')
        .text(entry.title)


    const fields = ["date", "physicalDescription", "topic", "notes"]
    for(const field of fields){
        const field_container = info_container.append('div').attr("class", 'field-container')
        field_container.append("text")
                .text(field)
                .attr("class", 'field-label')
        field_container.append("text")
                .text(entry[field])
                .attr("class", 'field-text')
    }
    
    d3.image(entry.imageUrl).then(
        (img) =>{
            console.log(img)
            const image = d3.select('.card-image').attr('src', img.src)

            const aspect_ratio = img.naturalWidth / img.naturalHeight;
            const img_width = img_height*aspect_ratio

            image.attr('width', img_width).attr('height', img_height)
            

            //text width stuff
            if(aspect_ratio>1.1){ //if width is too big  compared to the height
                card.style('flex-direction', 'column')
                text_width_constraint = img_width
            }else{
                card.style('flex-direction', 'row')
                text_width_constraint = 200
            }

            card.selectAll('.field-text').style('display','flex').style('max-width', text_width_constraint + "px")

            
       
     })

    //  card.on('mouseout', ()=>{
    //     d3.select("#card").style('display','none')
    //  })
}



function set_display_mode(mode){
    if(display_mode == mode){
        console.log('nochange')
        return
    }
    console.log('selecting mode', mode)
    display_mode = mode
    // let all_color_blocks = d3.selectAll('rect.color-block').style("opacity", 0)
    // console.log("STUFF", all_color_blocks)
    if(mode == 'colors' || mode == 'reveal'){
        d3.selectAll('rect.color-block').style("opacity", 1).attr('faded', "false")
      
    }else if(mode == 'images'){
        d3.selectAll('rect.color-block').style("opacity", 0).attr('faded', "true")
    }

}

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

function changeDate(dates, color_data){
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

}}









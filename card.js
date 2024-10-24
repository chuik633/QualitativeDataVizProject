
const max_dimension = 200
function show_card(entry, x,y){
    
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
            let img_height, img_width;
            const aspect_ratio = img.naturalWidth / img.naturalHeight;
            if(img.naturalWidth > img.naturalHeight){
                img_width = max_dimension
                img_height = img_width/aspect_ratio
            }else{
                img_height = max_dimension
                img_width = img_height*aspect_ratio
            }

            const image = d3.select('.card-image').attr('src', img.src)
            image.attr('width', img_width).attr('height', img_height)
            

            //text width stuff
            if(aspect_ratio>1.4){ //if width is too big  compared to the height
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

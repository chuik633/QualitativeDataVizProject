
    // place hat (id) at x,y coordinate     
    // hue	saturation	lightness	vibrant	muted	darkVibrant	darkMuted	lightVibrant          
    function place_image(entry, x,y){
        const url = entry.imageUrl
        // console.log("VIBRANT", entry.vibrant)
        d3.image(url).then(
            (img) =>{
                const aspect_ratio = img.naturalWidth / img.naturalHeight;
                // const img_width = xScale.bandwidth()
                const img_width = 50
                const img_height = img_width/aspect_ratio

                svg.append('rect')
                    .attr('id', "color"+String(entry.id)) 
                    .attr('class', String(entry.date))
                    .attr('fill', entry.vibrant)
                    // .attr('opacity', .5)
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', img_width) 
                    .attr('height', img_height)

                svg.append('image')
                    .attr('href', entry.imageUrl)
                    .attr('id', String(entry.id)) 
                    .attr('class', String(entry.date))
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', img_width) 
                    .attr('height', img_height)
                    .on('mouseover', ()=>{
                        d3.select("#"+String(entry.id))
                            .attr('opacity',.8)
    
                    })
                    .on('mouseout', ()=>{
                        d3.select("#"+String(entry.id))
                            .attr('opacity',1)
                    })
                    .on('mousedown', ()=>{
                        d3.select("#"+String(entry.id))
                            .attr('opacity',.1)
                    })
                    .on('click', () =>{
                        show_card(entry)
                        
                        d3.select("#card")
                            .attr('x',x)
                            .attr('y', y)
                            .style(`left`, x+"px")
                            .style(`top`, y+"px")
                    })  
            }
        ).catch((e)=>console.log("ERROR HERE", e, entry));

    }
    
   
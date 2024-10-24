const detection_threshold = 100;
const min_size = 40;
const max_size = 80;
function tooltip_help_me_code(x, y, text) {
  d3.select("#tooltip")
    .style("left", x + "px")
    .style("top", y + "px")
    .text(text);
}
function tooltip2_help_me_code(x, y, text) {
  d3.select("#tooltip2")
    .style("left", x + "px")
    .style("top", y + "px")
    .text(text);
}
function modify_nearby_blocks(svg, mouseX, mouseY, display_mode) {
  console.log(display_mode);
  svg.selectAll(".svg-image").each((img) => {
    //get the distance to the image
    const x_center = img.x + img.img_width / 2;
    const y_center = img.y + 100 + img.img_height / 2;

    const dx = x_center - mouseX;
    const dy = y_center - mouseY;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    // tooltip_help_me_code(mouseX, mouseY, distance)
    // tooltip2_help_me_code(x_center, y_center)

    //update images and color blocks
    if (display_mode != "colors") {
      update_size_d(img, img.entry.id, distance);
      svg.selectAll(`#color-${img.entry.id}`).each((block) => {
        update_size_d(block, `color-${img.entry.id}`, distance);
      });
    }

    update_color_d(
      svg.select(`#color-${img.entry.id}`),
      distance,
      display_mode
    );
  });
}

function update_size_d(block, id, distance) {
  if (distance < detection_threshold) {
    //compute the new size based on the distance
    const curr_size = block.img_width;
    const scaling_facor =
      (detection_threshold - distance) / detection_threshold;
    const new_size = Math.max(
      min_size,
      Math.min(max_size, curr_size + scaling_facor * (max_size - curr_size))
    );

    //updating the actual data
    block.img_width = new_size;
    block.img_height = new_size;

    //updating the image
    d3.select("#" + id)
      .transition()
      .duration(200)
      .attr("width", new_size)
      .attr("height", new_size)
      .attr("opacity", 1);
  } else {
    block.img_width = min_size;
    block.img_height = min_size;

    d3.select("#" + id)
      .transition()
      .duration(200)
      .attr("width", min_size)
      .attr("height", min_size);
  }
}

function update_color_d(block, distance, display_mode) {
  // console.log(block.attr("faded"))
  if (block.attr("faded") == "true" && display_mode != "color") {
    return;
  }
  if (distance < detection_threshold) {
    if (display_mode == "images" || display_mode == "reveal") {
      const opacity_delta = (1 - distance / width) * 0.08;
      const old_opacity = block.style("opacity");
      // console.log("block", old_opacity,"delta", opacity_delta)
      const opacity = Math.max(0, old_opacity - opacity_delta);
      if (opacity == 0) {
        block.attr("faded", "true");
      }
      block.style("opacity", opacity);
    } else {
      const opacity = distance / 100;
      block.style("opacity", opacity);
    }
  }
}

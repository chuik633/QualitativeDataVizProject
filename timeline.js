// ---------------------------------------------------------------------------------------------------------
//                                                 PLOTTING
// ---------------------------------------------------------------------------------------------------------

//adjust this all later
const padding = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

const width = window.innerWidth - 100;
const height = window.innerHeight - 100;
const innerHeight = height - padding.top - padding.bottom;
const innerWidth = width - padding.left - padding.right;

let display_mode = "reveal";

function setup_color_timelines_old(color_data, dates) {
  const all_x_vals = Object.values(color_data).flatMap((d_map) =>
    Object.values(d_map).map((d) => d.x)
  );
  const all_y_vals = Object.values(color_data).flatMap((d_map) =>
    Object.values(d_map).map((d) => d.y)
  );
  console.log("X", all_x_vals, all_y_vals);
  const xScale = d3
    .scaleLinear() //colorful <--> b/w (SATURATION)
    .domain([d3.min(all_x_vals), d3.max(all_x_vals)]) //TODO: can change the min max based on all the data
    .range([100, innerWidth - 50]);

  const yScale = d3
    .scaleLinear() //HUE
    .domain([d3.min(all_y_vals), d3.max(all_y_vals)])
    .range([100, innerHeight - 150]);

  for (const date of dates) {
    color_timeline(color_data, date, xScale, yScale);
  }
  d3.select(`#timeline-${String(dates[0])}`)
    .attr("class", "timeline-svg visible")
    .style("display", "inherit");
}

function setup_color_timelines(color_data, dates) {
  const all_x_vals = Object.values(color_data).flatMap((d_map) =>
    Object.values(d_map).map((d) => d.x)
  );
  const all_y_vals = Object.values(color_data).flatMap((d_map) =>
    Object.values(d_map).map((d) => d.y)
  );

  const all_buckets = Object.keys(color_data)

  const xScale = d3
    .scaleLinear() //colorful <--> b/w (SATURATION)
    .domain([d3.min(all_x_vals), d3.max(all_x_vals)]) //TODO: can change the min max based on all the data
    .range([100, innerWidth - 50]);

  const yScale = d3
    .scaleLinear() //HUE
    .domain([d3.min(all_y_vals), d3.max(all_y_vals)])
    .range([100, innerHeight - 150]);

  for (const date of all_buckets) {
    color_timeline(color_data, date, xScale, yScale);
  }
  d3.select(`#timeline-${String(dates[0])}`)
    .attr("class", "timeline-svg visible")
    .style("display", "inherit");
}

function color_timeline(color_data, date, xScale, yScale) {
  //just look at this date to display (can modify this if we want a date range)
  let data = color_data[date];
  console.log("DATA", data.length)
  let cap = 150;
  if (data.length > cap) {
    data = data.slice(0, cap);
  }

  // Define minimum and maximum image sizes
  const minSize = 20; // Adjust as needed
  const maxSize = 100; // Adjust as needed

  // Calculate image size based on the number of hats
  const maxHats = 80; // The number at which images are at minimum size
  let imageSize;
  if (data.length >= maxHats) {
    imageSize = minSize;
  } else {
    const sizeScale = d3
      .scaleLinear()
      .domain([1, maxHats])
      .range([maxSize, minSize]);
    imageSize = sizeScale(data.length);
  }
  //create the svg
  const container = d3
    .select("#timeline-container")
    .style("width", `${width}px`)
    .style("height", `${height}px`);
  // .style("background-color", `lightgray`)
  // container.selectAll("*").remove()

  const svg = container
    .append("svg")
    .attr("viewBox", [0, 0, innerWidth, innerHeight])
    .attr("transform", `translate(${padding.left}, ${padding.top})`)
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("id", `timeline-${getDateBucketIdStr(date)}`)
    .attr("class", `timeline-svg hidden`)
    .style("border", "none");
  //place in the axis
  // svg
  //   .append("g")
  //   .attr("transform", `translate(0, ${innerHeight / 2})`)
  //   .attr("class", "x-axis")
  //   .call(d3.axisBottom(xScale))
  //   .selectAll(".tick")
  //   .remove();
  //----------------------------------------------------------------------------------------
  //1. create force nodes using our data

  let nodes = data.map((entry) => {
    return {
      entry: entry,
      x: xScale(entry.x),
      y: yScale(entry.y),
      img_width: imageSize,
      img_height: imageSize,
      cluster: entry["K-means cluster"],
      vibrant: entry.vibrant,
      palete: [
        entry.vibrant,
        entry.muted,
        entry.darkVibrant,
        entry.darkMuted,
        entry.lightVibrant,
      ],
    };
  });

  function layoutImages() {
    svg
      .selectAll("image")
      .data(nodes)
      .join(
        (enter) =>
          enter
            .append("image")
            .attr("href", (d) => d.entry.imageUrl)
            .attr("id", (d) => String(d.entry.id))
            .attr("class", (d) => "img-"+String(d.entry.date) + " svg-image ")
            .attr("data-material", (d) => d.entry.material) // Add data attribute

            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("width", (d) => d.img_width)
            .attr("height", (d) => d.img_height)
            .on("mouseover", (event, d) => {
              // console.log(d)
              d3.select(`#${String(d.entry.id)}`).attr("opacity", 1);
            })
            .on("mouseout", (event, d) => {})
            .on("mousedown", (event, d) => {
              d3.select(`#${String(d.entry.id)}`).attr("opacity", 0.3);
            })
            .on("click", (event, d) => {
              show_card(d.entry, d.x, d.y);
            }),
        (update) =>
          update
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("width", (d) => d.img_width)
            .attr("height", (d) => d.img_height),
        (exit) => exit.remove()
      );
  }

  function layoutColors() {
    svg
      .selectAll("rect")
      .data(nodes)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("id", (d) => "color-" + String(d.entry.id))
            // .attr("class", (d) => String(d.entry.date) + " color-block")
            .attr("class", (d) => `color-block color-${d.entry.date}`)
            .attr("data-material", (d) => d.entry.material) // Add data attribute

            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .attr("faded", "false")
            .attr("fill", (d) => d.entry.vibrant)
            .attr("width", (d) => d.img_width)
            .attr("height", (d) => d.img_height)
            .on("click", (event, d) => {
              console.log("click");
              show_card(d.entry, d.x, d.y);
              d3.select("#card")
                .attr("x", d.x)
                .attr("y", d.y)
                .style("left", `${d.x}px`)
                .style("top", `${d.y}px`);
            }),
        (update) => update.attr("x", (d) => d.x).attr("y", (d) => d.y),
        // .attr('width', d => d.img_width),
        (exit) => exit.remove()
      );
  }

  //initial set up
  layoutImages();
  layoutColors();

  //force simulation
  let activeNodes = [];

  // only activate the simulation for the active nodes
  function updateSimulation() {
    if (activeNodes.length > 0) {
      const sim = d3
        .forceSimulation(activeNodes)
        .force("x", d3.forceX((d) => d.x).strength(0.01))
        .force("y", d3.forceY((d) => d.y).strength(0.01))
        .force(
          "collide",
          d3.forceCollide((d) => (d.img_width + 30) / 2)
        )
        .alphaDecay(0.005)
        .on("tick", () => {
          nodes.forEach((d) => {
            // console.log("TICK", d)
            let leftBound = d.img_width / 2;
            let rightBound = Math.min(innerWidth - d.img_width / 2, d.x);
            let topBound = d.img_height / 2 + 50;
            let bottomBound = Math.min(innerHeight - d.img_height / 2, d.y);
            d.x = Math.max(leftBound, rightBound);
            d.y = Math.max(topBound, bottomBound);
          });

          layoutImages();
          layoutColors();
        });
      sim.alpha(1).restart();
    }
  }

  //only move when near
  svg.on("mousemove", (event) => {
    let [mouseX, mouseY] = d3.pointer(event);
    // console.log("Y", mouseY, mouseY + window.screenY, event.screenY)
    mouseY += 100; //idk why it was off this is hardcoded its ok shh
    modify_nearby_blocks(svg, mouseX, mouseY, display_mode);
    activeNodes = nodes.filter((d) => {
      const dx = d.x - mouseX;
      const dy = d.y - mouseY;
      return Math.sqrt(dx ** 2 + dy ** 2) < 100;
    });
    updateSimulation();
  });

  //clear when not near
  svg.on("mouseout", () => {
    activeNodes = [];
  });
}

function set_display_mode(mode) {
  if (display_mode == mode) {
    console.log("nochange");
    return;
  }
  console.log("selecting mode", mode);
  display_mode = mode;

  if (mode == "colors" || mode == "reveal") {
    d3.selectAll("rect.color-block").style("opacity", 1).attr("faded", "false");
  } else if (mode == "images") {
    d3.selectAll("rect.color-block").style("opacity", 0).attr("faded", "true");
  }
}

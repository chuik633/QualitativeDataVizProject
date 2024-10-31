const max_dimension = 200;

// Collection Array
const collection = [];

// Reference to Modal Elements
const collectionModal = d3.select("#collection-modal");
const collectionGrid = d3.select("#collection-grid");
const closeModal = d3.select(".close-modal");
const collectionIcon = d3.select("#collection-icon");

// Function to Render Collection
function renderCollection() {
  // Clear the existing collection grid
  collectionGrid.selectAll("*").remove();

  // Bind data
  const cards = collectionGrid
    .selectAll(".collection-card")
    .data(collection, (d) => d.id); // Assuming each entry has a unique 'id'

  // Enter selection
  const cardsEnter = cards
    .enter()
    .append("div")
    .attr("class", "collection-card");

  // Append Image
  cardsEnter
    .append("img")
    .attr("src", (d) => d.imageUrl)
    .attr("alt", (d) => d.title);

  // Append Title
  cardsEnter
    .append("div")
    .attr("class", "card-title")
    .text((d) => d.title);

  // Append Fields (e.g., Notes)
  cardsEnter
    .append("div")
    .attr("class", "field-text")
    .text((d) => d.notes || "No notes");

  // Merge if needed
  cards.merge(cardsEnter);
}

// Function to Open Modal
function openModal() {
  collectionModal.style("display", "block");
}

// Function to Close Modal
function closeModalFunc() {
  collectionModal.style("display", "none");
}

// Event Listener for Close Button
closeModal.on("click", closeModalFunc);

// Event Listener for Clicking Outside the Modal Content
window.onclick = function (event) {
  if (event.target.id === "collection-modal") {
    closeModalFunc();
  }
};

// Event Listener for Collection Icon
collectionIcon.on("click", () => {
  renderCollection();
  openModal();
});

function show_card(entry, x, y) {
  const card = d3
    .select("#card")
    .attr("x", x)
    .attr("y", y)
    .style("left", `${x}px`)
    .style("top", `${y}px`);
  card.selectAll("*").remove(); // clear the card
  card.style("display", "flex");

  let text_width_constraint = 200;

  const img_container = card
    .append("div")
    .attr("class", "card-image-container");
  img_container
    .append("img")
    .attr("width", 100)
    .attr("height", 100)
    .attr("class", "card-image")
    .attr("style", "display:inherit");

  const color_fields = [
    "hue",
    "saturation",
    "lightness",
    "vibrant",
    "muted",
    "darkVibrant",
    "darkMuted",
    "lightVibrant",
  ];
  const colors_palette = img_container
    .append("div")
    .attr("class", "card-colors");
  for (const color_field of color_fields) {
    const color = entry[color_field];
    // console.log("color", color)
    if (String(color).includes("#")) {
      colors_palette
        .append("div")
        .attr("class", "card-color")
        .style("background", color);
    } else {
      console.log("color empty");
    }
  }

  const info_container = card.append("div").attr("class", "card-info");
  info_container.append("text").attr("class", "card-title").text(entry.title);

  const fields = ["date", "physicalDescription", "topic", "notes"];
  for (const field of fields) {
    const field_container = info_container
      .append("div")
      .attr("class", "field-container");
    field_container.append("text").text(field).attr("class", "field-label");

    field_container
      .append("text")
      .text(entry[field])
      .attr("class", "field-text");
  }

  d3.image(entry.imageUrl).then((img) => {
    let img_height, img_width;
    const aspect_ratio = img.naturalWidth / img.naturalHeight;
    if (img.naturalWidth > img.naturalHeight) {
      img_width = max_dimension;
      img_height = img_width / aspect_ratio;
    } else {
      img_height = max_dimension;
      img_width = img_height * aspect_ratio;
    }

    const image = d3.select(".card-image").attr("src", img.src);
    image.attr("width", img_width).attr("height", img_height);

    // Text width constraints based on aspect ratio
    if (aspect_ratio > 1.4) {
      // If width is too big compared to the height
      card.style("flex-direction", "column");
      text_width_constraint = img_width;
    } else {
      card.style("flex-direction", "row");
      text_width_constraint = 200;
    }

    card
      .selectAll(".field-text")
      .style("display", "flex")
      .style("max-width", text_width_constraint + "px");
  });

  // Add "Add to Collection" button
  const addButton  = info_container.insert("button", ":first-child")
    .attr("class", "add-collection-button") // Use the new class
    .attr("aria-label", `Add ${entry.title} to Collection`)
    .text("+").style('font-size', "20px")
    .on("click", () => {
      // Check if the entry is already in the collection
      if (!collection.some((item) => item.id === entry.id)) {
        collection.push(entry);
        console.log("Added to collection:", entry);
        // Optionally provide user feedback
        addButton.text("Added!");
        addButton.attr("disabled", true);
        setTimeout(() => {
          addButton.text("Add to Collection");
          addButton.attr("disabled", null);
        }, 2000);
      } else {
        console.log("Entry already in collection:", entry);
        // Optionally notify the user
        addButton.text("Already Added");
        setTimeout(() => {
          addButton.text("Add to Collection");
        }, 2000);i
      }
    })
    .on("mouseenter",()=>{
      if(d3.select(".add-collection-button").attr('disabled')!=true){
        // d3.select(".add-collection-button").text("+")
        d3.select(".add-collection-button").text("Add to Collection").style('font-size', "10px")
      }else{
        d3.select(".add-collection-button").text("Already Added").style('font-size', "10px")

      }
    })
    .on("mouseleave",()=>{
      if(d3.select(".add-collection-button").attr('disabled')!=true){
        d3.select(".add-collection-button").text("+").style('font-size', "20px")
      }else{
        d3.select(".add-collection-button").text("Already Added").style('font-size', "10px")
      }
      
    })


    ;

  // Optional: Adjust button positioning if necessary
  // You can add additional styles or classes as needed
}

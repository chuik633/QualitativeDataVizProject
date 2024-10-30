//---------------------------------------------------------------------------------------------------------
//                                          DATA LOADING + PROCESSING
//---------------------------------------------------------------------------------------------------------
const raw_data_url = "data/expanded_hats_Oct20_noCards_with_clusters.csv";
// const raw_data_url = "data/smaller.csv"
let raw_data = [];
let color_data;
let date_buckets = {
  "Pre 1860s": [1790, 1860],
  "Interwar Era": [1910, 1930],
  "Post World War": [1940, 1970],
  "Modern Era": [1980, 2010],
};

function getDateBucketIdStr(bucket_str){
 return bucket_str.split(' ').join('-');

}
function getDateBucket(date) {
  for (const [bucket, [start, end]] of Object.entries(date_buckets)) {
    if (start <= date && date <= end) {
      return bucket;
    }
  }
  const single_date_bucket = String(date) + "s"
  if(!(single_date_bucket in date_buckets)){
    date_buckets[single_date_bucket] = [date,date]
  }
  //no bucket then return the date
  return single_date_bucket;
}

d3.csv(raw_data_url).then((data) => {
  data.forEach((d) => {
    //parse the date
    let parsedDate = d.date.match(/\d+/g);
    if (parsedDate == null) {
      return;
    }
    parsedDate = parsedDate[0];
    d["date"] = parsedDate;
    d["date_bucket"] = getDateBucket(parsedDate);
    d["imageUrl"] = d["image"];
    d["x"] = parseFloat(d["x value"]);
    d["y"] = parseFloat(d["y value"]);

    raw_data.push(d);
  });

  const imageUrls = raw_data.map((d) => d.imageUrl);

  // function preloadImages(urls, callback) {
  //   let loadedCount = 0;
  //   const total = urls.length;

  //   urls.forEach((url) => {
  //     const img = new Image();
  //     img.src = url;
  //     img.onload = img.onerror = () => {
  //       loadedCount++;
  //       if (loadedCount === total) {
  //         callback();
  //       }
  //     };
  //   });
  // }

  console.log("RAW DATA:", raw_data);

  // Extract unique materials
  const materialsSet = new Set(raw_data.map((d) => d.material));
  const materials = Array.from(materialsSet).sort();

  // Proceed to set up the dropdown
  createMaterialDropdown(materials);

  //CREATE THE COLOR DATA
  color_data = d3.group(raw_data, (d) => d.date);
  const color_data_object = Object.fromEntries(
    Array.from(color_data, ([date, entries]) => [date, entries])
  );

  const date_bucket_data = d3.group(raw_data, (d) => d['date_bucket']);
  const date_bucket_data_obj = Object.fromEntries(
    Array.from(date_bucket_data, ([date, entries]) => [date, entries])
  );
  console.log("date bucket object", date_bucket_data_obj)
  console.log('date_buckets', date_buckets)

  //Display the date info:
  const datesSet = new Set(Object.values(raw_data).map((d) => d.date));
  const dates = [...datesSet].sort((a, b) => a - b);
  setUpDateSelector(dates);

  //set up the timeline
  setup_color_timelines(date_bucket_data_obj, dates);
  window.addEventListener("scroll", () => {
    changeDate(dates, date_bucket_data_obj);
  });
  // setup_color_timelines(color_data_object, dates);
  // window.addEventListener("scroll", () => {
  //   changeDate(dates, color_data_object);
  // });

  //select options
  const display_options = document.querySelectorAll(
    'input[name="display-options"]'
  );
  set_display_mode("colors");
  for (const display_option of display_options) {
    display_option.addEventListener("change", () => {
      const selected_option = display_option.value;
      console.log(selected_option);
      set_display_mode(selected_option);
    });
  }
});

function createMaterialDropdown(materials) {
  const dropdown = d3.select("#material-dropdown");

  // Add the 'clear' option
  dropdown
    .append("option")
    .attr("value", "All")
    .attr("disabled", null)
    .attr("selected", true)
    .style("opacity", 0.7) // Slightly less opacity
    .text("All");

  // Add material options
  materials.forEach((material) => {
    dropdown.append("option").attr("value", material).text(material);
  });
}
// After createMaterialDropdown(materials);
d3.select("#material-dropdown").on("change", function () {
  const selectedMaterial = this.value;
  filterImagesByMaterial(selectedMaterial);
});

function filterImagesByMaterial(selectedMaterial) {
  if (selectedMaterial === "All") {
    // Show all images
    d3.selectAll(".svg-image").style("display", "inline");
    d3.selectAll(".color-block").style("display", "inline");
  } else {
    d3.selectAll(".svg-image").style("display", function () {
      return this.getAttribute("data-material") === selectedMaterial
        ? "inline"
        : "none";
    });
    d3.selectAll(".color-block").style("display", function () {
      return this.getAttribute("data-material") === selectedMaterial
        ? "inline"
        : "none";
    });
  }
}

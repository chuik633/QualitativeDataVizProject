//---------------------------------------------------------------------------------------------------------
//                                          DATA LOADING + PROCESSING
//---------------------------------------------------------------------------------------------------------
const raw_data_url = "data/expanded_hats_Oct20_noCards_with_clusters.csv"
// const raw_data_url = "data/smaller.csv"
let raw_data = []
let color_data;
const date_buckets = {
    "Pre 1860s":[1790,1860],
    "Interwar Era": [1910,1930],
    "Post World War":[1940, 1970],
    "Modern Era":[1980, 2010]
}
function getDateBucket(date){
    for(const [bucket, [start,end]] of Object.entries(date_buckets)){
        if (start<=date && date < end){
            return bucket
        }
    }
    //no bucket then return the date
    return String(date)+"s"
}

    


d3.csv(raw_data_url).then(data => {
    data.forEach(d => {
        //parse the date
        let parsedDate = d.date.match(/\d+/g)
        if (parsedDate == null){
            return
        }
        parsedDate = parsedDate[0]
        d['date'] = parsedDate
        d['date_bucket'] = getDateBucket(parsedDate)
        d['imageUrl'] = d['image']
        d['x'] =  parseFloat(d['x value'])
        d['y'] =  parseFloat(d['y value'])

        raw_data.push(d);
    });
    

    console.log("RAW DATA:", raw_data);

    //CREATE THE COLOR DATA
    color_data = d3.group(raw_data, d => d.date);
    const color_data_object = Object.fromEntries(
        Array.from(color_data, ([date, entries]) => [date, entries])
    );

    //Display the date info:
    const datesSet = new Set(Object.values(raw_data).map(d=> d.date))
    const dates = [...datesSet].sort((a, b) => a - b)
    setUpDateSelector(dates)


    console.log("Color Data:", color_data);
    // console.log("Color Data Object:", color_data_object[1860]);
    // const test_entry = color_data_object[1860][18]
    // console.log(test_entry)
    // show_card(test_entry, 300,200)
    setup_color_timelines(color_data_object, dates)
    window.addEventListener('scroll', () => {
        changeDate(dates, color_data_object)});


    //select options
    const display_options = document.querySelectorAll('input[name="display-options"]');
    set_display_mode('reveal')
    for(const display_option of display_options){
        display_option.addEventListener('change', ()=>{
            const selected_option =display_option.value
            console.log(selected_option)
            set_display_mode(selected_option)
        })

    }

});



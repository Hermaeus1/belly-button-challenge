//url assigning
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Digesting JSON data
d3.json(url).then(function(data) {
  console.log(data);
});

//Initialize the dash
function init() {

    //Using D3 dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    //Grabbing samples to fill the dropdown
    d3.json(url).then((data) => {
        
        //Variable names
        let names = data.names;

        //Adding samples to dropdown
        names.forEach((id) => {

            //Log the id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        //Grabbing first one from list
        let A_sample = names[0];

        //Log the value of a sample
        console.log(A_sample);

        //Build plots with functions
        MetadataBuilder(A_sample);
        BarBuilder(A_sample);
        BubbleBuilder(A_sample);
    });
};

//To Make Metadata
function MetadataBuilder(sample) {

    d3.json(url).then((data) => {

        //Grab the metadata then filter
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);

        //Logging value
        console.log(value)

        //first index from the array
        let valueData = value[0];

        //Empty the metadata
        d3.select("#sample-metadata").html("");

        //Use Object.entries for key/value pairs
        Object.entries(valueData).forEach(([key,value]) => {

            // Log key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

//To Make Bars
function BarBuilder(sample) {

    d3.json(url).then((data) => {

        //Retrieve and filter data
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        //Grab first index from the array
        let valueData = value[0];

        //Grab otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //Logging
        console.log(otu_ids,otu_labels,sample_values);

        //Top Ten: #1 on top
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        //Graph options
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };


        //Calling Plotly
        Plotly.newPlot("bar", [trace])
    });
};

//To Make Bubbles
function BubbleBuilder(sample) {

    d3.json(url).then((data) => {
        
        //Grabbing data then filtering
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        //Grab the first one
        let valueData = value[0];

        //Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //Logging data
        console.log(otu_ids,otu_labels,sample_values);
        
        //Grapg options
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        //Plotly time
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

//Update Function
function optionChanged(value) { 

    //Log the new one
    console.log(value); 

    //Call all functions 
    MetadataBuilder(value);
    BarBuilder(value);
    BubbleBuilder(value);
};

// Call the initialize function
init();
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(obj => obj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var results = filteredSamples[0];
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = results.otu_ids;
    var labels = results.otu_labels;
    var values = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.map(obj => "OTU " + obj).slice(0,10).reverse();
    console.log(yticks);
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values,
      y: yticks,
      text: labels,
      orientation: "h",
      type: "bar"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    //console.log("hello");
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

// DELIVERABLE 2 Requirements

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
       marker: {
         size: [0, 20, 40, 60, 80, 100],
         color: values,
         colorscale: "Portland" 
       }
    };

    var bubbleCharts = [bubbleData];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      automargin: true,
      hovermode: "closest"
  };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleCharts, bubbleLayout, {responsive: true})


    // Deliverable 3
    //Crate a Guage Chart
    // Step 1, create a variable that filters the metadata array for an object in the array whose id property matches the ID number passed into buildCharts() function as the argument.
    var metadata = data.metadata;
    var filteredGauge = metadata.filter(object => object.id == sample);  
    // Step 2, create a variable that holds the first sample in the array created in Step 2.
    var gaugeResult = filteredGauge[0]
    //Step 3, create a variable that converts the washing frequency to a floating point number.
    var wfreqs = gaugeResult.wfreq;
    console.log(wfreqs)
    
    //Step 4, create the trace object for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqs,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null,10], dtick: "2"},

          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }]
        }
      }
    ];
    
    //Step 5, create the layout for the gauge chart making sure that it fits in the <div></div> tag for the gauge id.
    var gaugeLayout = { 
      autosize: true
      }

    //Step 6, use the Plotly.newPlot() function to plot the trace object and the layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
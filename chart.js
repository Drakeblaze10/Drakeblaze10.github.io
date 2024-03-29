function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
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
  console.log(newSample);
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

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = samplesArray.filter(sampleObj => {
      return sampleObj.id == sample
    });
    //  5. Create a variable that holds the first sample in the array.
    var firstResult = sampleNumber[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var firstOtu_id = firstResult.otu_ids;
    var firstOtu_labels = firstResult.otu_labels.slice(0,10).reverse();
    var firstSample_value = firstResult.sample_values.slice(0,10).reverse();
    var washTest = data.metadata.filter((obj) => obj.id == sample)[0];
    var washFreq = washTest.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = firstOtu_id.slice(0, 10).map(numericIds => {
      return 'OTU' + numericIds;
    }).reverse(); 

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: firstSample_value,
        y: yticks,
        text: firstOtu_labels,
        name: 'Demographic Info',
        type: 'bar',
        orientation: 'h'
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: 'Top 10 Bacteria Cultures Found'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: firstResult.otu_ids.reverse(),
        y: firstResult.sample_values.reverse(),
        text: firstResult.otu_labels,
        mode: 'markers',
        marker: {
          color: firstResult.otu_ids,
          size: firstResult.sample_values
        }
      }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
     {
      value: washFreq,
      title: {
        text: 'Belly Button Washing Frequency <br> Scrubs per week'
      },
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [null, 10]},
        steps: [
          {range: [0, 2], color: 'red'},
          {range: [2, 4], color: 'orange'},
          {range: [4, 6], color: 'yellow'},
          {range: [6, 8], color: 'greenYellow'},
          {range: [8, 10], color: 'green'}
        ],
      },
     },
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: 'Bacteria Cultures per Sample'
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });

}

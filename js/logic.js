// store API endpoint as queryUr
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// get request to the query URL/
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
      
  // create function to show color for earthquake
  function Changecolor (depth){
    if (depth>9)
    return "red"
    else if (depth>7)
    return "green"
    else if (depth>6)
    return" blue"
    else if (depth>5)
    return "pink"
    else if (depth>4)
    return "purple"
    else if (depth>3)
    return "orange"
    else if (depth>2)
    return "yellow"
    else
    return "grey"

  }
  // create the style
  function generateearthquakestyle(feature, layer) {
    console.log(feature)
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: generatecolor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 1
    };
  }
  // get the radius of the earthquake based on its magnitude
  function getRadius(magnitude) {
    if (magnitude == 0) {
      return 1;
    }
    return magnitude * 4;
  }

  function generatemarker(feature, latlong) {
    return L.circleMarker(latlong)
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: bindpopuptomarker,
    style: generateearthquakestyle,
    pointToLayer: generatemarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
});

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // create a baseMaps object
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // create an overlay object to hold our overlay
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });
  earthquakes.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map. 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //  create legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [10, 30, 50, 70, 90];
    var colors = ["#60397f", "#734498", "#864fb2", "#9a5acb", "#ad66e5"];

    //  loop throught the depth and generate a lable with c color 
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: "
        + colors[i]
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Add legend to the map.
  legend.addTo(myMap);
}

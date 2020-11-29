// Store our API endpoint inside queryUrl
var earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



// Perform a GET request to the query URL
d3.json(earthquakes_url, function(data) {
  // Once we get a response, send the data.features object to the createMap function
  createMap(data.features);
});


function createMap(earthquakeData) {

    // Loop through locations and markers elements
      EarthquakeMarkers = earthquakeData.map((feature) =>
                    //Yes, the geojson 'FORMAT' stores it in reverse, for some reason. (L.geojson parses it as [lat,lng] for you)
                     //lat                         //long  
        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
            radius: magCheck(feature.properties.mag),
            stroke: true,
            color: 'white',
            opacity: 1,
            weight: 0.5,
            fill: true,
            fillColor: magColor(feature.properties.mag),
            fillOpacity: 0.8   
        })
        .bindPopup("<h1> Magnitude : " + feature.properties.mag +
        "</h1><hr><h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
      )

      // Add the earthquakes layer to a marker cluster group.
      var earthquakes=L.layerGroup(EarthquakeMarkers)
    //    console.log(d3.extent(d3.values(earthquakeData,((d) => +d.properties.mag))));
       var mags = earthquakeData.map((d) => magCheck(+d.properties.mag));
       console.log(d3.extent(mags));
       console.log(mags);
    //    console.log(earthquakeData.properties.mag);


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken:  "pk.eyJ1IjoicGFtZWxhMTQiLCJhIjoiY2toZTNvNmE0MGw2bjJ0bzI2bDZueHVoNSJ9.gwlPwxzhBSxgCLelb0g_Lw"
  });

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

// Add a legend to the map
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap){
    var div = L.DomUtil.create("div","legend");
    div.innerHTML = [
        "<k class='maglt2'></k><span>0-2</span><br>",
        "<k class='maglt3'></k><span>2-3</span><br>",
        "<k class='maglt4'></k><span>3-4</span><br>",
        "<k class='maglt5'></k><span>4-5</span><br>",
        "<k class='maggt5'></k><span>5+</span><br>"
      ].join("");
    return div;
}

legend.addTo(myMap);


     function magColor(mag) {
      var color = "";
      if (mag <= 2) { color = "#FC4E2A"; }
      else if (mag <= 3) {color = "#CB2B3E"; }
      else if (mag <= 4) { color = "#2A81CB"; }
      else if (mag <= 5) {color = "#9C2BCB"; }
      else { color = "#FFD326"; }
    
    return color;
    
    };
// Function to determine if the magnitude is zero or less (See above discussion as it is possible to have
// negative magnitudes, which obviously can't be used for setting the circleMarker radius)
function magCheck(mag){
  if (mag <= 1){
      return 4
  }
  return mag * 4;
};
}
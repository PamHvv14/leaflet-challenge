// Store URL
var earthquakes =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakes, function(earthquakeData) {  
// Initialize & Create Two Separate LayerGroups: earthquakes & tectonicPlates
  var earthquake = new L.LayerGroup()
// Creating map object
  var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });
// Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
   maxZoom: 18,
   zoomOffset: -1,
   id: "mapbox/streets-v11",
   accessToken: "pk.eyJ1IjoicGFtZWxhMTQiLCJhIjoiY2toZTNvNmE0MGw2bjJ0bzI2bDZueHVoNSJ9.gwlPwxzhBSxgCLelb0g_Lw",
  }).addTo(myMap);
// Function to Determine Size of Marker Based on the Magnitude of the Earthquake
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
      return magnitude * 3;
    }
// Function to Determine Style of Marker Based on the Magnitude of the Earthquake
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
      };
     }
// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
  function chooseColor(magnitude) {
    switch (true) {
      case magnitude > 5:
          return "#581845";
      case magnitude > 4:
          return "#900C3F";
      case magnitude > 3:
          return "#C70039";
      case magnitude > 2:
          return "#FF5733";
      case magnitude > 1:
          return "#FFC300";
      default:
          return "#DAF7A6";
        }
      }
// Create a GeoJSON Layer
      L.geoJSON(earthquakeData, {
          pointToLayer: function(latlng) {
              return L.circleMarker(latlng);
          },
          style: styleInfo,

          onEachFeature: function(feature, layer) {
              layer.bindPopup("<h4>Location: " + feature.properties.place + 
              "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
              "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
          }
      // Add earthquakeData to earthquakes LayerGroups 
      }).addTo(earthquake);
      // Add earthquakes Layer to the Map
      earthquake.addTo(myMap);
      // Set Up Legend
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
          var div = L.DomUtil.create("div", "info legend"), 
          magnitudeLevels = [0, 1, 2, 3, 4, 5];
          div.innerHTML += "<h3>Magnitude</h3>"
          for (var i = 0; i < magnitudeLevels.length; i++) {
              div.innerHTML +=
                  '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                  magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
          }
          return div;
      };
      // Add Legend to the Map
      legend.addTo(myMap);
  });
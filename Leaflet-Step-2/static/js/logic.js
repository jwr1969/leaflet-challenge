


// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'


// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map


function Satellite()    {
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        minZoom: 2.5,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });
    return satellite
}

function Light()    {
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        minZoom: 2.5,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    return light
}

function Dark() {
    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        minZoom: 2.5,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
        });
    return dark
}


function geojsonMarkerOptions(feature, colorLinearScale)  {
    var depth = feature.geometry.coordinates[2];
    var geojsonMarkerOptions = {
        radius: feature.properties.mag**2,
        fillColor: getColor(feature),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };
    return geojsonMarkerOptions
}


function getColor(feature) {
    var d = Math.abs(feature.geometry.coordinates[2]);
    return d > 128  ? '#800026' :
           d > 64   ? '#BD0026' :
           d > 32   ? '#E31A1C' :
           d > 16   ? '#FC4E2A' :
           d > 8    ? '#FD8D3C' :
           d > 4    ? '#FEB24C' :
           d > 2    ? '#FED976' :
                      '#FFEDA0';
}


// =================================

var dataPath = "static/data/PB2002_steps.json";

// function CreateEarthQuakeFeatures(url)   {
d3.json(dataPath).then(function(data)    {

    plates = L.geoJson(data, {
    
        style: function(feature) {
            return {
            color: "white",
            weight: 1.0
            };
        }
    })


    CreateMap(plates);

});


//}
   
    

function Legend()   {
// Set up the legend
var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [128,64, 32, 16, 8, 4, 2, 0];
        var colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
        var labels = [];
    
    // Add min & max
        var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + `${limits[0]} miles` + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
        };
    
    return legend
}   



function CreateMap(plates) {

    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    
    d3.json(url).then(function(data)    {
        
        geojson = L.geoJSON(data, {
    
            pointToLayer: function (feature) {
            
                const latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                // console.log(depth)
                return L.circleMarker(latlng, geojsonMarkerOptions(feature));
            },
            
            onEachFeature: function(feature, layer) {
                var depth = feature.geometry.coordinates[2];
                layer.bindPopup("Location: " + feature.properties.place + "<hr>Magnitude: " + feature.properties.mag + "<br>Depth: " + Math.abs(depth) + " miles");
            }
        })
        
    
        
        
        

        var overlayMaps = {
            Earthquakes: geojson,
            Tectonic_Plates: plates
        };

        satellite = Satellite();
        dark = Dark();
        light = Light();

        var baseMaps = {
            "Satellite": satellite,
            "Light": light,
            "Dark": dark
        };

        var myMap = L.map("map", {
            center: [45.52, -122.67],
            zoom: 3,
            layers: [satellite, geojson]
        });

        legend = Legend()
        legend.addTo(myMap)

        L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    
        
    });
}


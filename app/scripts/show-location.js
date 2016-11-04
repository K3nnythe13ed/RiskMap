$(function addMarkerLayer() {
test();
})


var checkLayerIsActive = false;
 var markerLayer = L.layerGroup();
    function test(){

var datalocations = L.geoJson(demoLocations,{
    onEachFeature:onEachFeature
})
map.addLayer(markerLayer);



function onEachFeature(feature, layer) {
    var WhS = L.icon({
    iconUrl: 'images/warehousemarker.png',
    iconSize:     [38, 38], // size of the icon
    iconAnchor:   [19,38], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -26] // point from which the popup should open relative to the iconAnchor
});
var WhM = L.icon({
    iconUrl: 'images/warehousemarker.png',
    iconSize:     [58, 58],
    iconAnchor:   [29, 58],
    popupAnchor:  [-3, -26]
});
var WhB = L.icon({
    iconUrl: 'images/warehousemarker.png',
    iconSize:     [78, 78],
    iconAnchor:   [39, 78],
    popupAnchor:  [-3, -26]
});   
    var WhSS = L.icon({
    iconUrl: 'images/warehousemarker.png',
    iconSize:     [18, 18], // size of the icon
    iconAnchor:   [9, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -26] // point from which the popup should open relative to the iconAnchor
    });
    var lat = feature.geometry.coordinates[0];
    var lon = feature.geometry.coordinates[1];
    var popupContent;
    
    if(feature.properties.Exp_TIV >= 10000000)
           {
            var mark = L.marker([lat, lon], {icon: WhB});
            markerLayer.addLayer(mark);
           }
           else{
               if(feature.properties.Exp_TIV >= 5000000)
           {
            var mark = L.marker([lat, lon], {icon: WhM})
            markerLayer.addLayer(mark);
           }
           else{
               if(feature.properties.Exp_TIV >= 1000000)
           {
            var mark = L.marker([lat, lon], {icon: WhS})
            markerLayer.addLayer(mark);
           }
           else{
                var mark = L.marker([lat, lon], {icon: WhSS})
                markerLayer.addLayer(mark);
           }
           }
           }
           
    }


map.on('zoomend', function() {

    if(map.getZoom()<5 && !(checkLayerIsActive))
    {
        if (typeof (markerLayer) != "undefined") {
          
         map.removeLayer(markerLayer);

    }
     }
    else
    {
           map.addLayer(markerLayer);
       
    }

   
});

    }
    function handleLocationLayer(checkbox){
    checkLayerIsActive = document.getElementById("CheckWarehouse").checked;
        if(map.getZoom()<5 && !(checkLayerIsActive))
    {
        if (typeof (markerLayer) != "undefined") {
          
         map.removeLayer(markerLayer);

    }
     }
    else
    {
           map.addLayer(markerLayer);
       
    }

}


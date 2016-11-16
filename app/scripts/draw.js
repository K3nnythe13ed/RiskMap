

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        
    },
    draw:
    {
    polyline: false,
    polygon: false,
    marker: false,
    circle: false
    }
});
map.addControl(drawControl);



map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
        

        countVessels(replaceTableValue, layer.getLatLngs())
        


    // Do whatever else you need to. (save to db, add to map etc)
    map.addLayer(layer);
});
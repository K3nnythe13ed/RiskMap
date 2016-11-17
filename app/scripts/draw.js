

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
var layer;
var options = {
    edit: {
        featureGroup: editableLayers //REQUIRED!!
    },
    draw:
    {
        polyline: false,
        polygon: false,
        marker: false,
        circle: false
    }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.DRAWSTART, function (e) {

    editableLayers.clearLayers();

})
map.on(L.Draw.Event.CREATED, function (e) {

    console.log(e)
    var type = e.layerType,
        layer = e.layer;
    //on create do elasticsearch function countVessels input(function replaceTableValue as callback, layer latlongs)
    countVessels(replaceTableValue, getAllVessels, layer.getLatLngs())

    editableLayers.addLayer(layer);

    // Do whatever else you need to. (save to db, add to map etc)
});

map.on(L.Draw.Event.DELETESTART, function (e) {
    editableLayers.clearLayers();
    var latlong = undefined
    countVessels(replaceTableValue, getAllVessels, latlong)
});

map.on(L.Draw.Event.EDITED, function (e) {
    console.log(e);
    i=0;
    while(e.layers._layers[i] === undefined)
    {
        i++;
    }
    layer = e.layers._layers[i]._latlngs;
        countVessels(replaceTableValue, getAllVessels, layer)


});
// Initialise the draw control and pass it the FeatureGroup of editable layers

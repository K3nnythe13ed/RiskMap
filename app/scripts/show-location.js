$(function addMarkerLayer() {
    test();
})


var checkLayerIsActive = false;
var markerLayer = L.layerGroup();
function test() {

    var datalocations = L.geoJson(demoLocations, {
        onEachFeature: onEachFeature
    })
    map.addLayer(markerLayer);



    function onEachFeature(feature, layer) {
        var WhS = L.icon({
            iconUrl: 'images/warehousemarker.png',
            iconSize: [38, 38], // size of the icon
            iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
        });
        var WhM = L.icon({
            iconUrl: 'images/warehousemarker.png',
            iconSize: [58, 58],
            iconAnchor: [29, 58],
            popupAnchor: [0, -50]
        });
        var WhB = L.icon({
            iconUrl: 'images/warehousemarker.png',
            iconSize: [78, 78],
            iconAnchor: [39, 78],
            popupAnchor: [0, -50]
        });
        var WhSS = L.icon({
            iconUrl: 'images/warehousemarker.png',
            iconSize: [18, 18], // size of the icon
            iconAnchor: [9, 18], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
        });
        var lat = feature.geometry.coordinates[0];
        var lon = feature.geometry.coordinates[1];
        var popupContent;
        var mark;
        if (feature.properties.Exp_TIV >= 10000000) {
            mark = L.marker([lat, lon], { icon: WhB });

        }
        else {
            if (feature.properties.Exp_TIV >= 5000000) {
                mark = L.marker([lat, lon], { icon: WhM })

            }
            else {
                if (feature.properties.Exp_TIV >= 1000000) {
                    mark = L.marker([lat, lon], { icon: WhS })

                }
                else {
                    mark = L.marker([lat, lon], { icon: WhSS })

                }
            }
        }

        function formatThousand(nStr) {
            var sep = '.';
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + sep + '$2');
            }
            return x1 + x2;
        }


        mark.bindPopup
        (
            "<b>Location Name: </b>" + feature.properties.AccountName + "</br>" +
            "<b>Location ID: </b>"+ feature.properties.LocID + "</br>"+
            "<b>Lat: </b>" + lat + "<b> Lon: </b>" + lon + " </br>" +
            "<b>Nathan Risk Score: </b>" + feature.properties.MR_RISK_SCORE +"</br>"+
            "<b>Expected Exposure: </b>"+formatThousand(feature.properties.Exp_TIV)
        )
        markerLayer.addLayer(mark);

    }


    map.on('zoomend', function () {
        if (map.getZoom() <= 5 && !(checkLayerIsActive)) {
            if (typeof (markerLayer) != "undefined") {

                map.removeLayer(markerLayer);

            }
        }
        else {
            map.addLayer(markerLayer);

        }


    });

}
function handleLocationLayer(checkbox) {
    checkLayerIsActive = document.getElementById("CheckWarehouse").checked;
    if (map.getZoom() < 5 && !(checkLayerIsActive)) {
        if (typeof (markerLayer) != "undefined") {

            map.removeLayer(markerLayer);

        }
    }
    else {
        map.addLayer(markerLayer);

    }

}


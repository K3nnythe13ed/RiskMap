var latlngs = [];
function addmarker(mmsi) {
    var bigship = L.icon({
        iconUrl: '../images/marker.png',

        iconSize: [10, 26], // size of the icon

        iconAnchor: [5, 26], // point of the icon which will correspond to marker's location

        popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
    });
        var smallship = L.icon({
        iconUrl: '../images/marker.png',

        iconSize: [4, 13], // size of the icon

        iconAnchor: [2, 26], // point of the icon which will correspond to marker's location

        popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
    });
    realtime = L.realtime({

        url: 'https://wanderdrone.appspot.com/',
        crossOrigin: true,
        type: 'json'
    }, {
            interval: 10 * 1000,
            pointToLayer: function (feature, latlng) {

                marker = L.marker(latlng, { icon: bigship });
                //  marker.bindPopup('mmsi: '+ mmsi);
                return marker;
            }
        }).addTo(map);
        
        
     

    realtime.on('update', function (e) {
        var coordPart = function (v, dirs) {
       


            return dirs.charAt(v >= 0 ? 0 : 1) +
                (Math.round(Math.abs(v) * 100) / 100).toString();

        },
            popupContent = function (fId) {
                var feature = e.features[fId],
                    c = feature.geometry.coordinates;
              var pointA = new L.LatLng(c[1], c[0]);

               latlngs.push(pointA);
               
                if (latlngs.length > 1) {
                    var polyline = L.polyline(latlngs, {
                        color: 'blue',
                        weight: 1,
                        opacity: 0.2,
                        smoothFactor: 1
                    }).addTo(map);
                }
                return 'Ship:<br /> MMSI: ' + mmsi + '<br /> at Location <br />' +
                    coordPart(c[1], 'NS') + ', ' + coordPart(c[0], 'EW');
            },
            bindFeaturePopup = function (fId) {
                realtime.getLayer(fId).bindPopup(popupContent(fId));
            },
            updateFeaturePopup = function (fId) {
                realtime.getLayer(fId).getPopup().setContent(popupContent(fId));
            };



        Object.keys(e.enter).forEach(bindFeaturePopup);
        Object.keys(e.update).forEach(updateFeaturePopup);
    });
}

var allTitles = [];

function getAllVessels() {
    const documents = [];
    client.search({
        index: 'ais-2016.11.09',
        type: 'vessel',
        size: 5
    }, function (err, resp, _respcode) {


        for (let i = 0; i < resp.hits.hits.length; i++) {

            documents[documents.length] = {

                _index: resp.hits.hits[i]._index,
                _type: resp.hits.hits[i]._type,
                _id: resp.hits.hits[i]._id,
                MMSI: resp.hits.hits[i]._source.MMSI,
                LOCATION: resp.hits.hits[i]._source.LOCATION

            };
            allTitles.push(documents)
        }

    });

}
function countVessels(callback, latlong) {

var topleftlat = latlong[0].lat;
var topleftlon = latlong[0].lng;
var bottomrightlat = latlong[2].lat;
var bottomrightlon = latlong[2].lng;
console.log(topleftlon)
console.log(bottomrightlat)
    client.count({
        index: 'ais-*',
        type: 'vessel',
        body: {

            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": "*",
                                "analyze_wildcard": true
                            }
                        },
                        {
                            "query_string": {
                                "analyze_wildcard": true,
                                "query": "*"
                            }
                        },
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": 1451602800000,
                                    "lte": 1483225199999,
                                    "format": "epoch_millis"
                                }
                            }
                        },
                        {
                                "geo_bounding_box": {
                                    "LOCATION": {
                                        "top_left": {
                                            "lat": 52.00889351616824,
                                            "lon": 4.073730460368097
                                        },
                                        "bottom_right": {
                                            "lat": 51.95137521430851,
                                            "lon": 4.178100577555597
                                        }
                                    }
                                }
                            
                        },
                    ],
                    "must_not": []
                }
            }
        }

    }, function (err, response) {
        callback(response.count)
    });
}
$(function () {
    countVessels(VesselTableCounter)

})
function VesselTableCounter(response) {

    var kibanatable = document.getElementById("vesselcount");

    var tbdy = document.createElement('tbody');

    var tr = document.createElement('tr');
    var tdp = document.createElement('td');
    var tdc = document.createElement('td');
    tdp.appendChild(document.createTextNode('Vessels counted:'));
    tdc.appendChild(document.createTextNode(response));
    tr.appendChild(tdp);
    tr.appendChild(tdc);
    tbdy.appendChild(tr);
    kibanatable.appendChild(tbdy);
}
function replaceTableValue(response) {

    var kibanatable = document.getElementById("vesselcount");
    kibanatable.rows[0].cells[1].innerHTML = response;

}
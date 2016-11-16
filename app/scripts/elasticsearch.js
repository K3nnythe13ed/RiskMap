var allTitles = [];
//get all Vessels in elasticsearch for later use
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

//elasticsearch counting all vessels in latlong area. If not set latlong = max lat, max lon

function countVessels(callback, latlong) {

        var topleftlat = 89.00;
        var topleftlon = -180.00;
        var bottomrightlat = -90.00;
        var bottomrightlon = 180.00;
    if (typeof latlong != "undefined") {


         topleftlat = latlong[1].lat;
         topleftlon = latlong[1].lng;
         bottomrightlat = latlong[3].lat;
         bottomrightlon = latlong[3].lng;
    }



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
                                        "lat": topleftlat,
                                        "lon": topleftlon
                                    },
                                    "bottom_right": {
                                        "lat": bottomrightlat,
                                        "lon": bottomrightlon
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
        //do callback function after finishing countVessels 
        callback(response.count)
    });
}
$(function () {
    //on start count all vessels
    var latlong = undefined
    countVessels(VesselTableCounter, latlong)

})
//create table content for html index 
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
// replace value of table on new draw
function replaceTableValue(response) {

    var kibanatable = document.getElementById("vesselcount");
    kibanatable.rows[0].cells[1].innerHTML = response;

}
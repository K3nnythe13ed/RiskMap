$(function () {
    searchAllforView(createVesselforCollection, createPlayback)
})
shipCollection = [];
function createVesselforCollection(resp) {
    for (var i = 0; i < resp.hits.total; i++) {
        var ship = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        resp.hits.hits[i]._source.LOCATION.lon,
                        resp.hits.hits[i]._source.LOCATION.lat
                    ],

                ]
            },
            "properties": {
                "MMSI": resp.hits.hits[i]._source.MMSI,
                "time": [
                    Date.parse(resp.hits.hits[i]._source["@timestamp"]) ,
                ]
            }
        };
        shipCollection.push(ship);
    }

}

function searchAllforView(callback, playback) {
    client.search({
        index: 'ais-*',
        type: 'vessel',
        size: 10000,
        body: {

            "query": {
                
                
                "bool": {
                    "must": [
                        {
                            "term" : { "TYPE" : "70"
                         }
                        },
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
                        }
                    ],
                    "must_not": []
                }
            }
        }

    }, function (err, response, _respcode) {

        callback(response)
        playback();
    });
}

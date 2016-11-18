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
                    Date.parse(resp.hits.hits[i]._source["@timestamp"]),
                ],
                "IMO": resp.hits.hits[i]._source.IMO,
                "NAME": resp.hits.hits[i]._source.NAME,
                "DEST": resp.hits.hits[i]._source.DEST,
                "DRAUGHT": resp.hits.hits[i]._source.DRAUGHT,
                "SOG": resp.hits.hits[i]._source.SOG,
                "ETA": resp.hits.hits[i]._source.ETA

            }
        };
        shipCollection.push(ship);
    }

}

function searchAllforView(callback, playback) {
    var today = new Date();
    var todayToEpoch = today.getTime();
    var priorDate = new Date().setDate(today.getDate()-30)
    
    client.search({
        index: 'ais-*',
        type: 'vessel',
        size: 10000,
        body: {

            "query": {
                "bool": {
                    "must": [
                        {
                            "terms": { "TYPE": ["70", "71", "72", "73", "74", "75", "76", "77", "78", "89", "80", "81", "82", "83", "84", "85", "86", "88", "88", "89", "90"] }
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
                                    "gte": priorDate,
                                    "lte": todayToEpoch,
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

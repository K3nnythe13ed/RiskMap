var allTitles = [];
//get all Vessels in elasticsearch for later use
    var dt;
   
function getAllVessels(resp) {
    if(dt != undefined)
    {
        dt.clear();
    }
   var data1 =[]
    
        for (let i = 0; i < resp.hits.hits.length; i++) {
            
        var pushdata = {
           
            field1: resp.hits.hits[i]._source.MMSI, field2: resp.hits.hits[i]._source.LOCATION.lat, field3: resp.hits.hits[i]._source.LOCATION.lon, field4:i+1
        }
           
            data1.push(pushdata);
        }
        dt = dynamicTable.config('vesselsearch', 
                                 ['field4','field1', 'field2', 'field3'], 
                                 ['Nr.', 'MMSI', 'LAT', 'LON'], //set to null for field names instead of custom header names
                                 'There are no items to list...');
        
    
    
    

    dt.load(data1);

    


}

    

function callTable()
{

}

//elasticsearch counting all vessels in latlong area. If not set latlong = max lat, max lon

function countVessels(callback, callback2, latlong) {

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



    client.search({
        index: 'ais-*',
        type: 'vessel',
        size: 10000,
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

    }, function (err, response, _respcode) {
        //do callback function after finishing countVessels 
        
        if(err != undefined)
        {
            alert("Elasticsearch hasn't been started or is not ready yet")
        }
        callback(response.hits.total)
        callback2(response)
    });
}
$(function () {
     
    //on start count all vessels
    var latlong = undefined
    countVessels(VesselTableCounter, getAllVessels, latlong)

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
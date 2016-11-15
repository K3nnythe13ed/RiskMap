var allTitles = [];

function getAllVessels()
{
            client.search({
                index: 'ais-2016.11.09' ,
                type: 'vessel',
                size: 5
            }, function(err, resp, _respcode) {
               
                const documents = [];
                for (let i = 0; i < resp.hits.hits.length; i++) {
                    
                    documents[documents.length] = {
                        _index: resp.hits.hits[i]._index,
                        _type: resp.hits.hits[i]._type,
                        _id: resp.hits.hits[i]._id,
                        MMSI: resp.hits.hits[i]._source.MMSI,
                        LOCATION: resp.hits.hits[i]._source.LOCATION
                        
                    };
                    console.log(documents)
                }
            });
        
}
$(function(){
   var doc = getAllVessels()
})

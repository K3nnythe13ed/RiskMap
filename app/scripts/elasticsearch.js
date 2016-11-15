var allTitles = [];

// first we do a search, and specify a scroll timeout
client.search({
  index: 'ais-2016.11.09',
  type: 'vessel',
  // Set to 30 seconds because we are calling right back
  scroll: '30s',
  storedFields: ['MMSI'],
  q: 'MMSI:244630536'
}, function getMoreUntilDone(error, response) {
  // collect the title from each response
  response.hits.hits.forEach(function (hit) {
    allTitles.push(hit.storedFields);
  });

  if (response.hits.total !== allTitles.length) {
    // now we can call scroll over and over
    client.scroll({
      scrollId: response._scroll_id,
      scroll: '30s'
    }, getMoreUntilDone);
  } else {
    console.log('every "test" title', allTitles);
  }
});
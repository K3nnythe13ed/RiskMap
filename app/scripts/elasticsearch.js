var allTitles = [];

// first we do a search, and specify a scroll timeout
client.search({
  index: 'ais-2016.11.09',
  type: 'vessel',
  size: '50'
}, function (error, response) {
  // ...
});
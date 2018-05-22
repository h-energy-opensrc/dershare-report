var elasticsearch = require('elasticsearch');
var client_plug = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

export const client = client_plug
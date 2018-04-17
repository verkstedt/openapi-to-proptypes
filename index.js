const request = require('request');
const schemaParser = require('./src/schemaParser');

const force = process.argv.indexOf('-f') !== -1
const multipleFiles = process.argv.indexOf('-multipleFiles') !== -1
const isSwagger = process.argv.indexOf('-swagger') !== -1

const url = process.argv[2]
const path = process.argv[3]

request(url, (err, response, body) => {
  if(err) {
    console.log('ERROR', err)
    process.exit(1)
  }

  if(response.statusCode === 200) {
    const apiJson = JSON.parse(body);
    let schemas
    if(isSwagger) {
      schemas = apiJson.models
    } else {
      schemas = apiJson.components.schemas
    }

    schemaParser.parse(schemas, url, new Date().toISOString(), path, force, multipleFiles)
  } else {
    console.log('INVALID STATUS CODE', response.statusCode)
    process.exit(1)
  }
})
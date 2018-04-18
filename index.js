const request = require('request');
const schemaParser = require('./src/schemaParser');

const force = process.argv.indexOf('-f') !== -1
const multipleFiles = process.argv.indexOf('-multipleFiles') !== -1
const version = process.argv.indexOf('-v2') === -1 ? 3 : 2

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
    if(version === 2) {
      if(apiJson.definitions) {
        schemas = apiJson.definitions
      } else {
        console.log('Specification error: "definitions" is missing (maybe the url provides openapi v3)')
        process.exit(1)
      }
    } else {
      if(apiJson.components && apiJson.components.schemas) {
        schemas = apiJson.components.schemas
      } else {
        console.log('Specification error: "components.schemas" is missing (maybe the url provides openapi v2)')
        process.exit(1)
      }
    }

    schemaParser.parse(schemas, url, new Date().toISOString(), path, force, multipleFiles)
  } else {
    console.log('INVALID STATUS CODE', response.statusCode)
    process.exit(1)
  }
})
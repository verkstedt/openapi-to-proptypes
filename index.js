#!/usr/bin/env node
const request = require('request')
const schemaParser = require('./src/schemaParser')

const argv = require('minimist')(process.argv.slice(2))

if(argv._.length !== 2) {
  console.error("Wrong number of arguments")
  process.exit(1)
}

/* FLAGS
 * -f                         force, do not exit on not-found objectTypes
 * -m                         multiple files
 * -i                         create index export file
 * -h                         include header
 * --require [true|false]`    forces/prevents `.isRequired` on all propTypes
 * -v 2                       use swagger version 2
 */

const options = {
  force: argv.f || false,
  version: argv.v ? argv.v : 3,
  multipleFiles: argv.m,
  createIndex: argv.i || false,
  includeHeader: argv.h || false,
}

if(argv.require && (argv.require === 'true' || argv.require === 'false')) {
  options.forceRequire = (argv.require === 'true')
}

const src = argv._[0]
const target = argv._[1]

const getSchemas = response => {
  if(options.version === 2) {
    if(response.definitions) {
      return schemas = response.definitions
    } else {
      const err = new Error('Specification error: "definitions" is missing (maybe the url provides openapi v3)')
      throw err
    }
  } else {
    if(response.components && response.components.schemas) {
      return response.components.schemas
    } else {
      const err = new Error('Specification error: "components.schemas" is missing (maybe the url provides openapi v2)')
      throw err
    }
  }
}

request(src, (err, response, body) => {
  if(err) {
    throw new Error(err)
  }

  if(response.statusCode === 200) {
    const schemas = getSchemas(JSON.parse(body))

    schemaParser.parse(schemas, src, target, options)
  } else {
    console.error(`url can't be reached: status code ${response.statusCode}`)
    process.exit(1)
  }
})
### openapi-to-propTypes

converts openapi (3.0) or swagger (2.3) endpoint to react propTypes file(s).

### installlation

`npm install -g openapi-to-propypes` (`yarn add -g openapi-to-propypes`) for global usage

or

`npm install openapi-to-propypes` (`yarn add openapi-to-propypes`) localy in your project

### usage

`openapi-to-propTypes <url> <path>`

`<url>` url of the openapi or swagger endpoint

`<path>` path were the files should be created (must exist)

#### flags

`-v2` expect `<url>` to return openapi version 2.0 instead of 3.0

`-multipleFiles` will create a sepearte file for each definied model instead of a single one

`-f` will not exit on 'unpresent' but 'referenced' propType models
Normally this tool will exit when it finds a referenced propType (via $ref) which is not definied in the parsed file.
With this flag set it will continue even on not defined references.
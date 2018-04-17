### openapi-to-propTypes

converts an openapi (3.0) or swagger (2.3) endpoint to react propTypes file(s).

#### usage

`node index.js <url> <path>`

(or via bin)
`openapi-to-propTypes <url> <path>`

`<url>` url of the openapi or swagger endpoint

`<path>` path were the files should be created

#####flags

`-swagger` the `<url>` to parse has a swagger file structure
(instead of the complete openapi structure)

`-multipleFiles` will create a sepearte file for each definied model instead of a single one

`-f` will not exit on 'unpresent' but 'referenced' propType models
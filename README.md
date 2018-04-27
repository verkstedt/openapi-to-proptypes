### openapi-to-propTypes

converts openapi (3.0) or swagger (2.3) endpoint to react propTypes file(s).

### installlation

`npm install -g openapi-to-propypes` (`yarn add -g openapi-to-propypes`) for global usage

or

`npm install openapi-to-propypes` (`yarn add openapi-to-propypes`) localy in your project

### usage

`openapi-to-propTypes <src> <target>`

`<src>` url of the openapi or swagger endpoint

`<target>` target path were the files should be created

#### flags

`-f`           force, do not throw error on not-found $ref objectTypes

`-m`           multiple files

`-i`           create index export file

`-h`           include header

`--require`    forces require on all propTypes

`-v 2`         use swagger version 2


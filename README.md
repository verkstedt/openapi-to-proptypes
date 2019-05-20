### openapi-to-propTypes

converts openapi (3.0) or swagger (2.3) endpoint to react propTypes file(s).

### installlation

`npm install -g openapi-to-proptypes` (`yarn add -g openapi-to-proptypes`) for global usage

or

`npm install openapi-to-proptypes` (`yarn add openapi-to-proptypes`) localy in your project

### usage

`openapi-to-propTypes <src> <target>`

`<src>` url of the openapi or swagger endpoint

`<target>` target path were the files should be created

#### flags

`-f`                        force, do not throw error on not-found $ref objectTypes

`-m`                        multiple files

`-i`                        create index export file

`-h`                        include header

`--require [true|false]`    forces/prevents `.isRequired` on all propTypes

`-v 2`                      use swagger version 2

### development

test the script (manually):

`$ node index.js https://gist.githubusercontent.com/jacksbox/2e82e0e03c1a8112f6b135fbe5bdd780/raw/838ed3a55e9ee168589eda71d83dba3d163d84e8/openapi.v3 <target> [...options]`

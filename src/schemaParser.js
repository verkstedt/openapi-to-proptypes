const fs = require('fs')

let SCHEMAS = {}
let PATH = ''
let URL = ''
let DATETIME = ''
let MULTIPLE_FILES = false
let FORCE = false

const parse = (schemas, url, datetime, path, force, multipleFiles) => {
  SCHEMAS = schemas
  PATH = path ? `${path}/` : ''
  URL = url
  DATETIME = datetime
  MULTIPLE_FILES = multipleFiles
  FORCE = force

  if(MULTIPLE_FILES) {
    createFiles()
  } else {
    createFile()
  }
}

const requiredFileImports = []
const requiredPropTypeImports = []

const createFile = () => {
  const fileName = 'propTypes'
  const headerCommentString = getHeaderComment(fileName)
  let propTypeObjectString = ''
  schemaNames = Object.keys(SCHEMAS)
  // using for instead of forEach because of code format
  for(let i = schemaNames.length - 1; i >= 0; i--) {
    propTypeObjectString += getPropTypeObject(schemaNames[i], SCHEMAS[schemaNames[i]])

    // just formating
    if(i === 0) {
      propTypeObjectString += "\r\n"
      continue
    }
    propTypeObjectString += "\r\n\r\n"
  }
  const importsString = getImports()

  const fileContent = `${headerCommentString}${importsString}${propTypeObjectString}`
  write(`${fileName}.js`, fileContent)
}

const createFiles = () => {
  Object.keys(SCHEMAS).forEach(schemaName => {
    requiredFileImports.length = 0
    requiredPropTypeImports.length = 0
    const fileContent = `${schemaToFileContent(schemaName, SCHEMAS[schemaName])}\r\n`
    write(`${schemaName}.js`, fileContent)
  })
}

const write = (fileName, content) => {
  fs.writeFile(`${PATH}${fileName}`, content, err => {
    if(err) {
        return console.log(err);
    }

    console.log(`${fileName} created`);
  });
}

const schemaToFileContent = (schemaName, schema) => {
  const propTypeObjectString = getPropTypeObject(schemaName, schema)
  const importsString = getImports()
  const headerCommentString = getHeaderComment(schemaName)

  const fileContent = `${headerCommentString}${importsString}${propTypeObjectString}`
  return fileContent
}

const getHeaderComment = (schemaName) => {
  const str = `/*\r\n  ${schemaName}.js propTypes\r\n  extracted from ${URL}\r\n  on ${DATETIME}\r\n*/\r\n\r\n`
  return str
}

const getImports = () => {
  str = ''
  if(requiredPropTypeImports.length > 0) {
    str += `import { ${requiredPropTypeImports.join(', ')} } from 'prop-types'\r\n\r\n`
  }
  if(requiredFileImports.length > 0) {
    requiredFileImports.forEach(file => {
      str += `import ${file} from './${file}'\r\n`
    })
    str += "\r\n"
  }
  return str
}

const getPropTypeObject = (schemaName, schema) => {
  const str = `export const ${schemaName} = {\r\n${getPropTypes(schemaName, schema.properties)}}`

  return str
}

const getPropTypes = (schemaName, props) => {
  let str = ''
  propNames = Object.keys(props)
  // using for instead of forEach because of code format
  for(let i = propNames.length - 1; i >= 0; i--) {
    if(i === 0) {
      str += `  ${propNames[i]}: ${getPropTypeValue(schemaName, props[propNames[i]])}.isRequired\r\n`
      continue
    }
    str += `  ${propNames[i]}: ${getPropTypeValue(schemaName, props[propNames[i]])}.isRequired,\r\n`
  }

  return str
}

const getPropTypeValue = (schemaName, prop) => {
  let str = ''
  switch(prop.type) {
    case 'array':
      if(prop.items.$ref) {
        const ref = parseRef(prop.items.$ref)
        if(!FORCE) {
          schemaExists(ref)
        }
        str = `arrayOf(${ref})`
        if(MULTIPLE_FILES && ref !== schemaName) {
          addRequiredFile(ref)
        }
      } else {
        str = `arrayOf(${getPropTypeValue(schemaName, prop.items)})`
      }
      addRequiredPropType('arrayOf')
      break
    case 'object':
      if(prop.$ref) {
        const ref = parseRef(prop.$ref)
        if(!FORCE) {
          schemaExists(ref)
        }
        str = `shape(${ref})`
        if(MULTIPLE_FILES && ref !== schemaName) {
          addRequiredFile(ref)
        }
      } else {
        str = `shape({${getPropTypes(schemaName, prop.properties)}})`
      }
      // check
      addRequiredPropType('shape')
      break
    case 'number':
    case 'integer':
    case 'long':
    case 'float':
    case 'double':
      str = 'number'
      addRequiredPropType('number')
      break
    case 'string':
    case 'byte':
    case 'binary':
    case 'date':
    case 'DATETIME':
    case 'password':
      str = 'string'
      addRequiredPropType('string')
      break
    case 'boolean':
      str = 'bool'
      addRequiredPropType('bool')
      break
    default:
      if(prop.$ref) {
        const newProp = { type: 'object', ...prop }
        str = getPropTypeValue(schemaName, newProp)
      }
      break
  }

  return str
}

const schemaExists = schemaName => {
  if(!SCHEMAS[schemaName]) {
    console.log(`ERROR: '${schemaName}' schema doesn't exist in file`)
    process.exit(1)
  }
}

const parseRef = ref => {
  return ref.split('/').pop()
}

const addRequiredFile = file => {
  if(requiredFileImports.indexOf(file) === -1) {
    requiredFileImports.push(file)
  }
}

const addRequiredPropType = propType => {
  if(requiredPropTypeImports.indexOf(propType) === -1) {
    requiredPropTypeImports.push(propType)
  }
}

module.exports = {
  parse
}
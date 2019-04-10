const path = require('path')

module.exports = (packageDir) => {
  return {
    [path.resolve(packageDir, 'node_modules', 'react')]: [ 
      'Component', 
      'PureComponent', 
      'createElement',
      'cloneElement',
      'Children' 
    ],
    [path.resolve(packageDir, 'node_modules', 'react-dom')]: [ 
      'unmountComponentAtNode', 
      'findDOMNode',
      'createPortal'
    ],
    [path.resolve(packageDir, 'node_modules', 'prop-types')]: [
      'array',
      'bool',
      'func',
      'number',
      'object',
      'string',
      'symbol',
      'any',
      'arrayOf',
      'element',
      'elementType',
      'instanceOf',
      'node',
      'objectOf',
      'oneOf',
      'oneOfType',
      'shape',
      'exact'
    ]
  }
}

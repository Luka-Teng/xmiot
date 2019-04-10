module.exports = ({types: t}) => ({
  visitor: {
    CallExpression (path) {
      if (
        t.isIdentifier(path.node.callee, {name: 'require'}) &&
        t.isStringLiteral(path.node.arguments[0]) &&
        path.node.arguments.length === 1
      ) {
        const program = path.findParent(t.isProgram)
        const dependencyName = path.node.arguments[0].value

        // Scenario:
        // var foo = require('bar')

        if (
          t.isVariableDeclarator(path.parentPath.node) &&
          t.isIdentifier(path.parentPath.node.id)
        ) {
          const assignedName = path.parentPath.node.id.name

          if (t.isVariableDeclaration(path.parentPath.parentPath.node)) {
            const importName = path.scope.generateUidIdentifier(assignedName)
            program.node.body.unshift(
              t.importDeclaration(
                [t.importDefaultSpecifier(
                  importName
                )],
                t.stringLiteral(dependencyName)
              )
            )
            path.parentPath.node.init = importName
          }
        }

        // Scenario:
        // var foo = require('bar').baz;
        // TODO: Support chained member expressions like require('foo').bar.baz.lol

        else if (
          t.isMemberExpression(path.parentPath.node, {computed: false})
        ) {
          const memberExpressionPath = path.parentPath
          const propertyName = memberExpressionPath.node.property

          if (
            t.isVariableDeclarator(memberExpressionPath.parentPath.node) &&
            t.isIdentifier(memberExpressionPath.parentPath.node.id)
          ) {
            const variableDeclarator = memberExpressionPath.parentPath.node
            const assignedName = memberExpressionPath.parentPath.node.id

            if (t.isVariableDeclaration(memberExpressionPath.parentPath.parentPath.node)) {
              const importName = path.scope.generateUidIdentifierBasedOnNode(assignedName)

              variableDeclarator.init = importName

              program.node.body.unshift(
                t.importDeclaration(
                  [t.importSpecifier(
                    importName,
                    propertyName
                  )],
                  t.stringLiteral(dependencyName)
                )
              )
            }
          }
        }

        // Scenario:
        // require('bar');
        else if (t.isExpressionStatement(path.parentPath.node)) {
          const dependencyName = path.node.arguments[0].value
          path.parentPath.remove()
          program.node.body.unshift(
            t.importDeclaration(
              [],
              t.stringLiteral(dependencyName)
            )
          )
        }
      }
    }
  }
})

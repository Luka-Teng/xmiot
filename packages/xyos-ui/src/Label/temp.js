function stack () {
  function isClass (type) {
    // React.Component subclasses have this flag
    return Boolean(type.prototype) && Boolean(type.prototype.isReactComponent)
  }

  function instantiateComponent (element) {
    var type = element.type
    if (typeof type === 'function') {
      // User-defined components
      return new CompositeComponent(element)
    } else if (typeof type === 'string') {
      // Platform-specific components
      return new DOMComponent(element)
    }
  }

  class CompositeComponent {
    constructor (element) {
      this.currentElement = element
      this.renderedComponent = null
      this.publicInstance = null
    }

    getPublicInstance () {
      // For composite components, expose the class instance.
      return this.publicInstance
    }

    mount () {
      var element = this.currentElement
      var type = element.type
      var props = element.props

      var publicInstance
      var renderedElement
      if (isClass(type)) {
        // Component class
        publicInstance = new type(props)
        // Set the props
        publicInstance.props = props
        // Call the lifecycle if necessary
        if (publicInstance.componentWillMount) {
          publicInstance.componentWillMount()
        }
        renderedElement = publicInstance.render()
      } else if (typeof type === 'function') {
        // Component function
        publicInstance = null
        renderedElement = type(props)
      }

      // Save the public instance
      this.publicInstance = publicInstance

      // Instantiate the child internal instance according to the element.
      // It would be a DOMComponent for <div /> or <p />,
      // and a CompositeComponent for <App /> or <Button />:
      var renderedComponent = instantiateComponent(renderedElement)
      this.renderedComponent = renderedComponent

      // Mount the rendered output
      return renderedComponent.mount()
    }

    receive (nextElement) {
      var prevProps = this.currentElement.props
      var publicInstance = this.publicInstance
      var prevRenderedComponent = this.renderedComponent
      var prevRenderedElement = prevRenderedComponent.currentElement

      // Update *own* element
      this.currentElement = nextElement
      var type = nextElement.type
      var nextProps = nextElement.props

      // Figure out what the next render() output is
      var nextRenderedElement
      if (isClass(type)) {
        // Component class
        // Call the lifecycle if necessary
        if (publicInstance.componentWillUpdate) {
          publicInstance.componentWillUpdate(nextProps)
        }
        // Update the props
        publicInstance.props = nextProps
        // Re-render
        nextRenderedElement = publicInstance.render()
      } else if (typeof type === 'function') {
        // Component function
        nextRenderedElement = type(nextProps)
      }
      // If the rendered element type has not changed,
      // reuse the existing component instance and exit.
      if (prevRenderedElement.type === nextRenderedElement.type) {
        prevRenderedComponent.receive(nextRenderedElement)
        return
      } else {
      }
    }

    getHostNode () {
      // Ask the rendered component to provide it.
      // This will recursively drill down any composites.
      return this.renderedComponent.getHostNode()
    }

    unmount () {
      // Call the lifecycle method if necessary
      var publicInstance = this.publicInstance
      if (publicInstance) {
        if (publicInstance.componentWillUnmount) {
          publicInstance.componentWillUnmount()
        }
      }

      // Unmount the single rendered component
      var renderedComponent = this.renderedComponent
      renderedComponent.unmount()
    }
  }

  class DOMComponent {
    constructor (element) {
      this.currentElement = element
      this.renderedChildren = []
      this.node = null
    }

    getPublicInstance () {
      // For DOM components, only expose the DOM node.
      return this.node
    }

    mount () {
      var element = this.currentElement
      var type = element.type
      var props = element.props
      var children = props.children || []
      if (!Array.isArray(children)) {
        children = [children]
      }

      // Create and save the node
      var node = document.createElement(type)
      this.node = node

      // Set the attributes
      Object.keys(props).forEach(propName => {
        if (propName !== 'children') {
          node.setAttribute(propName, props[propName])
        }
      })

      // Create and save the contained children.
      // Each of them can be a DOMComponent or a CompositeComponent,
      // depending on whether the element type is a string or a function.
      var renderedChildren = children.map(instantiateComponent)
      this.renderedChildren = renderedChildren

      // Collect DOM nodes they return on mount
      var childNodes = renderedChildren.map(child => child.mount())
      childNodes.forEach(childNode => node.appendChild(childNode))

      // Return the DOM node as mount result
      return node
    }

    unmount () {
      // Unmount all the children
      var renderedChildren = this.renderedChildren
      renderedChildren.forEach(child => child.unmount())
    }

    receive (nextElement) {
      var node = this.node
      var prevElement = this.currentElement
      var prevProps = prevElement.props
      var nextProps = nextElement.props
      this.currentElement = nextElement

      // Remove old attributes.
      Object.keys(prevProps).forEach(propName => {
        if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
          node.removeAttribute(propName)
        }
      })
      // Set next attributes.
      Object.keys(nextProps).forEach(propName => {
        if (propName !== 'children') {
          node.setAttribute(propName, nextProps[propName])
        }
      })
    }

    getHostNode () {
      return this.node
    }
  }

  function mountTree (element, containerNode) {
    // Check for an existing tree
    if (containerNode.firstChild) {
      var prevNode = containerNode.firstChild
      var prevRootComponent = prevNode._internalInstance
      var prevElement = prevRootComponent.currentElement

      // If we can, reuse the existing root component
      if (prevElement.type === element.type) {
        prevRootComponent.receive(element)
        return
      }

      // Otherwise, unmount the existing tree
      unmountTree(containerNode)
    }
    // Create the top-level internal instance
    var rootComponent = instantiateComponent(element)

    // Mount the top-level component into the container
    var node = rootComponent.mount()
    containerNode.appendChild(node)

    // Save a reference to the internal instance
    node._internalInstance = rootComponent

    // Return the public instance it provides
    var publicInstance = rootComponent.getPublicInstance()
    return publicInstance
  }

  var rootEl = document.getElementById('root')
  mountTree(<App />, rootEl)

  function unmountTree (containerNode) {
    // Read the internal instance from a DOM node:
    // (This doesn't work yet, we will need to change mountTree() to store it.)
    var node = containerNode.firstChild
    var rootComponent = node._internalInstance

    // Unmount the tree and clear the container
    rootComponent.unmount()
    containerNode.innerHTML = ''
  }

  // Updating
  /**
   * The goal of the reconciler is
   * to reuse existing instances where possible to
   * preserve the DOM and the state
   */

  var rootEl = document.getElementById('root')

  mountTree(<App />, rootEl)
  // Should reuse the existing DOM:
  mountTree(<App />, rootEl)
}

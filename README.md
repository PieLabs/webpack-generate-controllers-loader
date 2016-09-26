This loader creates a map of controllers from the item.json

Installation

``` 
 npm install 
```

Run (see webpack configuration in example folder)
```
 webpack 
```

Configuration 

There is one special configuration option in the webpack 
config to allow for mapping pie ids to controllers. This 
is for helping pie developers working on their unfinished 
(not yet pushed to npm) pie.   

The example below points to a controller.js file for the 
"pie-one" component. Whenever webpack tries to require 
the controller of pie-one, it will use the local file 
test-controller.   

```
//webpack configuration
module.exports = {
  ...
  generateControllersLoader: {
    pieControllers: {
      "pie-one" : "./test-controller.js"
    }
  },
  ...
}
```  
 

 
 
  
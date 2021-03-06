# reactjs-typescript-jspm
This is an simple example showing how to use Reactjs a with TypeScript and JSPM. Tested with Typescript 1.8, react 1.4.7, jspm 0.16.19 . 


## Introduction

Typescript is a very nice and useful way to develop javascript applications in a up-to-date manner while ensuring a high quality of the written code due to  typescript features like :

*   strong (optional)typing
*   interface notion
*   enumerations
*   generics
*   modularization
*   compilation to ES, ES5 or ES6 formats
*   many other...

In addition, ReactJs is a very modern way to develop SPA (Single Page Applications) by using for instance the Inversion Control design pattern, defining Web Components and enabling to mix in the same code HTML and javascript through the jsx extension.

Finally, JSPM is a module download tool dedicated to the SystemJS modularization system ; SystemsJS is compliant with ES6 module definition and aims to make web application downloading js modules defined either in CommonJS, AMD, UMD, Global or ES6 manner. It may be viewed as a superset of all these, like Typescript is a superset of javascript.

The current project has been done using Eclipse and the Palantir Eclipse plugin for Typescript. You may use of course another IDE like VisualStudio, Webstorm, Atom, CATS, ... 


## Installing Typescript

Typescript is a superset of javascript which compiles code in ES3, ES5, and also ES6 js format. It already includes several future features of ES6 and ES7 too. 

The Typescript compiler is itself written in typescript and runs under NodeJS. 

We first need to install NodeJs. It may be found here :  <https://nodejs.org/en/>

You may download the 5.0.0 version.

Once NodeJS installed, type the following command in order to install Typescript compiler and tools.

	npm install -g typescript

It is done ; if you write a typescript file like dummy.ts you cal already manually compile it by the following command :

	tsc dummy.ts


## Installing Eclipse and the Typescript plugin

You can find Eclipse (the current version being at the time the Mars.1 version) ate the following location :
<http://eclipse.org> 

Open Eclipse and open the **Help>Install new software... menu option** .

Enter the **com.palantir.typescript.p2updatesite - http://eclipse-update.palantir.com/eclipse-typescript/** link reference, and follow the installation instructions.

Once Eclipse restarted, do to the **Window>Preferences>Typescript**  menu item. 
Enter the path to the already Node executable, e.g. **C:\Program Files\nodejs\node.exe**.

Once done, go to the Compiler section, and enter  the following Typescript options :

*   Ecmascript target version : ES5 (to ensure compatibility with all the browsers)
*   Specify JSX Code Generation : React (because we aim to use React for the app)
*   Module Code generation : system (because we use jspm)
* 	Check " Enable ES7 decorators " (if we want to use annotations)
*   Check "Compile all typescript file on build"
*   Check "Generate .map files" in order to be able to debug the code in browsers

Once done, create a Static Web project named "MyProject". It will create a project with a WebContent subdirectory, and open the Web eclipse perspective.

Meanwhile you may open the  **<myproject>Properties** contextual menu in the Ecmlipse Project explorer view. Go to the **Builder** section and uncheck the _Javascript Validator_  option. Typescript being typed, the compiler already verify the js code, and isabling this option renders the workspace building quicker.

Important : Configure the project to be Typescript compliant by selecting the following menu item in the Project explorer contextual menu eclipse view:

	Configure>Enable TYpeScript Builder


## Installing JSPM

Go to the MyProject/WebContent folder.

#### 1. Install jspm CLI:

    npm install -g jspm 

#### 2. Create a project:

Optionally lock down jspm for the project:

    cd my-project
    npm install jspm --save-dev

> It is advisable to locally install to lock the version of jspm. 
This will ensure upgrades to the global jspm will not alter the behavior of your application. 
Use `jspm -v` to confirm the local version.

Create a new project configuration:

	jspm init

	Package.json file does not exist, create it? [yes]: 
	Would you like jspm to prefix the jspm package.json properties under jspm? [yes]: 
	Enter server baseURL (public folder path) [.]: 
	Enter jspm packages folder [./jspm_packages]: 
	Enter config file path [./config.js]: 
	Configuration file config.js doesn't exist, create it? [yes]:
	Enter client baseURL (public folder URL) [/]: 
	Which ES6 transpiler would you like to use, Traceur or Babel? [traceur]:


 Sets up the package.json and configuration file.
 Note `jspm init` happens automatically if you try installing into an empty project too.

* **baseURL**: This should be set to the public folder where your server will serve from, relative to the package.json file. _Defaults to the package.json folder itself._
* **jspm packages folder**: The folder where jspm will install external dependencies.
* **Config file path**: The jspm config file for your application. Should be within the baseURL and checked in to version control.
* **Client baseURL**: The URL from the browser where the public folder is hosted.
* **Transpiler**: we use here the **TypeScript** transpiler!!

If you ever need to reset any of these properties, you can modify the package.json, which will update the configuration when you next run `jspm install` or `jspm init` to refresh.

It is possible to run through the above prompts again at any time with `jspm init -p`.

A config.js file is generated in the WebContent folder. We want to write our code into the WebContent/src directory.
We need to change the config.js file to do this by adding and modifying the following options in the file.
``` 
	  System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "typescript",
  typescriptOptions: {
    "noImplicitAny": false,
    "typeCheck": true,
    "jsx": "react"
  },
  paths: {
    "*": "src/*",
    "src": "src",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "src": {
      "defaultExtension": "js"
    }
  },
  ...
``` 

## Installing React and other libraries

Install Reactjs :

	jspm install npm:react
	jspm install npm:react-dom

Install possibly material-ui (material ui is  library enabling to use google material UI patterns with react, another one being react-toolbox) :

	jspm install npm:material-ui

When is is done, we have an updated **config.js** file with everything needed to start with. 

## Installing Typescript external libraries definition files 

In order to download external library definition files, we need the TSD tool which may be found in <http://http://definitelytyped.org/tsd/> 

To install it, write the following command :

	$ npm install -g  tsd 
	
Once downloaded, we install a new library by typing :

	$ tsd install react-global --save
	
By doing this, the tsd tool will create the typings subdirectory and will download into it the devarl react definitions files like react-global, react, reactdom, ....

Do the same for material-ui :
	
	$ tsd install material-ui --save
	
the _-- save_ option is used in order to update de tsd.json file.

## Write the index.hml file

The main entry point of the application is the html file. Create under WebContent the **index.html** file.

The content will like this one :

	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="UTF-8">
	<title>My project using react, jspm and typescript</title>
		<link rel="stylesheet"
			href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
		<link rel="stylesheet"
			href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
	
		<!-- enables to load dynamically external js library ; based upon systemjs -->
	    <script src="jspm_packages/system.js"></script>
	    
	    <!-- downloads the config.js file enabling systemjs to find the module to download -->
	    <script src="config.js"></script>
	</head>
	<body>
	<!-- the div in which the dynamic html file will be included -->
	<div id="content"></div>
	
	<!-- the main javascript entry point to start the application -->
    <script>
        System.import('main');
    </script>
</body>
</html>


## the **main** typescript file

Create the **src** sub-directory in WebContent.

Create the **main.tsx** file and write such a code :

	// react-dom is used to make the bridge between React and the browser DOM
	import * as React from 'react'; 
	import * as ReactDOM from 'react-dom';  
	
	// it is the main entry point called by the html file
	ReactDOM.render( <div> dummy </div> </MyView>, el);

## Use a material-ui component

Create a myview.tsx file along the main.tsx file.

	// importing the module React and the material component FlatButton
	import * as React from 'react';
	import {FlatButton} from 'material-ui';

	//defines the parameters to define while using the MyView component
	// here the foo parameter is optionnal
	export interface MyViewProps extends React.Props<MyView> { 
    foo?: string;
	}
 
	export class MyView extends React.Component<MyViewProps, {}> {
		//defines the default value of foo if not provided
	    public static defaultProps = {
	        foo:"dummy"
	    }
    
    	//defines the render method used to create and display html content
    	// we use here a material FlatButton component
	    render() : JSX.Element {
	        return( 
	            <div>
	                <FlatButton label={this.props.foo} primary={true} > </FlatButton>
	            </div>
	            );
	    }
	}
	
Once done, update the main.tsx file to use MyView.

	// it is the main entry point called by the html file

	import * as React from 'react';

	// react-dom is used to make the bridge between React and the browser DOM
	import * as ReactDOM from 'react-dom';


	//notice the use of relative notation for the path
	import {MyView} from "./myview"
    
	// in this example, we only create simple personnal component code which will be
	// put under <div id='content'> </div> defined in index.html

	var el = document.getElementById("content");
	ReactDOM.render( <MyView foo="not so dummy"> </MyView>, el);
	
## Running the application

You can use webapp servers like apache, php, servlets container, ..., and so on to host your simple application.

You may also want to simply serve your files by using the http-server simple application.

	npm install  -g http-server
	
Once downloaded, under WebContent, write this command in a shell :

	http-server
	
and open your browser and open the following url :

	http://localhost:8080/index.html
	
You normally will see you application displaying _Not so dummy_.


## Installing an external module without declaration file

If you want to use an external module which doesn't have yet a d.ts file associated, you need first to download the library :

	$jspm install bootstrap
	$jspm install npm:react-bootstrap
	
and then create manually the d.ts file.

First, create the folder _react-bootstrap_ under the _typings_ directory, and then create the _react-bootstrap.d.ts_ file inside.
Example :

	///<reference path='../react/react.d.ts' />

	declare namespace _ReactBoostrap {
	    import React = __React
	    export class Button extends React.Component<{}, {}> { 
	    }
	}
	
	declare module "react-bootstrap" {
	    export import Button = _ReactBoostrap.Button;
	}


Once done, change the tsd.d.ts file to add a ref to this new file.

	/// <reference path="react-bootstrap/react-bootstrap.d.ts" /> 
	
We can from now use the **Button** component from _react-bootstrap_ inside our application.

Change the _myview.tsx_ file and add the following  import statement.
	
	import {Button} from "react-bootstrap";  
	
and then modify the render function :

	render() {
        return (
            <div>
                <FlatButton label={this.props.foo} primary={true} /> 
                <Button>Default</Button>
            </div>);
    }
    
You can now launch the http-server executable, and test your app.

It may occurs that errors occur when loading external modules in your browser. If so, manually reinstall systemjs :

	npm install systemjs --save
	jspm install npm:systemjs
	
to ensure you have the latest version (here it is the 19.5 one).

#Appendix A 

### Some information about module handling in typescript


We can summarize  the typescript import process as follows.

Import statement does actually to things:

- import the "specification" of the module we want to import, i.e. the "contract" of the imported module. This contract may be found from the ts code we write itself, and also from declaration files (d.ts) which may be provided through for instance tds. This specification is used by the compiler to ensure the code is correcly typed, and by tools to provide intellisense.
- import actual code when the application runs, enabling then an incremental download of the module during the app running

Moreover, the modules may be accessed in two way :

- in a relative manner, i.e. wrt the location of the code being importing another module, e.g. import {Dummy} from './dummy'
- in an absolute manner, i.e. from the application root. Doping this, the compiler will scan all the subdirectories to find the right specified module, and then try to load it

We generally use the first option when we try to access modules described in the application itself, i.e. the ts code we write We generally use the second option when we import code from a vendor module like react, jquery, bootstrap, .... We usually use the tsd tool to import an already generated module description, and these declarations files are automatiocally put into the "typing" subdirectory. Parallely we need to downaload actual code in order to make the application running ; we may do this (for instance if we use the "system" compilation option) by using the jspm tool which will download the js files into the jspm_packages subdirectoy.

If we downloaded by jspm for instance a js module which has not yet a d.ts declaration file, we will have to define one. I propose to put it also in the "typings" sub directory generated initially by tsd.

The declaration file may be defined in many ways, but we may simplify by using the two following manners :

- use the "export" statement in a given file, e.g. //file dummy.d.ts export class Dummy { name : string }

and importing in a file by :

	import {Dummy} from 'dummy' 

using the "module" statement

    //file dummy.d.ts declare module "mydummy" { export class Dummy { ... } }

and importing it in another file by :

	import {Dummy} fom 'mydummy' 

If the two ways may seem quite similar, the second approach enables to declare the same "mydummy" module in separate files, the compiler merging all the declaration automatically. We may notice that in the second approach the name of the module is not the name of the file, as in was in the first approach.

### Using react contexts with typescript

Using **contexts** in react enables a subcomponent to access some global information in a hierachy of components (cf.   <https://facebook.github.io/react/docs/context.html> ).

Nevertheless it is not straightforward to use it in typescript. Below is a simple explanation of how we may use it in a typescript application . 

Firstly, we need to add information in the containing components AND in the subcomponents : 

In the containing component , something like that :
```
     static childContextTypes= {
        open:  React.PropTypes.func.isRequired
      }
    
      getChildContext() {
        return {open: (value)=>this.changeState("",value)}
      } 
 ```

and in the subcomponent : 

```

	export interface SectionContext {
    open : (string)=>void;
	}
	
	export class Section extends React.Component<SectionProps,{}> {  

     isOpen =false;
     context: SectionContext;  // context object typed with the context interface

    // registration of the context type, already defined into the containing component
     static contextTypes =  {
        open:  React.PropTypes.func.isRequired
     }
    
    change() {
        this.isOpen = !this.isOpen;
        // use of the context described in the containing component
        this.context.open(this.isOpen?"true":"false");
    }
```


 

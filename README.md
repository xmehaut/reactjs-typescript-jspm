# reactjs-typescript-jspm
This is an simple example showing how to use Reactjs a with TypeScript and JSPM.


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

    npm install jspm -g

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
	  
	  baseURL: ".",
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
	

## Installing React and other libraries

Install Reactjs :

	jspm install npm:react-global
	jspm install npm:react-dom
	jspm install npm:react

Install possibly material-ui (material ui is  library enabling to use google material UI patterns with react, another one being react-toolbox) :

	jspm install npm:material-ui

When is is done, we have an updated **config.js** file with everything needed to start with. 

## Installing Typescript external libraries definition files 

In order to download external library definition files, we need the TSD tool which may be found in <http://http://definitelytyped.org/tsd/> 

To install it, write the following command :

	$ npm install tsd -g
	
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
	
		<!-- enables to load dynamiccaly external js library ; based upon systemjs -->
	    <script src="jspm_packages/system.js"></script>
	    
	    <!-- downloads the config.js file enabling systemjs to find the module to download -->
	    <script src="config.js"></script>
	</head>
	<body>
	<!-- the div in which the dynamic html file will be included -->
	<div id="content"></div>
	
	<!-- the main javascript entry point to start the application -->
    <script>
        System.import('main').then(function(m) {
            var element = document.getElementById("content");
            m.main(element);
        });
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
	export function main(el: HTMLElement): void {
		 // in this example, we create only  simple div code which will be
		 // put under <div id='content'> </div> defined in index.html
	    var divcode = <div> dummy </div>
	    ReactDOM.render(divcode, el); 
	}

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

	// react-dom is used to make the bridge between React and the browser DOM
	import * as React from 'react'; 
	import * as ReactDOM from 'react-dom'; 

	//notice the use of relative notation for the path
	import {MyView} from "./myview"
    
	// it is the main entry point called by the html file
	export function main(el: HTMLElement): void {
    
    // in this example, we create only  simple div code which will be
    // put under <div id='content'> </div> defined in index.html
    var divcode = <MyView foo="not so dummy">  </MyView>
    ReactDOM.render(divcode, el);
	}
	
## Running the application

You can use webapp servers like apache, php, servlets container, ..., and so on to host your simple application.

You may also want to simply serve your files by using the http-server simple application.

	npm install http-server -g
	
Once downloaded, under WebContent, write this command in a shell :

	http-server
	
and open your browser and open the following url :

	http://localhost:8080/index.html
	
You normally will see you application displaying _Not so dummy_.



	



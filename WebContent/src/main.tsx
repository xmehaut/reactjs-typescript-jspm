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
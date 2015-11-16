import * as React from 'react';
import * as ReactDOM from 'react-dom';
// react-dom is used to make the bridge between React and the browser DOM

//notice the use of relative notation for the path
import {MyView} from "./myview"
    
// it is the main entry point called by the html file
export function main(el: HTMLElement): void {
    
    // in this example, we create only  simple div code which will be
    // put under <div id='content'> </div> defined in index.html
    ReactDOM.render(<div><MyView foo="not so dummy"> </MyView></div> , el);
}

// react-dom is used to make the bridge between React and the browser DOM
import * as ReactDom from 'react-dom'; 

//notice the use of relative notation for the path
import {MyView} from "./view"
    
// it is the main entry point called by the html file
export function main(el: HTMLElement): void {
    
    // in this example, we create only  simple div code which will be
    // put under <div id='content'> </div> defined in index.html
    var divcode = <MyView foo="not so dummy">  </MyView>
    ReactDom.render(divcode, el);
}

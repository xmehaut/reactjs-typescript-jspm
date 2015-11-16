import * as React from "react";
import {FlatButton} from 'material-ui'; 
// importing the module React and the material component FlatButton
 
import {Button} from "react-bootstrap";  

//defines the parameters to define while using the MyView component
// here the foo parameter is optionnal
export interface MyViewProps extends React.Props<MyView> {
    foo?: string;
}

export class MyView extends React.Component<MyViewProps, {}> {
    //defines the default value of foo if not provided
    public static defaultProps = {
        foo: "dummy" 
    }
    
    //defines the render method used to create and display html content
    // we use here a material FlatButton component
    //warning : be aware you must return a html code between parenthesis  
    render() {
        return (
            <div>
                <FlatButton label={this.props.foo} primary={true} /> 
                <Button>Default</Button>
            </div>);
    }
}

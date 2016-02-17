// it is the main entry point called by the html file
System.register(['react', 'react-dom', "./myview"], function(exports_1) {
    "use strict";
    var React, ReactDOM, myview_1;
    var el;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (ReactDOM_1) {
                ReactDOM = ReactDOM_1;
            },
            function (myview_1_1) {
                myview_1 = myview_1_1;
            }],
        execute: function() {
            // in this example, we only create simple personnal component code which will be
            // put under <div id='content'> </div> defined in index.html
            el = document.getElementById("content");
            ReactDOM.render(React.createElement(myview_1.MyView, {foo: "not so dummy"}, " "), el);
        }
    }
});

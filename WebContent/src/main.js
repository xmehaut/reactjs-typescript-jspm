System.register(['react', 'react-dom', "./myview"], function(exports_1) {
    var React, ReactDOM, myview_1;
    // it is the main entry point called by the html file
    function main(el) {
        // in this example, we create only  simple div code which will be
        // put under <div id='content'> </div> defined in index.html
        ReactDOM.render(React.createElement("div", null, React.createElement(myview_1.MyView, {"foo": "not so dummy"}, " ")), el);
    }
    exports_1("main", main);
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
        }
    }
});
//# sourceMappingURL=main.js.map
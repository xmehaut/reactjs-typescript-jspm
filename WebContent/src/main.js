System.register(['react-dom', "./view"], function(exports_1) {
    var ReactDom, view_1;
    // it is the main entry point called by the html file
    function main(el) {
        // in this example, we create only  simple div code which will be
        // put under <div id='content'> </div> defined in index.html
        var divcode = React.createElement(view_1.MyView, {"foo": "not so dummy"}, "  ");
        ReactDom.render(divcode, el);
    }
    exports_1("main", main);
    return {
        setters:[
            function (ReactDom_1) {
                ReactDom = ReactDom_1;
            },
            function (view_1_1) {
                view_1 = view_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=main.js.map
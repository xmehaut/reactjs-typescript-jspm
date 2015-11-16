System.register(["react", 'material-ui', "react-bootstrap"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, material_ui_1, react_bootstrap_1;
    var MyView;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (material_ui_1_1) {
                material_ui_1 = material_ui_1_1;
            },
            function (react_bootstrap_1_1) {
                react_bootstrap_1 = react_bootstrap_1_1;
            }],
        execute: function() {
            MyView = (function (_super) {
                __extends(MyView, _super);
                function MyView() {
                    _super.apply(this, arguments);
                }
                //defines the render method used to create and display html content
                // we use here a material FlatButton component
                //warning : be aware you must return a html code between parenthesis  
                MyView.prototype.render = function () {
                    return (React.createElement("div", null, React.createElement(material_ui_1.FlatButton, {"label": this.props.foo, "primary": true}), React.createElement(react_bootstrap_1.Button, null, "Default")));
                };
                //defines the default value of foo if not provided
                MyView.defaultProps = {
                    foo: "dummy"
                };
                return MyView;
            })(React.Component);
            exports_1("MyView", MyView);
        }
    }
});
//# sourceMappingURL=myview.js.map
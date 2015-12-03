///<reference path='../react/react.d.ts' />

declare namespace _ReactBoostrap {
    import React = __React
    export class Button extends React.Component<{}, {}> { 
    }
}

declare module "react-bootstrap" {
    export import Button = _ReactBoostrap.Button;
}
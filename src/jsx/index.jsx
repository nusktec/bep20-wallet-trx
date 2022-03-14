import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./pages/exchange";
class Index extends Component {
    render() {
        return (
            <>
                {/* <BrowserRouter> */}
                <BrowserRouter basename="/exchange">
                    <div id="main-wrapper">
                        <Switch>
                            <Route path="/" exact component={Dashboard} />
                        </Switch>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

export default Index;

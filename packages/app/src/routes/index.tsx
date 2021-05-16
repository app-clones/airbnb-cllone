import React from "react";
import { NativeRouter, Route, Switch } from "react-router-native";

import { RegisterConnector } from "../modules/register/RegisterConnector";

export const Routes = () => (
    <NativeRouter>
        <Switch>
            <Route exact path="/" component={RegisterConnector} />
        </Switch>
    </NativeRouter>
);

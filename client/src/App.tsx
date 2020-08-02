import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { Entry } from './Entry';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Room } from './Room';
import './global.less';

export const App: React.FC = React.memo(() => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Switch>
        <Route name="room" path="/room/:roomUUID" component={Room} />
        <Route name="index" path="/" component={Entry} />
      </Switch>
    </BrowserRouter>
  );
});
App.displayName = 'App';

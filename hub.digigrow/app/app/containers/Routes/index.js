import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from '../Pages/Standalone/NotFoundDedicated';
import PrivateRoutes from './privateRoutes';
import ThemeWrapper from './ThemeWrapper';
import LoginDedicated from '../Pages/Standalone/LoginDedicated';
import RegisterDedicated from '../Pages/Standalone/RegisterDedicated';
import ResetPasswordDedicated from '../Pages/Standalone/ResetPasswordDedicated';
// import ExtTalaoVendas from '../Pages/Standalone/ExtTalaoVendas';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

import { ExtTalaoVendasPage } from '../pageListAsync';

function App(props) {


  return (
    <ThemeWrapper>  
      <Switch>
        <Route path="/login" exact component={LoginDedicated} />
        <Route path="/register" component={RegisterDedicated} />
        <Route path="/reset-password" component={ResetPasswordDedicated} />
        <Route path="/ext/talaovendas" component={ExtTalaoVendasPage} />
        <Route component={PrivateRoutes} />
        <Route component={NotFound} />
      </Switch>      
    </ThemeWrapper>
  );
}

export default App;

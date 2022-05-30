import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react';
import { useEffect } from "react";
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import { Route, Switch, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetail';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponen';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <ModalContainer />
      <Route exact path ='/' component={HomePage}/>
      <Route
        path ={'/(.+)'}
        render={() => ( 
        <>
          <NavBar />
            <Container style={{marginTop: '7em'}}>
            <Switch>
              <PrivateRoute exact path ='/activities' component={ActivityDashboard}/>
              <PrivateRoute path ='/activities/:id' component={ActivityDetails}/>
              <PrivateRoute key={location.key} path ={['/createActivity', '/manage/:id']} component={ActivityForm}/>
              <PrivateRoute path='/profiles/:username' component={ProfilePage} />
              <PrivateRoute path='/errors' component={TestErrors} />
              <Route path='/server-error' component={ServerError} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
        )}
      />
    </>
  );
}

export default observer(App);

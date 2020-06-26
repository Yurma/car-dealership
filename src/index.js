import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import VehicleStore from './stores/vehicleStore';
import ViewStore from './stores/viewStore';
import EditStore from './stores/editStore';

import {Provider} from 'mobx-react'

const Application = () => 
    <Provider VehicleStore={VehicleStore} ViewStore={ViewStore} EditStore={EditStore}>
        <App />
    </Provider>


ReactDOM.render(<Application />, document.getElementById('app'));
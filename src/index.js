import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';

import PleasepayStore from './stores/PleasepayStore.js'
import PleasepayApp from './components/PleasepayApp.js'

const store = new PleasepayStore();

ReactDOM.render(<Provider store={store}><PleasepayApp/></Provider>, document.querySelector('#main'));
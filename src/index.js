import React from 'react';
import { render } from 'react-dom';
import './reset.css';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Router from './components/Router'

render(<Router />, document.getElementById('root'));
registerServiceWorker();

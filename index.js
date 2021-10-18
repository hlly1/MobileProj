/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';

import PageTesting from './components/pages/testfunc.js'

AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerComponent(appName, () => PageTesting);

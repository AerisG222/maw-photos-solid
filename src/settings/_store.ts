import { createStore } from "solid-js/store";
import { AppSettings } from '../models/Settings';

const defaultAppSettings: AppSettings = {
    theme: 'dark'
};

export const [appSettings, setAppSettings] = createStore(defaultAppSettings);

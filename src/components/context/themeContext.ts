import {createContext} from 'react';
import {NIGHT} from '../../interfaces/stateInterfaces';

export const ThemeContext = createContext({
	theme: NIGHT
});

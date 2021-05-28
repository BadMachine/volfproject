import React from 'react';
import {filterData} from './cocoData';


export interface changeThemeInterface {
	callback: ()=>void;
}


export type callbackProp = {
	callback: (data: filterData)=>void;
}

import React from 'react';
import axios from 'axios';
import {filterData} from './cocoData';

export default class API{
	constructor(private adress:string, private port:number) {
	}

	requestDataset(xml:boolean, filter: filterData){
		return(	axios.post(`${this.adress}:${this.port}/import_based_on_request`,
			{...filter, exportToXML: xml},
			{responseType: 'arraybuffer'})
		);
	}
	getRandomSample(filter?:filterData){
		return(	axios.post(`${this.adress}:${this.port}/get_random`,
			{...filter}, {responseType: 'json'})
		);
	}
}

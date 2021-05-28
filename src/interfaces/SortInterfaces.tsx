import React from 'react';
import {bubbleSort} from '../redux/SortingStateReducer';

// export interface callbackBtnSort{
// 	callback: ()=>void;
// }

export interface commands{
	name: string,
    arrayLength: number,
    startSorting: boolean,
    StopSort: boolean
}

export interface CommandsInterface{
    commands: commands,
	callback: ()=>void;
}



export const initialCommandsState = {
	commands:{
		name: '',
		arrayLength: 10,
		startSorting: false,
		StopSort: false
	},
	callback: ()=>{console.log('');}
};

export type chartjsDataType = {
    data: {
        labels: string[]; datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number; }[];
    }
};


export function randomColor(){
	return Math.floor(Math.random() * 255);
}

export function generateColorsForChart(size: number, opacity: number):string[][]{
	const colors = Array(size);
	const borders = Array(size);

	for(let iteration = 0; iteration < size; iteration++){
		const randomRGB = `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}`;
		colors[iteration] = `${randomRGB}, ${opacity})`;
		borders[iteration] = `${randomRGB}, 1)`;
	}

	return [colors, borders];
}

export const chartjsDataTemplate = ()=>{
	return {
		labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
		datasets: [{
			label: '0s 0ms',
			data: Array.from({length: 10}, () => Math.floor(Math.random() * 100)),
			backgroundColor: [
				'rgba(255, 99, 132, 0.4)',
				'rgba(54, 162, 235, 0.4)',
				'rgba(255, 206, 86, 0.4)',
				'rgba(75, 192, 192, 0.4)',
				'rgba(153, 102, 255, 0.4)',
				'rgba(255, 159, 64, 0.4)',
				'rgba(54, 162, 235, 0.4)',
				'rgba(255, 206, 86, 0.4)',
				'rgba(75, 192, 192, 0.4)',
				'rgba(153, 102, 255, 0.4)',

			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)'
			],
			borderWidth: 1
		}]
	};
};




import React from 'react';


export interface filterData{
	superclass: string,
	subclasses: string[],
	image: {
		width: number,
		height: number
	},
	bboxes:{
		maxWidth: number,
		maxHeight: number,
		minWidth: number,
		minHeight: number
	},

	path: string,
	only: number
}


export interface subClassesStateInterface {
	subclasses: string[],
	badges: string[],
	exportPending: boolean
}

export const outputDataJsonFormat = {
	filename: 'string',
	path: 'string',
	url: 'string',
	width: 'number',
	height: 'number',
	license: 'string',
	info: {
		bboxes: '[{box: number[], category: string}, ...]',
		segments: '[{area: number, segments: number[][], category: string } || { counts: number[], size: number[], category: string }  ] ...'
	}
};


export const filterInit = {
	superclass: '',
	subclasses: [''],
	image: {
		width: 0,
		height: 0
	},
	bboxes:{
		maxWidth: 0,
		maxHeight: 0,
		minWidth: 0,
		minHeight: 0
	},

	path: '',
	only: 3
};

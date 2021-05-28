import React from 'react';
import * as tf from '@tensorflow/tfjs';

export const TENSORFLOW_JS = 'tensorflow';
export const ARRAY_SORT = 'arraySort';
export const COCO = 'coco';
export const NIGHT = 'night';
export const DAY = 'day';

export interface modalStateInterface{
	tensorflow: boolean,
	arraySort: boolean,
	coco: boolean
}

export const initialModalState:modalStateInterface = {
	tensorflow: false,
	arraySort: false,
	coco: false
};

export interface txtDetectionState {
	imageURL: string,
	bboxes: {
		box:number[][], category: string
	}[],
	segments: {
		segment: number[][], category: string
	}[],
	uploaded: tf.Tensor3D[],
	storedBboxes: tf.Tensor1D[][],
	storedSegments: tf.Tensor1D[][]
}

// export const initialTxtDetectionState = {
// 	imageURL: '',
// 	bboxes: {
// 		box:number[][], category: string
// 	}[],
// 	segments: {
// 		segment: number[][], category: string
// 	}[],
// 	uploaded: tf.Tensor3D[],
// 	storedBboxes: tf.Tensor1D[][],
// 	storedSegments: tf.Tensor1D[][]
// };

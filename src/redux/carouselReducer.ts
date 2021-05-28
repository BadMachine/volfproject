import {AnyAction} from 'redux';

export const tensorflow = 'tensorflow';
export const arraySort = 'arraySort';
export const custom= 'custom';

const initialState = '';

export function carouselReducer(state= initialState, action :{type: string}):string{
    
	
	switch (action.type) {
	case tensorflow:
		state=tensorflow;
		break;
	case arraySort:
		state = arraySort;
		break;
	case custom:
		state = custom;
		break;
	default:
		state = '';
		break;
	}

	return state;
}
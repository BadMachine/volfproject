import {AnyAction} from 'redux';

export const bubbleSort = 'bubblesort';
export const bubbleSortCancelled = 'bubblesortCancelled';
export const heapSort = 'heapSort';
export const heapSortCancelled = 'heapSortCancelled';
export const quickSort = 'quickSort';
export const quickSortCancelled = 'quickSortCancelled';
export const insertionSort = 'insertionSort';
export const insertionSortCancelled = 'insertionSortCancelled';

export const arraySort = 'arraySort';
export const custom= 'custom';


const initialState = {
	bubble:'',
	heap:'',
	quick:'',
	insertion:''
};

export type storeCommands = {
	bubble:string,
	heap:string,
	quick:string,
	insertion:string
}

export function SortingStateReducer(state= initialState, action : {type: string}):storeCommands{

	switch (action.type){

	case bubbleSort:

		if(state.bubble === bubbleSort){
			state = {bubble: bubbleSortCancelled, heap: state.heap, quick: state.quick, insertion: state.insertion};
		}else state = {bubble: bubbleSort, heap: state.heap, quick: state.quick, insertion: state.insertion};

		break;
	case heapSort:

		if(state.heap === heapSort){
			state = {bubble: state.bubble, heap: heapSortCancelled, quick: state.quick, insertion: state.insertion};
		} else state = {bubble: state.bubble, heap: heapSort, quick: state.quick, insertion: state.insertion};

		break;
	case quickSort:
		if(state.quick === quickSort){
			state = {bubble: state.bubble, heap: state.heap, quick: quickSortCancelled, insertion: state.insertion};
		} else state = {bubble: state.bubble, heap: state.heap, quick: quickSort, insertion: state.insertion};

		break;

	case insertionSort:

		if(state.insertion === insertionSort){
			state = {bubble: state.bubble, heap: state.heap, quick: state.quick, insertion: insertionSortCancelled};
		} else state = {bubble: state.bubble, heap: state.heap, quick: state.quick, insertion: insertionSort};

		break;
	}



	return state;
}

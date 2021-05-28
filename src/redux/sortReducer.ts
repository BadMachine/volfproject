import {AnyAction} from 'redux';

export const changeArrayState = 'changeArray';


const initialState = [2,5,1,7,9,12,44,23];

function BubbleSort(array: number[]){
	const data = array;

	for(let it=0; it<data.length; ++it){

		for(let that=0; that< data.length-1 -it;++that){
			if (data[that] > data[that+1]) {
				const temporary = data[that];
				data[that] = data[that+1];
				data[that+1] = temporary;
			}
		}
	}

	console.log(data);
	return data;
}



export function sortReducer(state= initialState, action :{type: string}):number[]{
    
	if (action.type === changeArrayState){
		state = BubbleSort(state);
		return state;
	}else if(action.type === 'POP'){
		state.pop();
		return state;
	}

	return state;
}
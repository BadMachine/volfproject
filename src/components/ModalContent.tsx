import React, {useContext, useRef} from 'react';
import {Modal, Button, Container, Row, Col, Form} from 'react-bootstrap';
import {MathComponent} from 'mathjax-react';
import {initialCommandsState} from '../interfaces/SortInterfaces';
import {start, cancel, disabled} from '../rs-styles/rs-styles';
import {COCO} from './coco';
import {MemorizedBubbleChart} from './BubbleChart';
import {MemorizedHeapChart} from './HeapSortChart';
import {MemorizedQuickChart} from './QuickSortChart';
import {MemorizedInsertionChart} from './InsertionSortChart';
import {ThemeContext} from './context/themeContext';

import {createStore} from 'redux';
import {SortingStateReducer, bubbleSort, bubbleSortCancelled, storeCommands, heapSort, heapSortCancelled, quickSort, quickSortCancelled, insertionSort, insertionSortCancelled} from '../redux/SortingStateReducer';
import {TextDetection} from './TextDetection';


export const sortingStore = createStore(SortingStateReducer);

let sortBtnsState={
	bubble:'',
	heap:'',
	quick: '',
	insertion:''

};

sortingStore.subscribe(()=>{
	const state = sortingStore.getState();
	sortBtnsState = state;
});

type stateObj = {
	tensorflow: boolean,
	arraySort: boolean,
	coco: boolean,

};

type onclose = ()=>void;

const style = {
	large:
		{
			maxWidth: '100%',
			minHeight: '100%'
		},
	mid:{
		minWidth:'100%',
		minHeight:'100%'
	}
};




export default function ModalContent({state, onClose}:{ state: stateObj, onClose:onclose}){

	const {theme} = useContext(ThemeContext);

	const bubbleSortBtn = useRef<any>(); //ref to bubblesort btn
	const bubbleInputValue = useRef<any>(); //ref to bubblesort input value

	const heapSortBtn = useRef<any>();//ref to heapsort btn
	const heapInputValue = useRef<any>(); //ref to heapsort input value

	const quickSortBtn = useRef<any>();//ref to quicksort btn
	const quickInputValue = useRef<any>(); //ref to quicksort input value

	const insertionSortBtn = useRef<any>();//ref to quicksort btn
	const insertionInputValue = useRef<any>(); //ref to quicksort input value


	const [bubbleSortCommands, setBubbleSortCommands] = React.useState(initialCommandsState); // bubblesort commands state
	const [heapSortCommands, setHeapSortCommands] = React.useState(initialCommandsState); // bubblesort commands state
	const [quickSortCommands, setQuickSortCommands] = React.useState(initialCommandsState); // bubblesort commands state
	const [insertionSortCommands, setInsertionSortCommands] = React.useState(initialCommandsState); // bubblesort commands state


	const bubbleSortButtonStateChanged = React.useCallback(()=>{
		bubbleSortBtn.current.className = start;
		bubbleSortBtn.current.innerText = 'Sort!';
		sortingStore.dispatch({type: bubbleSort});
	} , []);

	const heapSortButtonStateChanged = React.useCallback(()=>{
		heapSortBtn.current.className = start;
		heapSortBtn.current.innerText = 'Sort!';
		sortingStore.dispatch({type: heapSort});
	} , []);

	const quickSortButtonStateChanged = React.useCallback(()=>{
		quickSortBtn.current.className = start;
		quickSortBtn.current.innerText = 'Sort!';
		sortingStore.dispatch({type: quickSort});
	} , []);

	const insertionSortButtonStateChanged = React.useCallback(()=>{
		insertionSortBtn.current.className = start;
		insertionSortBtn.current.innerText = 'Sort!';
		sortingStore.dispatch({type: insertionSort});
	} , []);





	//BubbleSort button handler, controls BubbleChart sending commands(changes state) and button attributes & styles
	const handleBubbleSortSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
		event.preventDefault();
		const BubbleArrayLength = Number(bubbleInputValue.current.value);
		sortingStore.dispatch({type:bubbleSort});
		//console.log(sortingStore.getState());
		if(sortBtnsState.bubble===bubbleSort){
			bubbleSortBtn.current.className = cancel;
			bubbleSortBtn.current.innerText = 'Cancel!';
			bubbleSortBtn.current.setAttribute('disabled', true);
			setTimeout(()=>{
				bubbleSortBtn.current.disabled =false;
			},850);

		}
		setBubbleSortCommands({commands:{
			name:'Bubble Sort',
			arrayLength: BubbleArrayLength,
			startSorting: true,
			StopSort: sortBtnsState.bubble === bubbleSortCancelled
		},callback: bubbleSortButtonStateChanged});

	};


	const handleHeapSortSubmit=(event: React.FormEvent<HTMLFormElement>)=>{
		event.preventDefault();
		const HeapArrayLength = Number(heapInputValue.current.value);
		sortingStore.dispatch({type:heapSort});
		console.log(sortingStore.getState());
		if(sortBtnsState.heap===heapSort){
			heapSortBtn.current.className = cancel;
			heapSortBtn.current.innerText = 'Cancel!';
			heapSortBtn.current.setAttribute('disabled', true);
			setTimeout(()=>{
				heapSortBtn.current.disabled = false;
			},550);
		}

		setHeapSortCommands({commands:{
			name:'Heap Sort',
			arrayLength: HeapArrayLength,
			startSorting: true,
			StopSort: sortBtnsState.heap === heapSortCancelled
		},callback: heapSortButtonStateChanged});
	};


	const handleQuickSortSubmit = (event: React.FormEvent<HTMLFormElement>)=>{

		event.preventDefault();

		const QuickArrayLength = Number(quickInputValue.current.value);
		sortingStore.dispatch({type:quickSort});

		if(sortBtnsState.quick===quickSort){
			quickSortBtn.current.className = cancel;
			quickSortBtn.current.innerText = 'Cancel!';
			quickSortBtn.current.setAttribute('disabled', true);
			setTimeout(()=>{
				quickSortBtn.current.disabled = false;
			},550);
		}

		setQuickSortCommands({commands:{
			name:'Quick Sort',
			arrayLength: QuickArrayLength,
			startSorting: true,
			StopSort: sortBtnsState.quick === quickSortCancelled
		},callback: quickSortButtonStateChanged});
	};


	const handleInsertionSortSubmit = (event: React.FormEvent<HTMLFormElement>)=>{

		event.preventDefault();
		const InsertionArrayLength = Number(insertionInputValue.current.value);
		sortingStore.dispatch({type:insertionSort});

		if(sortBtnsState.insertion===insertionSort){
			insertionSortBtn.current.className = cancel;
			insertionSortBtn.current.innerText = 'Cancel!';
			insertionSortBtn.current.setAttribute('disabled', true);
			setTimeout(()=>{
				insertionSortBtn.current.disabled = false;
			},550);
		}

		setInsertionSortCommands({commands:{
			name:'Insertion Sort',
			arrayLength: InsertionArrayLength,
			startSorting: true,
			StopSort: sortBtnsState.insertion === insertionSortCancelled
		},callback: insertionSortButtonStateChanged});
	};



	return(
		<>
			<Modal
				show={state.tensorflow}
				style={style.large}
				closeTimeoutMS={500}
				onHide={onClose}
				dialogClassName={`modal-dialog modal-xl ${theme}Text`}
				aria-labelledby="example-custom-modal-styling-title"
			>
				<Modal.Header closeButton className={`${theme}Modal ${theme}Text`}>
					<Modal.Title id="example-custom-modal-styling-title">
						Text detection with tensorflow
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className={`${theme}Modal`}>
					<TextDetection/>
				</Modal.Body>
			</Modal>

			<Modal
				show={state.arraySort}
				onHide={onClose}
				style={style.large}
				dialogClassName={`modal-dialog modal-xl ${theme}Text`}
				aria-labelledby="example-custom-modal-styling-title"
			>
				<Modal.Header closeButton className={`${theme}Modal ${theme}Text`}>
					<Modal.Title id="example-custom-modal-styling-title">
						ArraySort Modal Styling
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className={`${theme}Modal show-grid`}>
					<Container>
						<Row xs={2} md={14} lg={15}>
							<Col>
								<h3>Bubble sort</h3>
							</Col>
						</Row>

						<p>Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.</p>
						<p>This simple algorithm performs poorly in real world use and is used primarily as an educational tool.</p>

						<Row>
							<Col xs={6} md={4}>
								<h5>Complexity:</h5>
								<p style={{marginLeft:'-4rem'}}><MathComponent  tex={String.raw`O(n^2)`} /></p>
							</Col>
							<Col xs={6} md={4}>
								<h5>Visualization</h5>

								<MemorizedBubbleChart commands={bubbleSortCommands.commands} callback={bubbleSortCommands.callback}/>

							</Col>

							<Col xs={6} md={4}>
								<h5 style = {{marginLeft: '4rem'}}>Panel</h5>

								<Form style = {{marginLeft: '4rem'}} onSubmit={handleBubbleSortSubmit}>
									<Form.Group >
										<Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
											Number of elements to sort:
										</Form.Label>
										<Form.Control size="sm" as="select" ref={bubbleInputValue}>
											<option value='10'>10</option>
											<option value='20'>20</option>
											<option value='50'>50</option>
											<option value='100'>100</option>
											<option value='200'>200</option>

										</Form.Control>
									</Form.Group>
									<Button ref={bubbleSortBtn} variant="success" type="submit"  block className = {`${(sortBtnsState.bubble===bubbleSort)?cancel:start}`}>
										{`${(sortBtnsState.bubble===bubbleSort)?'Cancel!':'Sort!'}`}
									</Button>
								</Form>
							</Col>
						</Row>
						<p>The only significant advantage that bubble sort has over most other algorithms, even quicksort, but not insertion sort, is that the ability to detect that the list is sorted efficiently is built into the algorithm.</p>

					</Container>


					<Container>
						<Row xs={2} md={14} lg={15}>
							<Col>
								<h3>Insertion sort</h3>
							</Col>
						</Row>

						<p>In computer science, heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. Unlike selection sort, heapsort does not waste time with a linear-time scan of the unsorted region; rather, heap sort maintains the unsorted region in a heap data structure to more quickly find the largest element in each step</p>
						<p>Heapsort is an in-place algorithm, but it is not a stable sort.</p>

						<Row>
							<Col xs={6} md={4}>
								<h5>Complexity:</h5>
								<p style={{marginLeft:'-4rem'}}><MathComponent  tex={String.raw` O (n\log _{\text{n}}) `} /></p>
							</Col>
							<Col xs={6} md={4}>
								<h5>Visualization</h5>

								<MemorizedInsertionChart commands={insertionSortCommands.commands} callback={insertionSortButtonStateChanged}/>
							</Col>

							<Col xs={6} md={4}>
								<h5 style = {{marginLeft: '4rem'}}>Panel</h5>

								<Form style = {{marginLeft: '4rem'}} onSubmit={handleInsertionSortSubmit}>
									<Form.Group >
										<Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
											Number of elements to sort:
										</Form.Label>
										<Form.Control size="sm" as="select" ref={insertionInputValue}>
											<option value='10'>10</option>
											<option value='20'>20</option>
											<option value='50'>50</option>
											<option value='100'>100</option>
											<option value='200'>200</option>
											<option value='500'>500</option>

										</Form.Control>
									</Form.Group>
									<Button ref={insertionSortBtn} variant="success" type="submit"  block className = {`${sortBtnsState.insertion===insertionSort ? cancel:start}`}>
										{`${sortBtnsState.insertion===insertionSort ?'Cancel!':'Sort!'}`}
									</Button>
								</Form>
							</Col>
						</Row>
					</Container>

					<Container>
						<Row xs={2} md={14} lg={15}>
							<Col>
								<h3>Heap sort</h3>
							</Col>
						</Row>

						<p>In computer science, heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. Unlike selection sort, heapsort does not waste time with a linear-time scan of the unsorted region; rather, heap sort maintains the unsorted region in a heap data structure to more quickly find the largest element in each step</p>
						<p>Heapsort is an in-place algorithm, but it is not a stable sort.</p>

						<Row>
							<Col xs={6} md={4}>
								<h5>Complexity:</h5>
								<p style={{marginLeft:'-4rem'}}><MathComponent  tex={String.raw` O (n\log _{\text{n}}) `} /></p>
							</Col>
							<Col xs={6} md={4}>
								<h5>Visualization</h5>

								<MemorizedHeapChart commands={heapSortCommands.commands} callback={heapSortButtonStateChanged}/>
							</Col>

							<Col xs={6} md={4}>
								<h5 style = {{marginLeft: '4rem'}}>Panel</h5>

								<Form style = {{marginLeft: '4rem'}} onSubmit={handleHeapSortSubmit}>
									<Form.Group >
										<Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
											Number of elements to sort:
										</Form.Label>
										<Form.Control size="sm" as="select" ref={heapInputValue}>
											<option value='10'>10</option>
											<option value='20'>20</option>
											<option value='50'>50</option>
											<option value='100'>100</option>
											<option value='200'>200</option>
											<option value='500'>500</option>

										</Form.Control>
									</Form.Group>
									<Button ref={heapSortBtn} variant="success" type="submit"  block className = {`${sortBtnsState.heap===heapSort ? cancel:start}`}>
										{`${sortBtnsState.heap===heapSort ?'Cancel!':'Sort!'}`}
									</Button>
								</Form>
							</Col>
						</Row>
					</Container>



					<Container>
						<Row xs={2} md={14} lg={15}>
							<Col>
								<h3>Quick sort</h3>
							</Col>
						</Row>

						<p>In computer science, heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. Unlike selection sort, heapsort does not waste time with a linear-time scan of the unsorted region; rather, heap sort maintains the unsorted region in a heap data structure to more quickly find the largest element in each step</p>
						<p>Heapsort is an in-place algorithm, but it is not a stable sort.</p>

						<Row>
							<Col xs={6} md={4}>
								<h5>Complexity:</h5>
								<p style={{marginLeft:'-4rem'}}><MathComponent  tex={String.raw` O (n\log _{\text{n}}) `} /></p>
							</Col>
							<Col xs={6} md={4}>
								<h5>Visualization</h5>

								<MemorizedQuickChart commands={quickSortCommands.commands} callback={quickSortButtonStateChanged}/>
							</Col>

							<Col xs={6} md={4}>
								<h5 style = {{marginLeft: '4rem'}}>Panel</h5>

								<Form style = {{marginLeft: '4rem'}} onSubmit={handleQuickSortSubmit}>
									<Form.Group >
										<Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
											Number of elements to sort:
										</Form.Label>
										<Form.Control size="sm" as="select" ref={quickInputValue}>
											<option value='10'>10</option>
											<option value='20'>20</option>
											<option value='50'>50</option>
											<option value='100'>100</option>
											<option value='200'>200</option>
											<option value='500'>500</option>

										</Form.Control>
									</Form.Group>
									<Button ref={quickSortBtn} variant="success" type="submit"  block className = {`${sortBtnsState.quick===quickSort ? cancel:start}`}>
										{`${sortBtnsState.quick===quickSort ?'Cancel!':'Sort!'}`}
									</Button>
								</Form>
							</Col>
						</Row>
					</Container>


				</Modal.Body>
			</Modal>

			<Modal
				show={state.coco}
				onHide={onClose}
				style={style.mid}
				dialogClassName={`modal-dialog modal-xl ${theme}Text`}
				aria-labelledby="example-custom-modal-styling-title"
			>
				<Modal.Header closeButton className={`${theme}Modal ${theme}Text`}>
					<Modal.Title id="example-custom-modal-styling-title">
						COCO dataset parser
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className={`${theme}Modal ${theme}Text`}>
					<COCO/>
				</Modal.Body>
			</Modal>

		</>
	);
}

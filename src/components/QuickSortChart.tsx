import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {CommandsInterface, chartjsDataTemplate, generateColorsForChart} from '../interfaces/SortInterfaces';
import {sortingStore} from './ModalContent';
import {quickSort} from '../redux/SortingStateReducer';


class QuickSortChart extends Component<CommandsInterface>{
	private chartReference: React.RefObject<any>;
	private chart: any;
	private timer: any;
	private isSorting: boolean;
	private interrupt: boolean;
	private uselessRefresh: boolean;
	public state;
	public props: any;
	private timeouts:number[];
	private date: number;

	constructor(props: CommandsInterface) {
		super(props);

		this.state = chartjsDataTemplate();

		this.chartReference = React.createRef<any>();

		this.timer = 0;

		this.isSorting = false;

		this.interrupt = false;

		this.date = 0;

		this.uselessRefresh = false;

		this.timeouts = [];

	}

	partition(data:number[], start:number, end:number){
		const pivot = data[start];
		let low = start + 1;
		let high = end;

		for(;;){

			while(low<=high && data[high]>=pivot){
				high-=1;
			}
			while(low<=high && data[high]<=pivot){
				low+=1;
			}

			if(low<=high){
				[data[low], data[high]] = [data[high], data[low]];
			}else{
				break;
			}
		}
		[data[start], data[high]] =[data[high], data[start]];
		return high;
	}




	quickSort(array:number[], fst=0, lst= array.length-1){

		if (fst >= lst) return;
		let [i, j] = [fst, lst];
		const labels = this.chart.data.labels;
		const colors = this.chart.data.datasets[0].backgroundColor;
		const pivot = array[Math.round(fst - 0.5 + Math.random() * (lst - fst + 1))];

		while (i <= j){
			let timeout = 0;

			timeout += 100;
			const theTimeout = this.updateChartDelayed(labels.slice(0), array.slice(0), colors.slice(0), timeout);
			this.timeouts.push(theTimeout);
			while (array[i] < pivot) i += 1;
			while (array[j] > pivot) j -= 1;

			if (i <= j){
				[array[i], array[j]] = [array[j], array[i]];
				[labels[i], labels[j]] = [labels[j],labels[i]];
				[colors[i], colors[j]] = [colors[j],colors[i]];
				[i, j] = [i + 1, j - 1];
				const theTimeout = this.updateChartDelayed(labels.slice(0), array.slice(0), colors.slice(0), timeout);
				this.timeouts.push(theTimeout);
			}

		}


		this.quickSort(array, fst, j);
		this.quickSort(array, i, lst);
	}


	equals = (a:number[], b:number[]) => JSON.stringify(a) === JSON.stringify(b);

	componentDidMount(){

		this.chart = this.chartReference.current.chartInstance;
	}


	updateChartDelayed(labels: string[], data:number[], colors:string[], timeout:number) {


		this.timer = setTimeout(() => {

			const now = new Date().getTime();
			const timeDifference  = now - this.date;
			const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
			const mins = timeDifference /60000;
			const mils = Math.floor((timeDifference % (1000 * 60)) / 1);

			this.chart.data.datasets[0].label =  `${mins.toString().substr(0,1)}m ${seconds}s ${mils.toString().substr(-3)}ms`  ;
			this.chart.data.labels = labels;
			this.chart.data.datasets[0].data = data;
			this.chart.data.datasets[0].backgroundColor = colors;
			this.chart.update();

			const eth = [...this.chart.data.datasets[0].data].sort((x,y)=> x-y);
			if( eth.toString() === this.chart.data.datasets[0].data.toString()) {
				this.props.callback();
			}


		}, timeout);



		return this.timer;
	}

	componentWillUnmount() {
		clearInterval(this.timer);

	}


	clearAllTimeouts(){
		for(const timeout in this.timeouts){
			clearInterval(this.timeouts[timeout]);
		}
		this.timeouts=[];
	}

	refreshChart(){
		//console.log(this.props.commands.arrayLength);
		const temporaryDataToSort = chartjsDataTemplate();
		temporaryDataToSort.datasets[0].data = Array.from({length: this.props.commands.arrayLength}, () => Math.floor(Math.random() * 1000));
		temporaryDataToSort.labels = Array.from({ length: this.props.commands.arrayLength }, (_, i) => (i+1).toString());
		[temporaryDataToSort.datasets[0].backgroundColor, temporaryDataToSort.datasets[0].borderColor] = generateColorsForChart(this.props.commands.arrayLength, 0.4);

		//console.log(temporaryDataToSort.datasets[0].data);
		this.setState(temporaryDataToSort);
	}

	checkIfSorted(chart:number[]){
		const $chart = chart;
		return $chart.every((v,i,a) => !i || a[i-1] <= v);

	}
	//this.quickSort(this.chart.data.datasets[0].data, 0,this.chart.data.datasets[0].data.length-1)
	componentDidUpdate(prevProps:CommandsInterface) {

		console.log('Quick TRIGGERED!');

		if(prevProps!==this.props) {

			this.date = new Date(Date.now()).getTime();

			this.clearAllTimeouts();

			if(this.checkIfSorted(this.chart.data.datasets[0].data))
			{
				this.clearAllTimeouts();
				this.refreshChart();
				setTimeout(() => {
					this.quickSort(this.chart.data.datasets[0].data, 0,this.chart.data.datasets[0].data.length-1);}, 800);
			}
			else if (this.props.commands.StopSort) {

				this.clearAllTimeouts();
			}

			else if (this.props.commands.name !== prevProps.commands.name && this.props.commands.arrayLength !== prevProps.commands.arrayLength) {

				this.clearAllTimeouts();
				this.refreshChart();
				setTimeout(() => {
					this.quickSort(this.chart.data.datasets[0].data, 0,this.chart.data.datasets[0].data.length-1);
				}, 800);
			} else if (this.props.commands.name !== prevProps.commands.name) {

				this.quickSort(this.chart.data.datasets[0].data, 0,this.chart.data.datasets[0].data.length-1);
			} else if (this.props.commands.arrayLength !== prevProps.commands.arrayLength) {

				this.refreshChart();
				this.clearAllTimeouts();
				setTimeout(() => {
					this.quickSort(this.chart.data.datasets[0].data, 0,this.chart.data.datasets[0].data.length-1);
				}, 800);

			} else if (this.props.commands.arrayLength === prevProps.commands.arrayLength) {

				this.refreshChart();
				this.clearAllTimeouts();
				setTimeout(() => {
					this.quickSort(this.chart.data.datasets[0].data, 0,this.chart.data.datasets[0].data.length-1);
				}, 800);
			}



		}

	}

	render(){
		return(
			<div>
				<Bar data={this.state} width={100} height={50} options={{
					legend: {
						display: true,
						position: 'top',
						labels: {
							boxWidth: 0,
						}
					}

				}} ref={this.chartReference}/>
			</div>
		);

	}


}
export const MemorizedQuickChart = React.memo(QuickSortChart);

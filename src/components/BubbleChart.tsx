import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import {CommandsInterface, chartjsDataTemplate, generateColorsForChart} from '../interfaces/SortInterfaces';
import {sortingStore} from './ModalContent';
import {bubbleSort} from '../redux/SortingStateReducer';


class BubbleChart extends Component<CommandsInterface> {
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

		this.date =0;


		this.uselessRefresh = false;
		this.timeouts = [];

	}


	bubbleSort() {
		const labels = this.chart.data.labels;
		const data = this.chart.data.datasets[0].data;
		const colors = this.chart.data.datasets[0].backgroundColor;
		let swapped;
		let timeout = 0;

		do {
			swapped = false;
			for (let i = 0; i < data.length; i++) {
				if (data[i] > data[i + 1]) {

					[labels[i], labels[i+1]] = [labels[i+1], labels[i]];
					[data[i], data[i+1]] = [data[i+1], data[i]];
					[colors[i], colors[i+1]] = [colors[i+1], colors[i]];

					timeout += 100;
					const theTimeout = this.updateChartDelayed(labels.slice(0), data.slice(0), colors.slice(0), timeout);
					this.timeouts.push(theTimeout);
					swapped = true;
				}
			}
		} while (swapped);

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

			this.isSorting = true;
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
		const temporaryDataToSort = chartjsDataTemplate();
		temporaryDataToSort.datasets[0].data = Array.from({length: this.props.commands.arrayLength}, () => Math.floor(Math.random() * 1000));
		temporaryDataToSort.labels = Array.from({ length: this.props.commands.arrayLength }, (_, i) => (i+1).toString());
		[temporaryDataToSort.datasets[0].backgroundColor, temporaryDataToSort.datasets[0].borderColor] = generateColorsForChart(this.props.commands.arrayLength, 0.4);
		this.setState(temporaryDataToSort);
	}


	checkIfSorted(chart:number[]){
		const $chart = chart;
		return $chart.every((v,i,a) => !i || a[i-1] <= v);

	}

	componentDidUpdate(prevProps:CommandsInterface) {

		console.log('Bubble TRIGGERED!');

		if(prevProps!==this.props) {

			this.date = new Date(Date.now()).getTime();

			this.clearAllTimeouts();

			if(this.checkIfSorted(this.chart.data.datasets[0].data))
			{
				this.clearAllTimeouts();
				this.refreshChart();
				setTimeout(() => {
					this.bubbleSort();}, 800);
			}
			else if (this.props.commands.StopSort) {

				this.clearAllTimeouts();
			}

			else if (this.props.commands.name !== prevProps.commands.name && this.props.commands.arrayLength !== prevProps.commands.arrayLength) {

				this.clearAllTimeouts();
				this.refreshChart();
				setTimeout(() => {
					this.bubbleSort();
				}, 800);
			} else if (this.props.commands.name !== prevProps.commands.name) {

				this.bubbleSort();
			} else if (this.props.commands.arrayLength !== prevProps.commands.arrayLength) {

				this.refreshChart();
				this.clearAllTimeouts();
				setTimeout(() => {
					this.bubbleSort();
				}, 800);

			} else if (this.props.commands.arrayLength === prevProps.commands.arrayLength) {

				this.refreshChart();
				this.clearAllTimeouts();
				setTimeout(() => {
					this.bubbleSort();
				}, 800);
			}



		}

	}


	render() {
		return (
			<div><Bar data={this.state} width={100} height={50} options={{
				legend: {
					display: true,
					position: 'top',
					labels: {
						boxWidth: 0,
					}
				}

			}} ref={this.chartReference}/></div>
		);

	}
}

export const MemorizedBubbleChart = React.memo(BubbleChart);

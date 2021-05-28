import React from 'react';
//import * as React from 'react';
import {CommandsInterface, randomColor} from '../interfaces/SortInterfaces';
import {OverlayTrigger, Tooltip, Row} from 'react-bootstrap';
import {ReactDOM} from 'react';

interface bbox{
	box: number[],
	category:string
}
interface segment{
	segments: number[]
}

interface segments{
	area: number,
	segments: number[][],
	category:string
}


interface props{
	props: {
		Image:{
		filename: string,
		url: string,
		height: number,
		width: number,
		info: {
			bboxes: bbox[],
			segments: any
		},
		showBboxes: boolean,
		showKeypoints: boolean
	}
	}
}
interface stateInterface{
	bboxes:number[][],
	segments: number[][][],
	descriptions:string[]
}

export class DrawCOCOimage extends React.Component<props, any>{
	public canvas:any;
	public canvasForeground:any;
	private imageHasBeenLoaded: boolean;
	public tooltipRef:any;
	private data:stateInterface;
	private hColors: string[];
	constructor(props: any) {
		super(props);
		this.hColors = Array.from({length: 150}, () => `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.4`);
		this.tooltipRef = React.createRef();
		this.imageHasBeenLoaded = false;
		this.data = { bboxes:[], segments:[], descriptions:[]};

	}

	componentDidMount() {
		this.updateImage();
	}

	handleMouse(e:any){
		const ctx = this.canvasForeground.getContext('2d');
		const rect = this.canvasForeground.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		let box;
		ctx.clearRect(0, 0, this.canvasForeground.width, this.canvasForeground.height);
		let i = 0;

		if(this.props.props.Image.showBboxes && this.props.props.Image.showKeypoints && this.imageHasBeenLoaded) {
			let segment;
			while (i < this.data.bboxes.length) {
				ctx.beginPath();
				box = this.data.bboxes[i];
				segment = this.data.segments[i];

				ctx.rect(box[0], box[1], box[2], box[3]);
				const RGBA = this.hColors[i].substr(0, this.hColors[i].length - 4) + ' 0.2)';
				if (ctx.isPointInPath(x, y)) {
					ctx.fillStyle = RGBA;
					this.tooltipRef.current.innerText = this.data.descriptions[i];
				} else {
					ctx.fillStyle = this.hColors[i];
				}
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				for(let z = 0; z < segment.length; z++) {

					ctx.moveTo(segment[z][0], segment[z][1]);

					for (let y = 0; y < segment[z].length; y += 2) {
						ctx.lineTo(segment[z][y], segment[z][y + 1]);
					}
					ctx.lineTo(segment[z][0], segment[z][1]);
					ctx.lineWidth = 8;
					ctx.stroke();

				}

				ctx.fill();
				ctx.closePath();
				i++;
			}

		}else if(this.props.props.Image.showBboxes && this.imageHasBeenLoaded){
			while (i < this.data.bboxes.length) {
				ctx.beginPath();
				box = this.data.bboxes[i];
				ctx.rect(box[0], box[1], box[2], box[3]);
				const RGBA = this.hColors[i].substr(0, this.hColors[i].length - 4) + ' 0.2)';
				if (ctx.isPointInPath(x, y)) {
					ctx.fillStyle = RGBA;
					this.tooltipRef.current.innerText = this.data.descriptions[i];
				} else {
					ctx.fillStyle = this.hColors[i];
				}
				ctx.fill();
				ctx.closePath();
				i++;
			}

		}else if(this.props.props.Image.showKeypoints && this.imageHasBeenLoaded){

			let segment;
			let i = 0;

			while (i < this.data.segments.length) {

				ctx.beginPath();
				const RGBA = this.hColors[i].substr(0, this.hColors[i].length - 4) + ' 0.2)';
				segment = this.data.segments[i];

				for(let z = 0; z < segment.length; z++) {

					ctx.moveTo(segment[z][0], segment[z][1]);

					for (let y = 0; y < segment[z].length; y += 2) {
						ctx.lineTo(segment[z][y], segment[z][y + 1]);
					}
					ctx.lineTo(segment[z][0], segment[z][1]);
					ctx.lineWidth = 8;
					ctx.stroke();

				}
				if (ctx.isPointInPath(x, y)) {
					ctx.fillStyle = RGBA;
					this.tooltipRef.current.innerText = this.data.descriptions[i];

				} else {
					ctx.fillStyle = this.hColors[i];
				}
				ctx.stroke();
				ctx.fill();
				ctx.closePath();
				i++;
			}

		}
	}


	updateImage(){
		this.imageHasBeenLoaded = false;
		const bboxes:number[][]=[];
		const descriptions:string[] = [];
		const imageObj1 = new Image();
		imageObj1.src = this.props.props.Image.url;
		imageObj1.onload = ()=> {

			const ctx = this.canvas.getContext('2d');
			const ctxForeground = this.canvasForeground.getContext('2d');
			ctx.drawImage(imageObj1, 0, 0);

			if(this.props.props.Image.showBboxes && this.props.props.Image.showKeypoints) {
				const segments:number[][][] = [];

				ctxForeground.clearRect(0, 0, this.props.props.Image.width, this.props.props.Image.height);
				this.props.props.Image.info.bboxes.forEach((bbox: any, index) => {
					const fillColor = this.hColors[index];
					bboxes.push(bbox.box);
					descriptions.push(bbox.category);
					ctxForeground.fillStyle = fillColor;
					ctxForeground.fillRect(bbox.box[0], bbox.box[1], bbox.box[2], bbox.box[3]);
				});

				this.props.props.Image.info.segments.forEach((segment:any, index:number)=> {

					const segmentData = segment.segments;
					const subSegmenedToSegment= [];
					for (let z = 0; z < segmentData.length; z++) {
						subSegmenedToSegment.push(segmentData[z]);
						if (descriptions.length === 0) {
							descriptions.push(segment.category);
						}
						ctxForeground.beginPath();
						ctxForeground.moveTo(segmentData[z][0], segmentData[z][1]);

						for (let i = 2; i < segmentData[z].length; i += 2) {

							ctxForeground.lineTo(segmentData[z][i], segmentData[z][i + 1]);

						}
						ctxForeground.lineTo(segmentData[z][0], segmentData[z][1]);
						ctxForeground.lineWidth = 8;
						ctxForeground.stroke();
						ctxForeground.fillStyle = this.hColors[index];
						ctxForeground.fill();
						ctxForeground.beginPath();
					}

					segments.push(subSegmenedToSegment);
				});

				this.data = { bboxes: bboxes, segments: segments, descriptions: descriptions };

			}else if(this.props.props.Image.showBboxes){

				ctxForeground.clearRect(0, 0, this.props.props.Image.width, this.props.props.Image.height);
				this.props.props.Image.info.bboxes.forEach((bbox: any, index) => {
					const fillColor = this.hColors[index];
					bboxes.push(bbox.box);
					descriptions.push(bbox.category);
					ctxForeground.fillStyle = fillColor;
					ctxForeground.fillRect(bbox.box[0], bbox.box[1], bbox.box[2], bbox.box[3]);
				});

				this.data = { bboxes: bboxes, segments: this.data.segments, descriptions: descriptions };

			}else if(this.props.props.Image.showKeypoints){

				const segments:number[][][] = [];
				ctxForeground.clearRect(0, 0, this.props.props.Image.width, this.props.props.Image.height);

				this.props.props.Image.info.segments.forEach((segment:any, index:number)=> {

					descriptions.push(this.props.props.Image.info.segments[index].category);
					const segmentData = segment.segments;
					const subSegmenedToSegment= [];
					for (let z = 0; z < segmentData.length; z++) {
						subSegmenedToSegment.push(segmentData[z]);
						ctxForeground.beginPath();
						ctxForeground.moveTo(segmentData[z][0], segmentData[z][1]);

						for (let i = 0; i < segmentData[z].length; i += 2) {

							ctxForeground.lineTo(segmentData[z][i], segmentData[z][i + 1]);

						}
						ctxForeground.lineTo(segmentData[z][0], segmentData[z][1]);

						ctxForeground.lineWidth = 8;
						ctxForeground.stroke();
						ctxForeground.fillStyle = this.hColors[index];
						ctxForeground.fill();
						ctxForeground.closePath();

					}

					segments.push(subSegmenedToSegment);
				});
				this.data = { bboxes: this.data.bboxes, segments: segments, descriptions: descriptions };
			}

			else{
				ctxForeground.clearRect(0,0,this.props.props.Image.width,this.props.props.Image.height);
			}

			this.imageHasBeenLoaded=true;
		};
	}


	componentDidUpdate(prevProps:props) {

		if(this.props.props.Image.showBboxes===true){

			this.updateImage();
		}else{

			this.updateImage();
		}

		if(this.props.props.Image.showKeypoints===true){

			this.updateImage();
		}else{

			this.updateImage();
		}

	}

	render() {
		return (
			<Row style={{ width: `${this.props.props.Image.width}px`, height: `${this.props.props.Image.height}px`}}>
				{/*<Row>*/}
				<OverlayTrigger placement={'bottom'} overlay={ <Tooltip style={{marginTop: '6vh'}} id="tooltip-disabled"><i ref={this.tooltipRef}> </i></Tooltip> } >
					<div className={'canvasStack'}  style={{ display: 'flex', width: `${this.props.props.Image.width}px`}}>
						<canvas style={{zIndex:1, objectFit: 'contain', width: '100%'}}   ref={(canvas)=>this.canvas=canvas} width={this.props.props.Image.width} height={this.props.props.Image.height}> </canvas>
						{/*<canvas style={{top: 0, objectFit: 'contain', width: '100%',zIndex:2, marginLeft:`-${this.props.props.Image.width}px`}} onMouseMove={this.handleMouse.bind(this)} ref={(canvas)=>this.canvasForeground=canvas} width={this.props.props.Image.width} height={this.props.props.Image.height}></canvas>*/}
						<canvas style={{top: 0, objectFit: 'contain', width: '100%',zIndex:2}} onMouseMove={this.handleMouse.bind(this)} ref={(canvas)=>this.canvasForeground=canvas} width={this.props.props.Image.width} height={this.props.props.Image.height}></canvas>
					</div>
				</OverlayTrigger>
			</Row>
		);
	}
}

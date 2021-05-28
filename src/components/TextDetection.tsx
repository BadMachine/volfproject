import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {txtDetectionState} from '../interfaces/stateInterfaces';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
// import {loadGraphModel,} from '@tensorflow/tfjs-converter';
import {Form} from 'react-bootstrap';
import axios from 'axios';

export class TextDetection extends React.Component<any, txtDetectionState>{
	private canva: any;
	private imageLoaderConfigs:any;
	private viewPortImage:HTMLImageElement;

	constructor(props:any) {
		super(props);
		this.state;
		this.viewPortImage = new Image();

	}


	loadCanvas(){
		const ctx = this.canva.getContext('2d');
		this.viewPortImage.src = './COCO_train2014_000000004172.jpg';
		this.viewPortImage.onload = ()=>{
			ctx.drawImage(this.viewPortImage,0,0);
		};
	}

	load_model() {
		loadGraphModel('./models/web_model/model.json')
			.then((model)=>{
				console.log(model);
				return model;
			})
			.catch((err)=>{
				console.log(err);
			});
		// const model = await loadGraphModel('./models/text_in_context/model.json');
		// const model = await loadGraphModel('http://localhost:8800/model.json');
		//return model;
	}


	componentDidMount() {
		this.loadCanvas();
		this.load_model();
		// this.load_model().then((model)=>{
		// 	console.log(model);
		// });
	}

	loadImage(event: any){
		const files = event.target.files;
		const file = files[0];
		if(file.type.match('image.*')) {
			const ctx = this.canva.getContext('2d');
			const img = new Image();
			const reader = new FileReader();
			const image = this.viewPortImage;
			reader.readAsDataURL(file);
			reader.onload = function(fileEvent){
				if(fileEvent.target!==null) {
					if (fileEvent.target.readyState == FileReader.DONE) {
						image.src = fileEvent.target.result as string;
						ctx.drawImage(img,0,0);
					}
				}
			};

		}else{
			console.log('not an image');
		}
	}

	predict(){
		console.log('predicting');
		const predicted = axios.post('http://localhost:8800/predict_text',
			{image: this.canva.toDataURL().split(',')[1]},
			{responseType: 'json'});

		predicted.then((response)=>{
			console.log(response);
			const ctx = this.canva.getContext('2d');
			response.data.boxes.forEach((box: {minX: number, minY: number, maxX: number, maxY: number})=>{
				console.log(box.minX, box.minY, box.maxX, box.maxY);
				ctx.fillStyle = 'red';
				//ctx.fillRect(box.minX, box.maxY, box.maxY - box.minY, box.maxX - box.minX);

				ctx.beginPath();       // Начинает новый путь
				ctx.moveTo(box.minY, box.minX);    // Передвигает перо в точку (30, 50)
				ctx.lineTo(box.minY, box.maxX);  // Рисует линию до точки (150, 100)
				ctx.lineTo(box.maxY, box.maxX);  // Рисует линию до точки (150, 100)
				ctx.lineTo(box.maxY, box.minX);  // Рисует линию до точки (150, 100)
				ctx.lineTo(box.minY, box.minX);    // Передвигает перо в точку (30, 50)
				ctx.lineWidth = 4;
				ctx.strokeStyle = '#ff0000';
				ctx.stroke();          // Отображает путь
				ctx.closePath();
			});
		});

	}


	render() {
		return(
			<div className={'tfTxtContainer'}>
				<div id={'imagesContainer'}>

				</div>

				<div id={'tfTxtWorkspace'}>
					<div id={'activeImage'}>
						<canvas width={640} height={427} ref={(canvas)=>this.canva=canvas} id={'input-canvas'}> </canvas>
					</div>

					<Form>
						<Form.Group>
							<Form.File onChange={(e: any)=> this.loadImage(e)} id="imageLoader" label="Your image" />
							<Button onClick={event => this.predict()} >Predict </Button>
						</Form.Group>
					</Form>
				</div>
			</div>
		);
	}
}

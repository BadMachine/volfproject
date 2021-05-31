import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {txtDetectionState} from '../interfaces/stateInterfaces';
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import {Point, BoundingBox} from '../utils';

// import {loadGraphModel,} from '@tensorflow/tfjs-converter';

import {Form} from 'react-bootstrap';
import axios from 'axios';

export class TextDetection extends React.Component<any, txtDetectionState>{
	private canva: any;
	private imageLoaderConfigs:any;
	private viewPortImage:HTMLImageElement;
	private EAST_model: Promise<tf.GraphModel>;
	private testImagesPool: string[];
	constructor(props:any) {
		super(props);
		this.state;
		this.viewPortImage = new Image();
		this.EAST_model = loadGraphModel('./models/EAST/model.json');
		this.testImagesPool = [];

	}


	loadCanvas(){
		const ctx = this.canva.getContext('2d');
		this.viewPortImage.src = './ba3b72978701a64426e31f0c2c4887c9.jpg';
		this.viewPortImage.onload = ()=>{
			ctx.drawImage(this.viewPortImage,0,0);
		};
	}



	componentDidMount() {
		this.loadCanvas();
		this.EAST_model.then((result)=>{
			const ctx = this.canva.getContext('2d');
			let image = tf.browser.fromPixels(this.viewPortImage, 3);
			image = tf.reverse(image, -1);
			let [W, H] = [image.shape[0], image.shape[1]];
			const [newH, newW] = [320, 320];
			const rW = W / newW;
			const rH = H / newH;
			image = tf.image.resizeBilinear(image, [newH, newW]).cast('int32');
			//image.print();
			image = image.cast('float32');
			[H, W] = [image.shape[0], image.shape[1]];
			// const mean = tf.tensor1d([103.939, 116.779, 123.68], 'float32');
			const mean = tf.tensor1d([123.68, 116.78, 103.94], 'float32');
			//image.print();
			image = image.sub(mean);
			//image.print();
			image = image.expandDims(0);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			let [scores, geometry] = result.predict(image);
			//console.log(`scores: ${scores.dataSync()[1]}, geometry: ${geometry}`);
			scores = tf.transpose(scores, [0, 3, 1, 2]);
			geometry = tf.transpose(geometry, [0, 3, 1, 2]);

			const [numRows, numCols] = scores.shape.slice(2,4);
			scores = scores.arraySync();
			geometry = geometry.arraySync();

			const rects = [];
			const confidences = [];
			const detections = [];
			for(let y = 0; y < numRows; y++) {
				const scoresData = scores[0][0][y];
				const x0Data = geometry[0][0][y];
				const x1Data = geometry[0][1][y];
				const x2Data = geometry[0][2][y];
				const x3Data = geometry[0][3][y];
				const anglesData = geometry[0][4][y];

				for (let x = 0; x < numCols; x++){
					if (scoresData[x] < 0.5) {
						continue;
					}

					// compute the offset factor as our resulting feature maps will
					// be 4x smaller than the input image
					const [offsetX, offsetY] = [x * 4.0, y * 4.0];
					const angle = anglesData[x];

					// Calculate cos and sin of angle
					const cosA = Math.cos(angle);
					const sinA = Math.sin(angle);
					// use the geometry volume to derive the width and height of
					// the bounding box
					const h = x0Data[x] + x2Data[x];
					const w = x1Data[x] + x3Data[x];

					// compute both the starting and ending (x, y)-coordinates for
					// the text prediction bounding box
					const endX = ~~(offsetX + (cosA * x1Data[x]) + (sinA * x2Data[x]));
					const endY = ~~(offsetY - (sinA * x1Data[x]) + (cosA * x2Data[x]));
					const startX = ~~(endX - w);
					const startY = ~~(endY - h);


					const offset =  [offsetX + cosA * x1Data[x] + sinA * x2Data[x], offsetY - sinA * x1Data[x] + cosA * x2Data[x]]  as number[];
					// Find points for rectangle
					const p1 = [ -sinA * h + offset[0], -cosA * h + offset[1] ];
					const p3 = [ -cosA * w + offset[0],  sinA * w + offset[1] ];
					const center = [ 0.5*(p1[0]+p3[0]), 0.5*(p1[1]+p3[1]) ];

					const p1x = -cosA * w + offsetX;
					const p1y = -cosA * h + offsetY;
					const p3x = -sinA * h + offsetX;
					const p3y = sinA * w + offsetY;


					rects.push([startX, startY, endX, endY]);
					detections.push(new BoundingBox(new Point(center[0], center[1]), w, h, -1*angle * 180.0 / Math.PI, rH, rW) );
					confidences.push(scoresData[x]);
				}

			}
			const rectsTensor = tf.tensor2d(rects);
			// apply non-maxima suppression to suppress weak, overlapping bounding boxes
			const boxes = tf.image.nonMaxSuppression(rectsTensor, confidences, 100, 0.3, 0.5).arraySync();
			const detectionsFilterd = detections.filter( (detection, index) => boxes.includes(index));

			detectionsFilterd.forEach((detected) =>{
				detected.drawRotatedBoxes(detected.boxPoints, this.canva);
			});


		});

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
						<canvas width={640} height={426} ref={(canvas)=>this.canva=canvas} id={'input-canvas'}> </canvas>
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

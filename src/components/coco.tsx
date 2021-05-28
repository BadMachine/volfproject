import React, {Component, useContext} from 'react';
import {Button, Col, Container, Form, Modal, Row, Badge} from 'react-bootstrap';
import {Figure, Image, Accordion, Card} from 'react-bootstrap';
import {DrawCOCOimage} from './drawCOCOimage';
import {getRandomCocoExample, getFilteredCocoExample} from './cocoParser';
import {ThemeContext} from './context/themeContext';
import ReactJson from 'react-json-view';
import XMLViewer from 'react-xml-viewer';
import {NIGHT} from '../interfaces/stateInterfaces';
import {ClassesCOCO} from './classesCOCO';
import {filterData} from '../interfaces/cocoData';
import {xmlExample} from './configs/xmlExample';
import API from '../interfaces/API';
import {outputDataJsonFormat} from '../interfaces/cocoData';


export function COCO () {
	const {theme} = useContext(ThemeContext);
	const [randomCOCOimage, setRandomCOCOimage] = React.useState({Image: getRandomCocoExample()});
	const imageRef = React.useRef<any>();
	const bboxCheckbox = React.useRef<any>();
	const segmentCheckbox = React.useRef<any>();
	const SERVER_API = new API('http://localhost',8800);

	function changeImage(filter?: filterData){ //function that changes image in viewport
		if(filter){
			const filteredExample = SERVER_API.getRandomSample(filter);
			setTimeout(() => {
				imageRef.current.style.pointerEvents = 'auto';
			}, 500);
			filteredExample.then(data=>{
				console.log(data);
				bboxCheckbox.current.checked = data.data.showBboxes;
				segmentCheckbox.current.checked = data.data.showKeypoints;
				setRandomCOCOimage({Image: data.data});

			});
		}else{
			const response = SERVER_API.getRandomSample();
			imageRef.current.style.pointerEvents = 'none';
			setTimeout(() => {
				imageRef.current.style.pointerEvents = 'auto';
			}, 500);
			let newRandom;
			response.then(data=>{
				newRandom = data.data;
				newRandom.showBboxes = randomCOCOimage.Image.showBboxes;
				newRandom.showKeypoints = randomCOCOimage.Image.showKeypoints;
				setRandomCOCOimage({Image: newRandom});
			});
		}
	}

	function showbboxes(){
		const tempRandomState = randomCOCOimage;
		tempRandomState.Image.showBboxes = !tempRandomState.Image.showBboxes;
		setRandomCOCOimage({Image:tempRandomState.Image});
	}


	function showKeypoints(){
		const tempRandomState = randomCOCOimage;
		tempRandomState.Image.showKeypoints = !tempRandomState.Image.showKeypoints;
		setRandomCOCOimage({Image:tempRandomState.Image});
	}

	return(
		<Container>
			<Row id={'viewportMgn'}>
				<Col md="auto" style={{marginTop: '6vh'}}>
					<Row style={{marginTop: '-6vh'}}>
						<Form>
							<Form.Check style={{float:'left', marginLeft: '.5rem'}}
								ref={bboxCheckbox}
								onChange={()=>showbboxes()}
								type="switch"
								id="bboxes"
								label="Show bounding boxes"
							/>
							<Form.Check style={{float:'left', marginLeft: '.5rem'}}
								ref={segmentCheckbox}
								onChange={()=>showKeypoints()}
								type="switch"
								id="keypoints"
								label="Show keypoints"
							/>
						</Form>
					</Row>
					<Figure ref={imageRef} onClick={()=>changeImage()}>
						<DrawCOCOimage props={randomCOCOimage}/>
						{/*<Figure.Caption>*/}
						{/*	Created sample*/}
						{/*</Figure.Caption>*/}
					</Figure>
				</Col>
				<Col className={'filterMenu'} xs={12} md={6} >
					<ClassesCOCO callback={changeImage}></ClassesCOCO>
				</Col>
			</Row>

			<br></br>
			<br></br>

			<Accordion >
				<Card style={theme===NIGHT? {backgroundColor: '#1F1F1F'}:{backgroundColor:'#fff'}}>
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="0">
							Export format information
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="0">
						<Card.Body>

							<Row>
								<Col xs={5} md={7}>
									<h6>Default export format:</h6>

									<Col xs={8} md={14} style={{ fontWeight: 'bold' }}>

										<ReactJson
											style={theme===NIGHT? {backgroundColor: '#1F1F1F'}:{backgroundColor:'#fff'}}
											iconStyle={'triangle'}
											indentWidth={2}
											displayDataTypes={false}
											enableClipboard={false}
											displayObjectSize={false}
											onEdit={false}
											onAdd={false}
											theme={theme===NIGHT? 'twilight':'bright:inverted'}
											src={outputDataJsonFormat}
										/>

									</Col>

								</Col>
								<Col style={{marginLeft: '1.5rem'}} xs={16} md={4}>
									<h6>VOC export format: </h6>

									<XMLViewer xml={xmlExample}  theme={ theme===NIGHT?{textColor:'white'}:{textColor:'black'}}/>
									{/*'#fff'*/}
								</Col>
								{/*<Col xs={6} md={4}>*/}
								{/*		.col-xs-6 .col-md-4*/}
								{/*</Col>*/}
							</Row>

						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card style={theme===NIGHT? {backgroundColor: '#1F1F1F'}:{backgroundColor:'#fff'}}>
					<Card.Header>
						<Accordion.Toggle as={Button} variant="link" eventKey="1">
							Extra
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="1">
						<Card.Body>Hello! Im another body</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>

		</Container>
	);


}

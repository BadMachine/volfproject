import React, {Component, useContext} from 'react';
import {Accordion, Badge, Card, Col, Form, Button, Spinner} from 'react-bootstrap';
import {classes, parseSubCategories} from './cocoParser';
import {Typeahead} from 'react-bootstrap-typeahead';
import axios from 'axios';
import {ThemeContext} from './context/themeContext';
import {filterData, subClassesStateInterface, filterInit} from '../interfaces/cocoData';
import {callbackProp} from '../interfaces/PropsInterfaces';
import download from 'js-file-download';
import API from '../interfaces/API';

export class ClassesCOCO extends Component<callbackProp>{
	public state: subClassesStateInterface;
	public superCategoriesRef = React.createRef<any>();
	private exportBtn = React.createRef<any>();
	static contextType = ThemeContext;
	private theme: {theme:string};
	public filter: filterData;
	private API: API;
	constructor(props:callbackProp) {
		super(props);
		this.filter = filterInit;
		this.state = {subclasses: [''], badges: [], exportPending: false};
		this.theme = this.context;
		this.API = new API('http://localhost', 8800);
	}


	componentDidMount() {
		this.theme = this.context.theme;
		this.exportBtn.current.disabled = true;
		this.setState((previousState: subClassesStateInterface)=>{

			return {
				subclasses :parseSubCategories('all'),
				badges: [],
				exportPending: previousState.exportPending
			};
		});
	}

	appendSubclasses(){
		const superClassValue = this.superCategoriesRef.current.value;
		this.setState((previousState: subClassesStateInterface)=>{
			return {
				subclasses: parseSubCategories(superClassValue),
				badges: [],
				exportPending: previousState.exportPending
			};
		});

	}

	appendBadges(e:string[]){
		const badge = e[0];
		const prevBadges = this.state.badges;
		if(!prevBadges.includes(badge) && badge!==undefined) {
			prevBadges.push(badge);
			this.setState((previousState: subClassesStateInterface)=>{
				return {
					subclasses: previousState.subclasses,
					badges: prevBadges,
					exportPending: previousState.exportPending
				};
			});

		}
	}

	removeBadge(e:any){
		e.preventDefault();
		const prevState = this.state;
		prevState.badges = prevState.badges.filter(item => item !== e.currentTarget.textContent);
		this.setState(prevState);
	}


	filterPreview=(e:any)=>{

		e.preventDefault();
		const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());

		this.filter = {
			superclass: this.superCategoriesRef.current.value,
			subclasses: this.state.badges.length===0? [] : this.state.badges,
			image: {
				width: +formDataObj.maxImageWidth,
				height: +formDataObj.maxImageHeight
			},
			bboxes:{
				maxWidth: +formDataObj.maxBboxWidth,
				maxHeight: +formDataObj.maxBboxHeight,
				minWidth: +formDataObj.minBboxWidth,
				minHeight: +formDataObj.minBboxHeight
			},
			path: formDataObj.path as string,
			only: +formDataObj.only
		};

		this.props.callback(this.filter);
		this.exportBtn.current.disabled = false;

	}

	makerequest(e:any){
		e.preventDefault();
		this.exportBtn.current.disabled = true;
		this.setState((previousState: subClassesStateInterface)=>{
			return {
				subclasses: previousState.subclasses,
				badges: previousState.badges,
				exportPending: true
			};
		});

		const XMLExport = e.target.elements['voc-export'].checked;

		// axios.post('http://localhost:8800/import_based_on_request',{...this.filter, exportToXML: XMLExport},
		// 	{responseType: 'arraybuffer'}
		// )

		this.API.requestDataset(XMLExport, this.filter).then(res => {
			const result = new Blob([res.data], {type: 'application/octet-stream'});
			download(result, 'annotations.zip');

		}).catch((error)=>{
			console.log(`Something went wrong on server ${error}`);
		}).finally(()=>{
			this.exportBtn.current.disabled = false;
			this.setState((previousState: subClassesStateInterface)=>{
				return {
					subclasses: previousState.subclasses,
					badges: previousState.badges,
					exportPending: false
				};
			});

		});
	}


	render(){

		return(
			<Accordion defaultActiveKey="0" className={`${this.theme}Text`}>
				<Card className = 'overflowVisible'>
					<Accordion.Toggle  className={`${this.theme}AccordionHeader`} as={Card.Header} eventKey="0">
						Classes
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0">
						<Card.Body className={`${this.theme}AccordionBody`}>
							<Form>
								<Form.Group controlId="formBasicClasses">
									<p>Superclasses: </p>
									<Form.Control  size="sm" as="select" ref={this.superCategoriesRef} onChange={(e)=>{ this.appendSubclasses();} }>
										<option value='all'>all</option>
										{
											Object.keys(classes).map((item:any,it:number)=>{

												return <option key={it+1} value={item}>{item}</option>;

											})
										}
										)
									</Form.Control>
									<p></p>
									<p>Subclasses: </p>

								</Form.Group>

								<Typeahead
									id="toggle-example"
									options={this.state.subclasses}
									onChange={(e)=>{ this.appendBadges(e);}}
									placeholder="Subclasses...">
								</Typeahead>
								<br></br>
								{
									this.state?.badges.map((item,it)=>{

										return <Badge style={{marginLeft:'3px'}} onClick={(e:any)=>{this.removeBadge(e); }} key={it} variant="success">{item}</Badge>;
									})

								}

							</Form>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Accordion.Toggle  className={`${this.theme}AccordionHeader`} as={Card.Header} eventKey="1">
						Filters
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body className={`${this.theme}AccordionBody`}>
							<h6>Image properties:</h6>
							<br></br>

							<Form onSubmit={ event => this.filterPreview(event) }>
								<Form.Row>
									<p style={{marginLeft: '1rem'} }>Max image size:</p>
									<Col>
										<Form.Control name="maxImageWidth" size="sm" placeholder="width" />
									</Col>
									x
									<Col>
										<Form.Control name="maxImageHeight" size="sm" placeholder="height" />
									</Col>
								</Form.Row>
								<br></br>
								<h6 >Bounding boxes properties:</h6>
								<br></br>
								<Form.Row>
									<p style={{marginLeft: '1rem'} }>Max bounding box size:</p>
									<Col>
										<Form.Control name="maxBboxWidth" size="sm" placeholder="width" />
									</Col>
									x
									<Col>
										<Form.Control name="maxBboxHeight" size="sm" placeholder="height" />
									</Col>
								</Form.Row>

								<Form.Row>
									<p style={{marginLeft: '1rem'} }>Min bounding box size:</p>
									<Col>
										<Form.Control name="minBboxWidth" size="sm" placeholder="width" />
									</Col>
									x
									<Col>
										<Form.Control name="minBboxHeight" size="sm" placeholder="height" />
									</Col>
								</Form.Row>

								<br></br>

								<Form.Row>
									<br></br>
									<h6>Segmentation options:</h6>
									<Form.Row>
										<Form.Check inline
											name='only'
											value={1}
											type='radio'
											id='onlyBboxes'
											label='Only bounding boxes'
										/>
										<Form.Check inline
											name='only'
											value={2}
											type='radio'
											id='onlySegments'
											label='Only segments'
										/>
										<Form.Check inline
											defaultChecked={true}
											value={3}
											name='only'
											type='radio'
											id='both'
											label='Both'
										/>
									</Form.Row>
								</Form.Row>
								<br></br>


								<Form.Row>
									<br></br>
									<h6>Path:</h6>
									<Form.Control size="sm" name="path" type="text" placeholder="Path to folder where data gonna be saved" />
								</Form.Row>
								<br></br>
								<Form.Row>

									<Button type="submit" variant="success" block>Filter</Button>

								</Form.Row>

							</Form>

						</Card.Body>
					</Accordion.Collapse>
				</Card>


				<Card>
					<Accordion.Toggle className={`${this.theme}AccordionHeader`} as={Card.Header} eventKey="2">
						Export
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="2">
						<Card.Body className={`${this.theme}AccordionBody`}	>
							<Form onSubmit={ event => this.makerequest(event) }>
								<Form.Row>
									<Form.Check style={{marginLeft: '3rem'} }
										type="switch"
										id="voc-switch"
										name={'voc-export'}
										label="Export to VOC format"
									/>


								</Form.Row>
								<br></br>
								<Form.Row>
									<Button ref={this.exportBtn} name={'export-button'} type='sumbit' variant="success" block>

										{this.state.exportPending? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> : <></>}

										Export
									</Button>
								</Form.Row>

							</Form>

						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>

		);

	}
}



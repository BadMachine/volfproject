import React, {useContext, useState} from 'react';
import {Carousel, Modal} from 'react-bootstrap';
import Meta from '../meta.json';

import ProjectsContext from './ProjectsContext';
import ModalContext from 'react-bootstrap/ModalContext';
import {ThemeContext} from './context/themeContext';
type modalShow = (name: string)=>void;

export default function CarouselOfProjects({modalshow}:{modalshow: modalShow}){

	const rightArrowRef = React.createRef() as React.MutableRefObject<HTMLInputElement>;
	const leftArrowRef = React.createRef() as React.MutableRefObject<HTMLInputElement>;
	const {theme} = useContext(ThemeContext);

	function emitSlideOnWheel(event: React.WheelEvent){
		(event.deltaY/100>0) ?  rightArrowRef.current.click() : leftArrowRef.current.click();
	}

	function test(){
		console.log('CLICK');
	}



	const style ={
		inlineFlex:{
			display:'table-row-group',
		},
		zIndex10:{
			transform: 'translate(-0%,0%)',
			zIndex:1,
		},
	};


	return(

		<div className="NetworkOfProjects_div ">
			<Carousel nextIcon={<span ref={rightArrowRef} aria-hidden="true" className={`carousel-control-next-icon ${theme}Inverted`}/>}
				prevIcon={<span ref={leftArrowRef} aria-hidden="true" className={`carousel-control-prev-icon ${theme}Inverted`}/>}
				interval={15000}
				style={style.inlineFlex}
				// onSlide={}
			>

				{
					Meta.data.projects.map((item,it)=>{
						return <Carousel.Item key={it}>
							<img
								className="d-block w-100"
								src={process.env.PUBLIC_URL+item.background}
								alt={item.name + 'background'}
							/>
							<img onWheel={ emitSlideOnWheel }
								onClick={()=>{
									modalshow(item.name);
								}}
								className={`d-block w-100 foreground ${theme}Inverted`}
								src={process.env.PUBLIC_URL+item.foreground}
								alt={item.name + 'foreground'}
							/>

							<Carousel.Caption style={style.zIndex10} className={`${theme}Text`}>
								<h3>{item.h}</h3>
								<p>{item.description}</p>
							</Carousel.Caption>
						</Carousel.Item>;
					})
				}

			</Carousel>
		</div>
	);
}

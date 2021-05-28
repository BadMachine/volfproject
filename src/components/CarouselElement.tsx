import React, {useContext} from 'react';
import {Carousel} from 'react-bootstrap';
type emitSlideOnWheel = (event: React.WheelEvent)=>void;



export default function CarouselElement({background, foreground, description, name, slideonwheel}:
{background:string,foreground:string,description:string,name:string, slideonwheel: emitSlideOnWheel}){

	const style = {
		block:{
			display: 'block',
		}
	};
	return(
		<Carousel.Item >
			<img
				className="d-block w-100"
				src={process.env.PUBLIC_URL+background}
				alt={name+ 'slide background'}
			/>
			<img onWheel={ slideonwheel }
				className='d-block w-100 foreground'
				src= {process.env.PUBLIC_URL+foreground}
				alt= {name+ 'slide foreground'}
			/>

			<Carousel.Caption >
				<h3>First slide label</h3>
				<p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
			</Carousel.Caption>
		</Carousel.Item>

	);
}

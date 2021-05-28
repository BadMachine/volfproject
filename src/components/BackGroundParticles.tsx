import React, {useContext, useState} from 'react';
import {backgroundParticlesConfig} from './configs/particlesConfig';
import {Container} from 'tsparticles/dist/Core/Container';
import {modalStateInterface, NIGHT, DAY} from '../interfaces/stateInterfaces';
import Particles from 'react-tsparticles';


interface properties {
	properties: modalStateInterface,
	theme: string
}


class BackGroundParticles extends React.Component<properties>{

	public particlesContainer: Container | undefined;
	private theme:string;
	public options:any;
	constructor(properties:properties) {
		super(properties);
		this.particlesInit = this.particlesInit.bind(this);
		this.particlesLoaded = this.particlesLoaded.bind(this);
		this.theme = properties.theme;
		this.particlesContainer;
		this.options = backgroundParticlesConfig;
	}

	componentDidMount() {
		//
	}

	particlesInit(main:any) {
		console.log(main);
	}

	particlesLoaded(container:any) {
		this.particlesContainer = container;
	}

	shouldComponentUpdate(nextProps: Readonly<properties>): boolean {

		if(nextProps.theme!==this.props.theme) {
			return true;
		}
		Object.values(nextProps.properties).includes(true)? this.pause(): this.resume();
		return false;
	}

	pause(){
		console.log(this.particlesContainer?.particles);
		setTimeout(()=>this.particlesContainer?.pause(), 300);
	}
	resume(){
		this.particlesContainer?.play();
	}

	changeTheme(theme: string){
		this.options.particles.color.value = (theme === NIGHT)? '#ffffff': '#141414';
		this.options.particles.line_linked.color = (theme === NIGHT)? '#ffffff': '#141414';
		this.forceUpdate();
	}

	componentDidUpdate(prevProps: Readonly<properties>) {
		if(prevProps.theme!==this.props.theme) {
			this.changeTheme(this.props.theme);
		}
	}

	render(){
		return(
			<Particles init={this.particlesInit} loaded={this.particlesLoaded} params={JSON.parse(JSON.stringify(this.options)) }/>
		);
	}
}

export const MemorizedBackgroundParticles = React.memo(BackGroundParticles);

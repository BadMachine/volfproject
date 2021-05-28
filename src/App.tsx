import React, {useState, createContext} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CarouselOfProjects from './components/CarouselOfProjects';
import ModalContent from './components/ModalContent';
import Header from './components/header';
import {ThemeContext} from './components/context/themeContext';
import {initialModalState, TENSORFLOW_JS, ARRAY_SORT, COCO, NIGHT, DAY} from './interfaces/stateInterfaces';
import {MemorizedBackgroundParticles} from './components/BackGroundParticles';


function App() {

	const [modalContent, setModalcontent] = useState(initialModalState);
	const [mainTheme, setTheme] = useState({theme: NIGHT});
	const changeTheme = () => setTheme((prevTheme)=> prevTheme.theme===NIGHT? {theme: DAY}: {theme: NIGHT});

	const showModal = (name: string)=>{
		setModalcontent( {
			tensorflow: name===TENSORFLOW_JS? true: false,
			arraySort: name===ARRAY_SORT? true: false,
			coco: name===COCO? true: false,
		});

	};


	const closeTf = () => {
		setModalcontent({
			tensorflow: false,
			arraySort: false,
			coco: false}
		);
	};


	return (
		<ThemeContext.Provider value={{
			theme: mainTheme.theme,
		}}>
			<div className="App">
				<Header callback={changeTheme} />
				<div id={'contentBody'} className={mainTheme.theme}>
					<div id={'carouselColContainer'} style={{display: 'inline-block'}}>
						<MemorizedBackgroundParticles  properties={modalContent} theme={mainTheme.theme}/>
						<ModalContent state={modalContent} onClose={closeTf}/>
						<CarouselOfProjects modalshow={showModal}/>
					</div>
				</div>
			</div>
		</ThemeContext.Provider>
	);
}

export default App;

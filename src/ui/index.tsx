import { Observer } from '@playcanvas/observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Spinner } from 'pcui';
import Quiz from '../Quiz';
import { getAssetPath } from '../helpers';
import { ObserverData } from '../types';
import LeftPanel from './left-panel';
import SelectedNode from './selected-node';
import PopupPanel from './popup-panel';
import LoadControls from './load-controls';
import ErrorBox from './errors';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import { REACT_CLERK_PUBLISHABLE_KEY } from '../../rollup.config.mjs';

const PUBLISHABLE_KEY = 'pk_test_dXB3YXJkLW11dHQtNzUuY2xlcmsuYWNjb3VudHMuZGV2JA';

if (!PUBLISHABLE_KEY) {
    console.log(PUBLISHABLE_KEY + " is the key");
    throw new Error("Missing Publishable Key");
}

class App extends React.Component<{ observer: Observer }> {
    state: ObserverData = null;
    canvasRef: any;

    constructor(props: any) {
        super(props);

        this.canvasRef = React.createRef();
        this.state = this._retrieveState();

        props.observer.on('*:set', () => {
            // update the state
            this.setState(this._retrieveState());
        });
    }

    _retrieveState = () => {
        const state: any = {};
        (this.props.observer as any)._keys.forEach((key: string) => {
            state[key] = this.props.observer.get(key);
        });
        return state;
    };

    _setStateProperty = (path: string, value: string) => {
        this.props.observer.set(path, value);
    };

    render() {
        return <div id="application-container">
            <Container id="panel-left" flex resizable='right' resizeMin={220} resizeMax={800}>
                <div className="header" style={{ display: 'none' }}>
                    <div id="title">
                        <img src={getAssetPath('playcanvas-logo.png')}/>
                        <div>AR VIEWER</div>
                    </div>
                </div>
                <div id="panel-toggle">
                    <img src={getAssetPath('playcanvas-logo.png')}/>
                </div>
                <LeftPanel observerData={this.state} setProperty={this._setStateProperty} />
            </Container>
            <div id='canvas-wrapper'>
                <canvas id="application-canvas" ref={this.canvasRef} />
                <LoadControls setProperty={this._setStateProperty}/>
                <SelectedNode sceneData={this.state.scene} />
                <PopupPanel observerData={this.state} setProperty={this._setStateProperty} />
                <ErrorBox observerData={this.state} />
                <Spinner id="spinner" size={30} hidden={true} />
            </div>
        </div>;
    }
}

export default (observer: Observer) => {
    const searchParams = new URLSearchParams(window.location.search);
    let display = false;
    if (searchParams.get("quizLink") !== "" || searchParams.get("quizLink") !== null) {
        display = true;
    }

    console.log(display);
    console.log(searchParams.get("quizLink"));

    // render out the app
    ReactDOM.render(
        <BrowserRouter>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <Routes>
                    <Route path="/" element={<App observer={observer} />} />
                    <Route path="/quiz" element={<Quiz />} />
                </Routes>
            </ClerkProvider>
        </BrowserRouter>,
        document.getElementById('app')
    );
};

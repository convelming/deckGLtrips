/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import {TripsLayer} from '@deck.gl/experimental-layers';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line




const LIGHT_SETTINGS = {
  lightsPosition: [8.535, 47.365, 8000, 8.543, 47.378, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

export const INITIAL_VIEW_STATE = {
  // longitude: 8.537,//113.9550,
  // latitude: 47.368,//22.5238
    longitude: 114.2601,
    latitude: 22.7328,
  zoom: 15,
  maxZoom: 20,
  pitch: 45,
  bearing: 0
};


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 60*24, // unit corresponds to the timestamp in source data
      animationSpeed = 1 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 500;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });

    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }


  _renderLayers() {

    console.log(this.state.time+" line76");

    const timePeriod = Math.floor(this.state.time/60);
// Source data CSV

      console.log("HRS"+timePeriod+"-"+(timePeriod+1)+"avg.json");
      const DATA_URL = {
          // BUILDINGS:"data/smallSzDeck.json",//newyorkBuilding.json",
          //BUILDINGS:"data/zurichBuildingsDeck.json",
           //BUILDINGS:"longgangPartBuildings/龙岗区建筑dkGL.json",//"data/szBuildingsDeck.json",//newyorkBuilding.json",
           BUILDINGS:"data/szBuildingsDeck.json",//newyorkBuilding.json",
          // '"https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
          TRIPS:""
          //TRIPS:"zurichData/HRS"+timePeriod+"-"+(timePeriod+1)+"avg.json"//"data/zurichTrips.json"//newyorkTrips.json"
          // 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json' // eslint-disable-line
      };


    const {buildings = DATA_URL.BUILDINGS, trips = DATA_URL.TRIPS, trailLength = 5} = this.props;
      document.getElementById("buildingRenders").innerText = buildings.length;
      document.getElementById("linkRenders").innerText = trips.length;
      return [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => d.rgb,
        opacity: 0.9,
        strokeWidth: 600,
        trailLength,//: d => d.trailLength,
        currentTime: this.state.time
      }),
      new PolygonLayer({
        id: 'buildings',
        data: buildings,
        extruded: true,
        wireframe: false,
        fp64: true,
        opacity: 0.5,
        getPolygon: f => f.polygon,
        getElevation: f => f.height,
        getFillColor: [74, 80, 87],
        lightSettings: LIGHT_SETTINGS
      })
    ];
  }

  render() {

    const {viewState, controller = true, baseMap = true} = this.props;
    this.getTime()
    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
      >
        {baseMap && (
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        )}
      </DeckGL>
    );
  }
   getTime() {

        // console.log(this.state.time+" line142");
        let tempTime = this.state.time;
        let hour = Math.floor(tempTime/60);
        let minute = Math.floor(tempTime)%60;
        let second = Math.round((tempTime-(tempTime/60).toFixed(0))*60);

        document.getElementById("showTime").innerHTML = prefixInteger(hour,2)+":"+prefixInteger(minute,2)+":"+prefixInteger(second,2);
        document.getElementById("sliderValue").value = hour;

  }
}

export function renderToDOM(container) {

    // document.createElement("div").setAttribute("id","test");
    // document.getElementById("test").innerText = "hello world!"
    console.log("before render");
    render(<App />, container);
}

function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
import React, { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import * as THREE from 'three';

let camera, scene, renderer, plane;


const canvasSize = 800;
const vertexCount = 16 *  2;
const gridSize = canvasSize / vertexCount;

const pixelDensity = 1;
const frameRate = 60;
const textSize = canvasSize;

let text = '0';
let reset;

const depth = 3;
let index;
let color;

function App() {

    const setup = ( p5, canvasParentRef ) => {

        p5.createCanvas( canvasSize, canvasSize, p5.P2D ).parent( canvasParentRef );
        p5.pixelDensity( pixelDensity );
        p5.frameRate( frameRate );
        p5.textSize( textSize );
        p5.textAlign( p5.CENTER, p5.CENTER );

        // set up stage
        const viewSize = 10;
        camera = new THREE.OrthographicCamera( -viewSize / 2, viewSize / 2, viewSize / 2, -viewSize / 2, -10, 10 );
        scene = new THREE.Scene();

        let light1 = new THREE.PointLight( 0xffffff, 1, 30 );
        light1.position.set( 10, 0, 0 );
        scene.add( light1 );

        const light2 = new THREE.PointLight( 0xffffff, 1, 30 );
        light2.position.set( -10, 0, 0 );
        scene.add( light2 );

        const light3 = new THREE.PointLight( 0xffffff, 1, 30 );
        light3.position.set( 0, 0, 10 );
        scene.add( light3 );

        const planeGeometry = new THREE.PlaneGeometry( 10, 10, vertexCount - 1, vertexCount - 1 );
        const phongMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x000000, shininess: 30, side: THREE.DoubleSide, } );
        plane = new THREE.Mesh( planeGeometry, phongMaterial );
        plane.rotation.set( Math.PI / 4, -Math.PI / 4, 0 );
        scene.add( plane );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( canvasSize, canvasSize );
        renderer.setAnimationLoop( animation );
        document.body.appendChild( renderer.domElement );

        setInterval( () => {
            getRandomNumber();
        }, 1000 );

    };

    const draw = ( p5 ) => {

        let i = 0;

        // draw random number on canvas
        p5.clear();
        p5.fill( 255 );
        p5.text( text, ( canvasSize / 2 ), ( canvasSize / 2`` ) );

        // load canvas pixels in memory
        p5.loadPixels();

        // loop over pixels
        for ( let y = 0; y < canvasSize * pixelDensity; y += gridSize * pixelDensity ) {

            for ( let x = 0; x < canvasSize * pixelDensity; x += gridSize * pixelDensity ) {


                index = y * canvasSize * pixelDensity + x;
                color = p5.pixels[index * 4];

                // depth is either 0% or 100%
                if ( color > 0 ) {
                    color = depth;
                } else {
                    color = -depth;
                }

                // adjust the corresponding vertex z to the color value
                plane.geometry.attributes.position.array[i * 3 + 2] += ( color - plane.geometry.attributes.position.array[i * 3 + 2] ) * .11;
                plane.geometry.attributes.position.needsUpdate = true;

                i++;
            }
        }
    };

    const animation = ( time ) => {
        renderer.render( scene, camera );
    };

    const getRandomNumber = () => {
        text = Math.floor( Math.random() * 10 );
    };

    return <>
        <Sketch setup={setup} draw={draw} className={'source'} />
    </>;

}

export default App;

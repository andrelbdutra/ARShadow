import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import {TeapotGeometry} from './build/jsm/geometries/TeapotGeometry.js';
import {ARjs}    from  './libs/AR/ar.js';
import { lightVector } from './index.js';

// init scene and camera
let scene, camera, renderer, light;
renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
	//renderer.shadowMap.type = THREE.VSMShadowMap;
	renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
   //renderer.shadowMapsoft = true;
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 1280, 960 ); // Change here to render in low resolution (for example 640 x 480)
	document.body.appendChild( renderer.domElement );

scene	= new THREE.Scene();
camera = new THREE.Camera();
   scene.add(camera);
//light = initDefaultSpotlight(scene, new THREE.Vector3(25, 30, 20)); // Use default light
light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(lightVector[0], lightVector[1], lightVector[2])
light.target.position.set(0, 0, 0)
scene.add(light.target)
light.castShadow = true;
scene.add( light );

var material = new THREE.ShadowMaterial();
material.opacity = 0.8;
var geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
var groundPlane = new THREE.Mesh( geometry, material)
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
groundPlane.receiveShadow = true;
scene.add(groundPlane);
//----------------------------------------------------------------------------
// Set AR Stuff
let AR = {
   source: null,
   context: null,
}
setARStuff();

window.addEventListener('resize', function(){ onResize() })

//----------------------------------------------------------------------------
// Adding object to the scene
createTeapot();

// Render the whole thing on the page
render();

function render()
{
   updateAR();      
   requestAnimationFrame(render);
   renderer.render(scene, camera) // Render scene
}

function updateAR()
{
	if( AR.source.ready === false )	return
	AR.context.update( AR.source.domElement )
	scene.visible = camera.visible   
}

function createTeapot()
{
   // Teapot
   let objColor = "rgb(255,20,20)"; // Define the color of the object
   let objShininess = 200;          // Define the shininess of the object

   let geometry = new TeapotGeometry(0.5);
   let material = new THREE.MeshPhongMaterial({color: objColor, shininess: objShininess});
      material.side = THREE.DoubleSide;
   let obj = new THREE.Mesh(geometry, material);
      obj.castShadow = true;
      obj.position.set(0.0, 0.5, 0.0);
   scene.add(obj);
}
function setSource(type, url)
{
   if(AR.source) AR.source = null
   
   AR.source = new ARjs.Source({	
      sourceType : type,
      sourceUrl : url,
      // resolution of at which we initialize the source image
      sourceWidth: 1280,
      sourceHeight: 960,
      // resolution displayed for the source
      displayWidth: 1280,
      displayHeight: 960
   })
   AR.source.init(function onReady(){
      setTimeout(() => {
         onResize()
      }, 100);
   })
   onResize()    
}

function onResize(){
   var altura = window.innerHeight;
   var largura = window.innerWidth;
	AR.source.onResizeElement()
	AR.source.copyElementSizeTo(renderer.domElement)
   AR.source.displayHeight = altura
   AR.source.displayWidth = largura
	if( AR.context.arController !== null ){
		AR.source.copyElementSizeTo(AR.context.arController.canvas)
	}
}

function setARStuff()
{
   //----------------------------------------------------------------------------
   // initialize arToolkitContext
   AR.context = new ARjs.Context({
      cameraParametersUrl: '../libs/AR/data/camera_para.dat',
      detectionMode: 'mono',
   })

   // initialize it
   AR.context.init(function onCompleted(){
      camera.projectionMatrix.copy( AR.context.getProjectionMatrix() );
   })

   //----------------------------------------------------------------------------
   // Create a ArMarkerControls
   let markerControls;
   markerControls = new ARjs.MarkerControls(AR.context, camera, {	
      type : 'pattern',
      patternUrl : '../libs/AR/data/patt.kanji',
      changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
   })
   // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
   scene.visible = false

   //----------------------------------------------------------------------------
   // Handle arToolkitSource
   AR.source = 'webcam',null;
   setSource('webcam',null)   
}
import "./style.css";
import * as THREE from "three";
import dat from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertex from "./shaders/vertex.glsl";
import vertexP from './shaders/points_vertex.glsl';
import fragment from "./shaders/fragment.glsl";


/**
 *  Main
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Dat Gui
const gui = new dat.GUI();


// Parameters for gui
const parameters = {};

/**
 * Sizes
 */
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
/**
 * Object
 */

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0.0 },
    uResolution: {value : new THREE.Vector2(sizes.width,sizes.height)},
    uMouse: {value: new THREE.Vector2(0,0)},
  },
  vertexShader: vertexP,
  fragmentShader: fragment,
  // transparent: true,
  side: THREE.DoubleSide,
});
const materialSecond = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0.0 },
    uResolution: {value : new THREE.Vector2(sizes.width,sizes.height)},
    uMouse: {value: new THREE.Vector2(0,0)}
  },
  vertexShader: vertex,
  fragmentShader: fragment,
  // transparent: true,
  side: THREE.DoubleSide,
});

const geometry = new THREE.PlaneBufferGeometry(1,1,200,200)
const geometryB = new THREE.BufferGeometry()

let pointNumber = 40000;
let pos = new Float32Array(pointNumber*3);
let uv  = new Float32Array(pointNumber*2);
for (let i = 0; i < pointNumber; i++) {
  const i3 = i*3;
  const i2 = i*2;
  const x = Math.random() ;
  const y = Math.random() ;
  const z = (Math.random() - 0.5)*0;

  pos[i3] = x-.5;
  pos[i3+1] = y-.5;
  pos[i3+2] = z;


  uv[i2] = x;
  uv[i2+1] = y;
  
}
geometryB.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
geometryB.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));

// console.log(geometryB.attributes.position.array)
const mesh = new THREE.Points(geometry,material)
scene.add(mesh);

// console.log(geometryB.attributes.uv.array)
// console.log(geometryB.attributes.position.array)



/**
 *   Raycast Func 
 * */

// const mouse = new THREE.Vector2();

// function raycast(objects){

//   const raycaster = new THREE.Raycaster();

//   window.addEventListener("mousemove", onMouseMove);
//   function onMouseMove(event) {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects([]);
//     if (intersects.length > 0) {
    
//       // console.log(intersects)
//     }
//   }
// };



window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// Mouse event 
const mouse = {
  x:0,
  y:0,
  prevX:0,
  prevY:0,
  vx: 0 ,
  vy: 0 ,
}

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) -0.5;
  mouse.y = 0.5-(e.clientY / window.innerHeight);

  // console.log(mouse.x,mouse.y)

  mouse.vx = mouse.x - mouse.prevX;
  mouse.vy = mouse.y - mouse.prevY;

  mouse.prevX = mouse.x;
  mouse.prevY = mouse.y;


});



/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.0001,1000);
// gsap.fromTo(camera.position,{z:-1},{duration:10,z:1})
// gsap.to(camera.position,{z:-1,delay:10})
camera.position.z = 0.1
camera.position.y = -0.5
scene.add(camera);

/**
 *  Controls
 */

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setClearColor(new THREE.Color("rgb(0,0,20)"));
// renderer.autoClear = false;

/**
 *  Animation
 */
const clock = new THREE.Clock();
const animate = () => {
  // Time
  let elapseTime = clock.getElapsedTime();

  // Controls update
  controls.update();

  // Mouse

    material.uniforms.uMouse.value.set(mouse.x,mouse.y)
    material.uniforms.uTime.value = elapseTime

  // datatexture
      // updateDataTexture()

  // renderer
  renderer.render(scene,camera)
  

  // recall animationFunc

  window.requestAnimationFrame(animate);
};

animate();


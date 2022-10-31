import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let data = require("./data.json");

function planes(img_count, textures) {
  var planes = [];

  for (var i = 0; i < img_count; i++) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      map: textures[i % textures.length],
    });
    const plane = new THREE.Mesh(geometry, material);

    planes.push(plane);
    planes[i].position.x = (Math.random() - 0.5) * 30;
    planes[i].position.y = (Math.random() - 0.5) * 30;
    planes[i].position.z = (Math.random() - 0.5) * 30;
  }
  return planes;
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
var textures = [];

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("./textures/particles/8.png");
for (var i = 0; i < data.length; i++) {
  textures.push(textureLoader.load(data[i].path));
}

// Geometry
const particlesGeometry = new THREE.BufferGeometry();

const imageGeometry = new THREE.BufferGeometry();

const count = 5000;

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.3;
particlesMaterial.sizeAttenuation = true;

const imageMaterial = new THREE.PointsMaterial();
imageMaterial.size = 30;
imageMaterial.sizeAttenuation = true;

particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.depthTest = false;

const positions = new Float32Array(count * 3);
const img_positions = new Float32Array(data.length * 3);
// Multiply by 3 because each position is composed of 3 values (x, y, z)

for (
  let i = 0;
  i < count * 3;
  i++ // Multiply by 3 for same reason
) {
  positions[i] = (Math.random() - 0.5) * 30;
  particlesMaterial.map = particleTexture;
  // Math.random() - 0.5 to have a random value between -0.5 and +0.5
}

for (
  let i = 0;
  i < data.length * 3;
  i++ // Multiply by 3 for same reason
) {
  img_positions[i] = (Math.random() - 0.5) * 30;
  // Math.random() - 0.5 to have a random value between -0.5 and +0.5
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

imageGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(img_positions, 3)
);
// Create the Three.js BufferAttribute and specify that each information is composed of 3 values

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

const images = new THREE.Points(imageGeometry, imageMaterial);

var planes_img = [];
planes_img = planes(data.length, textures);

// scene.add(plane);
planes_img.forEach((plane) => {
  scene.add(plane);
});
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0;
controls.maxDistance = 50;

let scrollY = window.scrollY;
let myDiv = document.querySelectorAll(".titles");
console.log(myDiv);
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});
for (let i = 0; i < myDiv.length; i++) {
  myDiv[i].addEventListener("click", function () {
    for (let j = 0; j < myDiv.length; j++) {
      myDiv[j].classList.remove("titles");
      myDiv[j].classList.add("section");
    }
  });
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc";
  }
  if (isEscape) {
    for (let j = 0; j < myDiv.length; j++) {
      myDiv[j].classList.remove("section");
      myDiv[j].classList.add("titles");
    }
  }
};

// function myFunction() {
//   var x = document.getElementById("snackbar");
//   x.className = "show";
//   setTimeout(function () {
//     x.className = x.className.replace("show", "");
//   }, 10000);
// }

const objectsDistance = 4;
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  planes_img.forEach((plane) => {
    plane.quaternion.copy(camera.quaternion);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

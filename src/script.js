import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as Stats from 'stats.js'
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';


// Other shader imports...
// import ffVertex from "./shaders/fireflies/vertex.glsl";
// import ffFragment from "./shaders/fireflies/fragment.glsl";


import nVertex from "./shaders/noise/vertex.glsl";
import nFragment from "./shaders/noise/fragment.glsl";


const stats = new Stats();
document.body.appendChild(stats.dom);

// Canvas and scene
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color().setHSL(0.6, 0, 0.1);
scene.fog = new THREE.Fog(scene.background, 1, 100);


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/**
 * Loaders
 */

// Texture loader

const textureLoader = new THREE.TextureLoader()

// texture
const bakedTexture = textureLoader.load('gbaked.jpg');
bakedTexture.flipY = false;

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Object
 */



//lightssss******************

const ambient = new THREE.AmbientLight(0xffffff, 0.2);

// const point = new THREE.PointLight(0xffffff, 0.1);
// point.position.set(-14, 0, 1)


// const pointb = point.clone()
// pointb.color = new THREE.Color(0xc341ff);
// pointb.position.set(14, 0, 0.5)

// const cursorLight = new THREE.SpotLight(0xffffff, 2);

// cursorLight.target.position.set(0, 2, 0)
// cursorLight.angle = 0.7;
// cursorLight.penumbra = 0.5;
// cursorLight.decay = 0;
// cursorLight.distance = 25;
// // cursorLight.map = textures[ 'disturb.jpg' ];

// cursorLight.castShadow = true;
// cursorLight.shadow.mapSize.width = 1024;
// cursorLight.shadow.mapSize.height = 1024;
// cursorLight.shadow.camera.near = 1;
// cursorLight.shadow.camera.far = 20;
// cursorLight.shadow.focus = 1;
// cursorLight.shadow.bias = - 0.0002;
// cursorLight.shadow.radius = 4;

// LIGHTS

const hemiLight = new THREE.HemisphereLight(0x00ff00, 0xff0000, 0.05);
// hemiLight.color.setHSL(0.6, 1, 0.1);
// hemiLight.groundColor.setHSL(0.595, 1, 0.4);
hemiLight.position.set(0, 5, 0);
scene.add(hemiLight);

// const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
// scene.add( hemiLightHelper );

//

const dirLight = new THREE.DirectionalLight(0xffffff, 0.25);
// dirLight.color.setHSL(0.1, 1, 0.1);
dirLight.position.set(- 1, 1.75, 1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d = 50;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 50;
dirLight.shadow.bias = - 0.0001;

// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
// scene.add( dirLightHelper );

scene.add(
    // cursorLight,
    ambient,
    // point,
    //   pointb
)


// ****Geometry****

const planegeo = new THREE.PlaneGeometry(sizes.width, sizes.height)

// *****materials**** //

const TextMat = new THREE.MeshStandardMaterial({
    color: "#f9c9f9",
    metalness: 0.5,
    roughness: 0.5,
})

const PlaneMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 1.0,
})

const noiseMat = new THREE.ShaderMaterial({
    uniforms: {
        u_mouse: { value: new THREE.Vector2() },
        u_time: { value: 0 },
        noise_speed: { value: 0.2 },
        metaball: { value: 0.5 },
        discard_threshold: { value: 0.5 },
        antialias_threshold: { value: 0.05 },
        noise_height: { value: 0.5 },
        noise_scale: { value: 10 },
    },
    vertexShader: nVertex,
    fragmentShader: nFragment,
    transparent: true,

})

// const camoMat = new THREE.MeshStandardMaterial({
//     map:camoTexture
// })

const glassMat = new THREE.MeshPhysicalMaterial({})
glassMat.reflectivity = 0.5
glassMat.transmission = 1.0
glassMat.roughness = 0.2
glassMat.metalness = 0
glassMat.clearcoat = 1
glassMat.clearcoatRoughness = 0.25
glassMat.color = new THREE.Color(0xffffff)
glassMat.ior = 2
glassMat.thickness = 1.5
// glassMat.envMap= hdrEquirect,
// glassMat.envMapIntensity= 1.5,

// *****Meshh and model****
const planeMesh = new THREE.Mesh(planegeo, PlaneMat)
planeMesh.receiveShadow = true
// scene.add(planeMesh)



const bakedMaterial = new THREE.MeshStandardMaterial({
    map: bakedTexture,
    // roughness: 1,
    metalness: 0.3
})

const lSphere = new THREE.SphereGeometry(0.1, 16, 8);

let point = new THREE.PointLight(0x4169e1, 0.5);
point.add(new THREE.Mesh(lSphere, glassMat));
scene.add(point);


//model

// var modelG = scene.getObjectByName("grumbs")

// const grumbs = new THREE.Object3D();
// gltfLoader.load(
//     '/grumbsLight.glb',
//     (gltf) => {
//         const text = gltf.scene.children.find(child => child.name === 'Text')
//         const grumbs = gltf.scene.children.find(child => child.name === 'grumbs')

//         // grumbs = grumbs
//         // scene.add(gltf.scene);


//         // text.material = TextMat;
//         // text.scale.set(1.5, 1.5, 1.5)
//         // text.position.y = 1.5
//         // text.castShadow = true

//         // grumbs.material = noiseMat;
//         // // grumbs.castShadow = true
//         // grumbs.scale.set(10, 10, 10)
//         // grumbs.position.x = 0
//         // grumbs.position.y = -2
//         // grumbs.position.z = 1

//         // function init() {
//         //     const parallaxX = pointer.x  * 0.5
//         //    const parallaxY = -pointer.y * 0.5

//         //    grumbs.rotation.x += (parallaxX - grumbs.rotation.x) * 0.5 
//         //    grumbs.rotation.y += (parallaxY - grumbs.rotation.y) * 0.5 
//         // }
//         // init()

//          // Just copy the geometry from the loaded model
//     const Tgeometry = text.geometry.clone();
//     const Ggeometry = grumbs.geometry.clone();

//     // Create a new mesh and place it in the scene
//     const Tmesh = new THREE.Mesh(Tgeometry, TextMat);
//     Tmesh.rotation.x = Math.PI / 2;
//     Tmesh.position.set(0, 1.5, 0);
//     // Tmesh.scale.set(2, 2, 2);
//     Tmesh.castShadow = true


//     const Gmesh = new THREE.Mesh(Ggeometry, noiseMat);
//     // Gmesh.scale.set(2, 2, 2);
//     Gmesh.position.set(0, -1, 1);
//     // Gmesh.castShadow = true

//     scene.add(Tmesh, Gmesh);


//     // Discard the loaded model
//     gltf.scene.children.forEach((child) => {
//       child.geometry.dispose();
//       child.material.dispose();
//     });
//     }
// )

gltfLoader.load(
    'grumbs.glb',
    (gltf) => {
        const floor = gltf.scene.children.find(child => child.name === 'floor')
        const g = gltf.scene.children.find(child => child.name === 'G')
        const r = gltf.scene.children.find(child => child.name === 'R')
        const u = gltf.scene.children.find(child => child.name === 'U')
        const m = gltf.scene.children.find(child => child.name === 'M')
        const b = gltf.scene.children.find(child => child.name === 'B')
        const s = gltf.scene.children.find(child => child.name === 'S')
        const podium = gltf.scene.children.find(child => child.name === 'podium')
        const grumbs = gltf.scene.children.find(child => child.name === 'grumbs')

        console.log(gltf)
        scene.add(gltf.scene);

        floor.material = bakedMaterial;
        // floor.scale.set(2,2,2);
        g.material = bakedMaterial;
        r.material = noiseMat;
        u.material = bakedMaterial;
        m.material = bakedMaterial;
        // m.material.side = THREE.DoubleSide
        b.material = bakedMaterial;
        s.material = bakedMaterial;
        podium.material = noiseMat;
        grumbs.material = bakedMaterial;
        grumbs.scale.set(2, 2, 2);
        grumbs.position.set(0, 0, -1.7);

        floor.receiveShadow = true
        g.castShadow = true
        r.castShadow = true
        u.castShadow = true
        m.castShadow = true
        // m.castShadow = true.side = THREE.DoubleSide
        b.castShadow = true
        s.castShadow = true
        podium.castShadow = true
        podium.receiveShadow = true
        grumbs.castShadow = true

    }
)



let camera;

// ****mouse movement****

// Create a variable to keep track of mouse position and touch position
const pointer = new THREE.Vector2();

noiseMat.uniforms.u_mouse.value = pointer;

// A function to be called every time the pointer (mouse or touch) moves
function onUpdatePointer(event) {
    event.preventDefault();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    updateCursorLight();
}

// Function to update cursor light position based on pointer (mouse or touch)
function updateCursorLight() {
    const vector = new THREE.Vector3(pointer.x, pointer.y, 1);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    point.position.x = pos.x;
    point.position.y = pos.y;
    point.position.z = 1;
}

// Add a listener for the pointermove event
canvas.addEventListener("pointermove", onUpdatePointer, false);


// modelG.rotation.y = THREE.MathUtils.lerp(modelG.rotation.y, (pointer.x * Math.PI) / 20, 0.05)
//     modelG.rotation.x = THREE.MathUtils.lerp(modelG.rotation.x, (pointer.y * Math.PI) / 20, 0.05)


// ...



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    // powerPreference: "high-performance"
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// renderer.gammaFactor = 2.2;
renderer.outputColorSpace = THREE.SRGBColorSpace

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

/**
 * Camera
 */

// Camera group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
let camZ = 3.5;
camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(-1.5, 1.5, camZ);
camera.lookAt(0, 0, 0);
cameraGroup.add(camera);

// ******Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = true
controls.enableRotate = true
controls.enableZoom = true
controls.update();



//*****post processing****

const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    0.25,
    0,
    0.15
);
bloomPass.resolution.set(sizes.width, sizes.height);

const composer = new EffectComposer(renderer);
// const saoPass = new SAOPass(scene, camera);
// composer.addPass(saoPass);
// const outputPass = new OutputPass();
composer.addPass(outputPass);
composer.addPass(renderPass);
composer.addPass(bloomPass);


//Resize 
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height

    //mobile responsiveness
    if (sizes.width < sizes.height) {
        camera.position.z = camZ + 5;
    } else {
        camera.position.z = camZ;
    }
    camera.updateProjectionMatrix()

    bloomPass.resolution.set(sizes.width, sizes.height);
    controls.update();
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//***** */mobile responsiveness******
if (sizes.width < sizes.height) {
    camera.position.z = camZ + 5;
} else {
    camera.position.z = camZ;
}
camera.updateProjectionMatrix()

// console.log(grumbs);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //update shader

    noiseMat.uniforms.u_time.value = elapsedTime

    // point.position.x = Math.sin( elapsedTime * 0.9 ) * 0.5;
    // point.position.y = Math.cos( elapsedTime * 0.5) * 0.5;
    point.position.z = Math.cos(elapsedTime * 0.3) * 0.5;

    // const parallaxX = pointer.x  * 0.5
    // const parallaxY = -pointer.y * 0.5

    // grumbs.rotation.x += (parallaxX - grumbs.rotation.x) * 0.5 
    // grumbs.rotation.y += (parallaxY - grumbs.rotation.y) * 0.5 

    controls.update();

    // Render
    stats.begin()
    renderer.render(scene, camera)
    composer.render();
    // init()
    stats.end()
    stats.update()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
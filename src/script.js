import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//Texture
const texture = new THREE.TextureLoader();
const doorColorTexture = texture.load("/textures/door/color.jpg");
const doorAlphaTexture = texture.load("/textures/door/alpha.jpg");
const doorHeightTexture = texture.load("/textures/door/alpha.jpg");
const doorNormalTexture = texture.load("/textures/door/normal.jpg");
const doorAmbientOcclusionTexture = texture.load(
	"/textures/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = texture.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = texture.load("/textures/door/roughness.jpg");

const bricksColorTexture = texture.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = texture.load(
	"/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = texture.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = texture.load("/textures/bricks/roughness.jpg");

const grassColorTexture = texture.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = texture.load(
	"/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = texture.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = texture.load("/textures/grass/roughness.jpg");

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

//Debugger
const gui = new dat.GUI();

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Scene
const scene = new THREE.Scene();

//Fog
const fog = new THREE.Fog("#262837", 15, 30);
scene.fog = fog;

//Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

//Objects
//House
const house = new THREE.Group();
scene.add(house);

//Walls
const walls = new THREE.Mesh(
	new THREE.BoxBufferGeometry(4, 2.5, 4),
	new THREE.MeshBasicMaterial({
		color: "#ac8e82",
		map: bricksColorTexture,
		aoMap: bricksAmbientOcclusionTexture,
		normalMap: bricksNormalTexture,
		roughnessMap: bricksRoughnessTexture,
	})
);

walls.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

walls.position.y = 1.25;
house.add(walls);

//roof
const roof = new THREE.Mesh(
	new THREE.ConeBufferGeometry(3.5, 1, 4),
	new THREE.MeshBasicMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 1 / 2;
house.add(roof);

//door
const door = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		color: "#aa7b7b",
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.1,
		normalMap: doorNormalTexture,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
	})
);

door.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

//bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.5);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; ++i) {
	const angle = Math.random() * Math.PI * 2;
	const radius = 3 + Math.random() * 6;
	const x = Math.cos(angle) * radius;
	const z = Math.sin(angle) * radius;

	const grave = new THREE.Mesh(graveGeometry, graveMaterial);

	grave.position.set(x, 0.4, z);
	grave.rotation.y = (Math.random() - 0.5) * 0.4;
	grave.rotation.z = (Math.random() - 0.5) * 0.4;
	grave.castShadow = true;
	graves.add(grave);
}

//Floor
const floor = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(20, 20),
	new THREE.MeshBasicMaterial({
		map: grassColorTexture,
		aoMap: grassAmbientOcclusionTexture,
		normalMap: grassNormalTexture,
		roughnessMap: grassRoughnessTexture,
	})
);

floor.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(floor.geometry.attributes.uv, 2)
);

floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = -0.65;
floor.receiveShadow = true;

scene.add(floor);

//Lights
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost1, ghost2, ghost3);

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	55,
	sizes.width / sizes.height,
	1,
	100
);
camera.position.x = 15;
camera.position.y = 15;
camera.position.z = 15;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor("#262837");

//Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// //Clock
const clock = new THREE.Clock();

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();

	//Update ghosts
	const ghostAngle1 = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghostAngle1) * 4;
	ghost1.position.z = Math.sin(ghostAngle1) * 4;
	ghost1.position.y = Math.sin(elapsedTime * 3);

	const ghostAngle2 = -elapsedTime * 0.32;
	ghost2.position.x = Math.cos(ghostAngle2) * 5;
	ghost2.position.z = Math.sin(ghostAngle2) * 5;
	ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

	const ghostAngle3 = -elapsedTime * 0.18;
	ghost3.position.x =
		Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.32));
	ghost3.position.z = Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.5));
	ghost3.position.y = Math.sin(elapsedTime * 5) * Math.sin(elapsedTime * 2.5);

	//Update Objects

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();

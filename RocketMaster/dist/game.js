// @ts-ignore
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js';
// Game constants
const WORDS = [
    'rocket', 'space', 'orbit', 'gravity', 'thrust',
    'astronaut', 'galaxy', 'planet', 'star', 'mission'
];
const SPAWN_INTERVAL = 2000; // ms
const GRAVITY = -0.0005;
const THRUST_PER_WORD = 5;
const ESCAPE_THRUST = 100;
// Game variables
let scene;
let camera;
let renderer;
let rocket;
let planet;
let words = [];
let score = 0;
let thrust = 0;
let currentWord = null;
let lastSpawnTime = 0;
// DOM elements
const input = document.getElementById('input');
const scoreDisplay = document.getElementById('score');
const thrustDisplay = document.getElementById('thrust');
const currentWordDisplay = document.getElementById('currentWord');
// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Camera setup
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
    // Planet
    const planetGeometry = new THREE.SphereGeometry(100, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(0, -120, -50);
    scene.add(planet);
    // Rocket
    const rocketGeometry = new THREE.ConeGeometry(0.5, 2, 32);
    const rocketMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
    rocket.position.set(0, -2, 0);
    scene.add(rocket);
    // Background stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const starVertices = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
        starVertices[i * 3] = (Math.random() - 0.5) * 100;
        starVertices[i * 3 + 1] = (Math.random() - 0.5) * 100;
        starVertices[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    // Event listeners
    input.addEventListener('input', handleInput);
    window.addEventListener('resize', onWindowResize);
    // Start game loop
    animate();
}
// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
// Spawn new falling word
function spawnWord() {
    const text = WORDS[Math.floor(Math.random() * WORDS.length)];
    const geometry = new THREE.PlaneGeometry(text.length * 0.4, 0.5);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: createTextTexture(text)
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 8, 5, 0);
    scene.add(mesh);
    words.push({
        text,
        mesh,
        velocity: new THREE.Vector3(0, GRAVITY, 0)
    });
    if (!currentWord) {
        setCurrentWord(words[0]);
    }
}
// Create text texture for words
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    return new THREE.CanvasTexture(canvas);
}
// Set current word to type
function setCurrentWord(word) {
    currentWord = word;
    currentWordDisplay.textContent = word ? `Type: ${word.text}` : '';
    input.value = '';
    input.focus();
}
// Handle user input
function handleInput() {
    if (!currentWord)
        return;
    if (input.value.toLowerCase() === currentWord.text.toLowerCase()) {
        // Correct word typed
        score += 10;
        thrust = Math.min(thrust + THRUST_PER_WORD, ESCAPE_THRUST);
        scoreDisplay.textContent = `Score: ${score}`;
        thrustDisplay.textContent = `Thrust: ${thrust}%`;
        scene.remove(currentWord.mesh);
        words = words.filter(w => w !== currentWord);
        setCurrentWord(words[0] || null);
    }
}
// Game loop
function animate() {
    requestAnimationFrame(animate);
    // Update words
    const currentTime = performance.now();
    if (currentTime - lastSpawnTime > SPAWN_INTERVAL) {
        spawnWord();
        lastSpawnTime = currentTime;
    }
    words.forEach(word => {
        word.mesh.position.add(word.velocity);
        if (word.mesh.position.y < -5) {
            scene.remove(word.mesh);
            words = words.filter(w => w !== word);
            if (word === currentWord) {
                setCurrentWord(words[0] || null);
            }
        }
    });
    // Update rocket position based on thrust
    const targetY = thrust / ESCAPE_THRUST * 100 - 2;
    rocket.position.y += (targetY - rocket.position.y) * 0.05;
    // Move camera to follow rocket
    camera.position.y = rocket.position.y + 2;
    //camera.position.x += 0.02; // Side-scrolling effect
    // Rotate planet
    planet.rotation.y += 0.001;
    renderer.render(scene, camera);
}
// Start the game
init();

import { isPopoverSupported, applyPopoverPolyfill } from './popover-polyfill.js';
import { createPlaceholderModel, updateModelTexture } from './model-loader.js';

// Apply popover polyfill if not supported
if (!isPopoverSupported()) applyPopoverPolyfill();

// DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('image-upload');
const printImage = document.getElementById('print-image');
const customText = document.getElementById('custom-text');
const productPop = document.getElementById('product-pop');
const buildPop = document.getElementById('build-pop');
const threejsContainer = document.getElementById('threejs-container');

// Product selector label
const productLabel = document.getElementById('selected-product');
// Build selector label
const buildLabel = document.getElementById('selected-build');

// Default values
let selectedProduct = 'T-Shirt';
let height = 180;
let weight = 80;
let build = 'Athletic';

// Three.js variables
let scene, camera, renderer, controls, tshirtModel;
let isModelLoading = false;

// Add this function to position the dropdown menus correctly
function positionDropdown(dropdown, trigger) {
  const triggerRect = trigger.getBoundingClientRect();
  dropdown.style.left = `${triggerRect.left}px`;
  dropdown.style.top = `${triggerRect.bottom + 5}px`;
}

// Initialize the application
function init() {
  setupEventListeners();
  setupThreeJsScene();
  
  // Create a default placeholder image
  if (!printImage.src || printImage.src.includes('placeholder.jpg')) {
    printImage.src = 'https://via.placeholder.com/400x400?text=Upload+Image';
  }
  
  // Handle window resize for dropdown positioning
  window.addEventListener('resize', handleWindowResize);
}

// Set up event listeners
function setupEventListeners() {
  // File upload handling
  fileInput.addEventListener('change', handleFileSelect);
  
  // Drag and drop handling
  dropArea.addEventListener('dragover', handleDragOver);
  dropArea.addEventListener('dragleave', handleDragLeave);
  dropArea.addEventListener('drop', handleDrop);
  
  // Custom text handling
  customText.addEventListener('input', updateCustomText);
  
  // Get trigger buttons
  const productTrigger = document.querySelector('[popovertarget="product-pop"]');
  const buildTrigger = document.querySelector('[popovertarget="build-pop"]');
  
  // Dropdown handling - for product type
  const selectProductOption = event => {
    const button = event.target.closest('button');
    if (!button) return;
    
    const selectedButton = productPop.querySelector('[data-selected=true]');
    if (selectedButton) {
      selectedButton.dataset.selected = 'false';
    }
    
    productLabel.textContent = button.dataset.value;
    button.dataset.selected = 'true';
    selectedProduct = button.dataset.value;
    updateProductModel(button.dataset.value);
  };
  
  // Position dropdowns on beforetoggle event
  const handleProductToggle = event => {
    if (event.newState === 'open') {
      productPop.addEventListener('click', selectProductOption);
      // Position the dropdown
      positionDropdown(productPop, productTrigger);
    } else {
      productPop.removeEventListener('click', selectProductOption);
    }
  };
  
  // Dropdown handling - for build type
  const selectBuildOption = event => {
    const button = event.target.closest('button');
    if (!button) return;
    
    const selectedButton = buildPop.querySelector('[data-selected=true]');
    if (selectedButton) {
      selectedButton.dataset.selected = 'false';
    }
    
    buildLabel.textContent = button.dataset.value;
    button.dataset.selected = 'true';
    build = button.dataset.value;
  };
  
  const handleBuildToggle = event => {
    if (event.newState === 'open') {
      buildPop.addEventListener('click', selectBuildOption);
      // Position the dropdown
      positionDropdown(buildPop, buildTrigger);
    } else {
      buildPop.removeEventListener('click', selectBuildOption);
    }
  };
  
  productPop.addEventListener('beforetoggle', handleProductToggle);
  buildPop.addEventListener('beforetoggle', handleBuildToggle);
  
  // Size options handling
  document.getElementById('height').addEventListener('change', (e) => {
    height = parseInt(e.target.value);
  });
  
  document.getElementById('weight').addEventListener('change', (e) => {
    weight = parseInt(e.target.value);
  });
  
  // Handle Alt+Q for switching themes
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'q') {
      toggleTheme();
    }
  });
}

// Handle window resize for dropdown positioning
function handleWindowResize() {
  // Reposition open dropdowns if they exist
  if (productPop.hasAttribute('popovershow') || productPop.matches(':popover-open')) {
    const productTrigger = document.querySelector('[popovertarget="product-pop"]');
    positionDropdown(productPop, productTrigger);
  }
  
  if (buildPop.hasAttribute('popovershow') || buildPop.matches(':popover-open')) {
    const buildTrigger = document.querySelector('[popovertarget="build-pop"]');
    positionDropdown(buildPop, buildTrigger);
  }
  
  // Update Three.js camera and renderer
  if (camera && renderer) {
    camera.aspect = threejsContainer.clientWidth / threejsContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threejsContainer.clientWidth, threejsContainer.clientHeight);
  }
}

// Handle file select
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    loadImageFile(file);
  }
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.add('highlight');
}

// Handle drag leave
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove('highlight');
}

// Handle drop
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  dropArea.classList.remove('highlight');
  
  const file = e.dataTransfer.files[0];
  if (file) {
    loadImageFile(file);
  }
}

// Load image file
function loadImageFile(file) {
  if (file.type.match('image.*')) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Set the image in the preview
      printImage.src = e.target.result;
      
      console.log("Image loaded:", e.target.result.substring(0, 50) + "...");
      
      // Update the 3D model texture
      if (window.currentModel) {
        console.log("Current model found:", window.currentModel);
        updateModelTexture(window.currentModel, e.target.result, THREE);
      } else {
        console.warn("No current model available to apply texture");
      }
    };
    
    reader.onerror = function(e) {
      console.error("Error reading file:", e);
      alert("Error reading image file");
    };
    
    // Start reading the file
    reader.readAsDataURL(file);
  } else {
    alert('Please upload an image file');
  }
}

// Update custom text
function updateCustomText(e) {
  // In the future, this would add text to the 3D model
  // Currently only a placeholder
}

// Set up Three.js scene
function setupThreeJsScene() {
  // Create scene
  scene = new THREE.Scene();
  const PREVIEW_BG_COLOR = 0xf5f5f5; // Light gray background - constant
  scene.background = new THREE.Color(PREVIEW_BG_COLOR);
  
  // Create camera
  camera = new THREE.PerspectiveCamera(
    45,
    threejsContainer.clientWidth / threejsContainer.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 4); // Position the camera directly in front of the model
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(threejsContainer.clientWidth, threejsContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  threejsContainer.appendChild(renderer.domElement);
  
  // Add controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.minDistance = 2; // Allow user to zoom in closer
  controls.maxDistance = 8; // Don't let them zoom out too far
  controls.enablePan = false; // Disable panning for better UX
  controls.target.set(0, 0, 0); // Set the orbit target to the center of the model
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 5);
  directionalLight.castShadow = true;
  
  // Improve shadow quality
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);
  
  // Add a soft light from the front for better visibility of the t-shirt front
  const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
  frontLight.position.set(0, 0, 5);
  scene.add(frontLight);
  
  // Add a soft light from the bottom for better visibility
  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3);
  bottomLight.position.set(0, -10, 5);
  scene.add(bottomLight);
  
  // Load the initial model
  loadInitialModel();
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Start animation loop
  animate();
}

// Load initial 3D model
function loadInitialModel() {
  if (isModelLoading) return;
  isModelLoading = true;
  
  // Show loading indicator
  threejsContainer.classList.add('loading');
  
  // Create a placeholder model
  createPlaceholderModel('T-Shirt', scene, THREE)
    .then(model => {
      tshirtModel = model;
      
      // If there's already an image uploaded, apply it to the model
      if (printImage.src && !printImage.src.includes('placeholder')) {
        updateModelTexture(tshirtModel, printImage.src, THREE);
      }
      
      isModelLoading = false;
      threejsContainer.classList.remove('loading');
    })
    .catch(error => {
      console.error('Error loading initial model:', error);
      isModelLoading = false;
      threejsContainer.classList.remove('loading');
    });
}

// Update product model based on selection
function updateProductModel(productType) {
  if (isModelLoading) return;
  isModelLoading = true;
  
  // Show loading indicator
  threejsContainer.classList.add('loading');
  
  // Create a new model for the selected product type
  createPlaceholderModel(productType, scene, THREE)
    .then(model => {
      tshirtModel = model;
      
      // Apply current image if one exists
      if (printImage.src && !printImage.src.includes('placeholder')) {
        updateModelTexture(tshirtModel, printImage.src, THREE);
      }
      
      isModelLoading = false;
      threejsContainer.classList.remove('loading');
    })
    .catch(error => {
      console.error('Error updating model:', error);
      isModelLoading = false;
      threejsContainer.classList.remove('loading');
    });
}

// Handle window resize
function onWindowResize() {
  camera.aspect = threejsContainer.clientWidth / threejsContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(threejsContainer.clientWidth, threejsContainer.clientHeight);
  
  // Maintain consistent background color even after resize
  const PREVIEW_BG_COLOR = 0xf5f5f5; // Light gray background - constant
  scene.background = new THREE.Color(PREVIEW_BG_COLOR);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  if (controls) controls.update();
  
  // Add subtle rotation to the model for better presentation
  if (window.currentModel) {
    window.currentModel.rotation.y += 0.001;
  }
  
  renderer.render(scene, camera);
}

// Toggle between different themes
let currentTheme = 0;
function toggleTheme() {
  const themes = ['theme-dark', 'theme-light', 'theme-vibrant'];
  const themeNames = ['Dark', 'Light', 'Vibrant'];
  
  currentTheme = (currentTheme + 1) % themes.length;
  
  // Remove all theme classes
  document.body.classList.remove(...themes);
  // Add new theme class
  document.body.classList.add(themes[currentTheme]);
  
  // Keep 3D scene background consistent - NEVER change it during theme switch
  if (scene) {
    const PREVIEW_BG_COLOR = 0xf5f5f5; // Light gray background - constant
    scene.background = new THREE.Color(PREVIEW_BG_COLOR);
  }
  
  // Show theme notification
  const notification = document.createElement('div');
  notification.textContent = `${themeNames[currentTheme]} Theme`;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--panel-bg);
    color: var(--text-color);
    padding: 10px 20px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    font-family: var(--font-family);
    box-shadow: 0 4px 6px var(--shadow-color);
    animation: fadeInOut 2s forwards;
    z-index: 1000;
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after animation
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Add CSS animation for theme notification
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 
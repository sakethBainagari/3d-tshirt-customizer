/**
 * Model loader utility for the t-shirt customizer
 * Based on the repository https://github.com/Starklord17/threejs-t-shirt
 */

// Model settings 
const MODEL_SETTINGS = {
  tshirt: {
    path: './assets/models/shirt_baked.glb',
    position: [0, 0, 0],
    scale: [2.5, 2.5, 2.5],
    rotation: [0, 0, 0]
  },
  hoodie: {
    path: './assets/models/hoodie.glb',
    position: [0, -0.5, 0],
    scale: [2.5, 2.5, 2.5],
    rotation: [0, 0, 0]
  },
  sleevie: {
    path: './assets/models/long_sleeve.glb',
    position: [0, -0.2, 0],
    scale: [2.5, 2.5, 2.5],
    rotation: [0, 0, 0]
  },
  cap: {
    path: './assets/models/cap.glb',
    position: [0, 0, 0],
    scale: [2.5, 2.5, 2.5],
    rotation: [0.5, 0, 0]
  }
};

// Keep track of loaded models to avoid reloading
const modelCache = {};

/**
 * Creates a 3D model for different garment types
 */
export function createPlaceholderModel(type, scene, THREE) {
  // Remove any existing model from the scene
  if (window.currentModel) {
    console.log("Removing previous model:", window.currentModel);
    scene.remove(window.currentModel);
  }
  
  // Lowercase the type for consistency
  const productType = type.toLowerCase();
  
  // Normalize the type name
  const modelType = productType === 't-shirt' ? 'tshirt' : productType;
  
  // Get settings for the model
  const settings = MODEL_SETTINGS[modelType] || MODEL_SETTINGS.tshirt;
  
  // Create a loading placeholder
  const loadingPlaceholder = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ 
      color: 0xcccccc,
      wireframe: true
    })
  );
  
  loadingPlaceholder.position.set(0, 0, 0);
  scene.add(loadingPlaceholder);
  
  console.log(`Creating model for: ${modelType}`);
  
  // For now, we'll use the t-shirt model for all types temporarily
  // When you have more models, you can switch to the proper conditional
  const modelPath = './assets/models/shirt_baked.glb';
  
  // Try to load the model
  return loadModel(modelPath, scene, THREE)
    .then(model => {
      // Remove the loading placeholder
      scene.remove(loadingPlaceholder);
      
      console.log("Model loaded successfully:", model);
      
      // Apply settings
      model.position.set(...settings.position);
      model.scale.set(...settings.scale);
      model.rotation.set(...settings.rotation);
      
      // Store the main mesh for texture mapping
      model.traverse(child => {
        if (child.isMesh) {
          console.log("Found mesh in model:", child);
          model.mainMesh = child;
        }
      });
      
      // Add the model to the scene
      scene.add(model);
      
      // Store the current model
      window.currentModel = model;
      
      return model;
    })
    .catch(error => {
      console.error('Error loading model:', error);
      
      // If there's an error, use a fallback geometry
      console.log("Using fallback model");
      const fallbackModel = createFallbackModel(modelType, THREE);
      scene.remove(loadingPlaceholder);
      scene.add(fallbackModel);
      window.currentModel = fallbackModel;
      
      return fallbackModel;
    });
}

/**
 * Load a 3D model from a GLTF file
 */
function loadModel(path, scene, THREE) {
  // Use cached model if available
  if (modelCache[path]) {
    console.log("Using cached model");
    return Promise.resolve(modelCache[path].clone());
  }
  
  // Create a GLTFLoader if not available
  if (!window.GLTFLoader) {
    try {
      window.GLTFLoader = new THREE.GLTFLoader();
    } catch (e) {
      console.error('GLTFLoader not available:', e);
      return Promise.reject(new Error('GLTFLoader not available'));
    }
  }
  
  return new Promise((resolve, reject) => {
    window.GLTFLoader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        
        // Optimize and prepare the model
        let mainMesh = null;
        
        // Enable shadows and find the main mesh
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            
            // Store reference to main mesh
            mainMesh = node;
            model.mainMesh = node;
            
            // Create a new solid black material for the t-shirt
            node.material = new THREE.MeshStandardMaterial({
              color: 0x000000, // Pure black
              roughness: 0.5,
              metalness: 0.1,
              side: THREE.DoubleSide
            });
          }
        });
        
        // If we found a main mesh, adjust it
        if (mainMesh) {
          console.log("Main mesh found and color set to black:", mainMesh);
        } else {
          console.warn("No meshes found in the model");
        }
        
        // Cache the model
        modelCache[path] = model.clone();
        
        resolve(model);
      },
      // onProgress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // onError callback
      (error) => {
        console.error('Error loading model:', error);
        reject(error);
      }
    );
  });
}

/**
 * Creates a fallback model if loading fails
 */
function createFallbackModel(type, THREE) {
  let geometry;
  let model;
  
  // Create different geometries based on the type
  switch(type) {
    case 'hoodie':
      geometry = new THREE.BoxGeometry(1.2, 1.5, 0.7);
      break;
    case 'sleevie':
      geometry = new THREE.BoxGeometry(1.2, 1.3, 0.5);
      break;
    case 'cap':
      geometry = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
      break;
    default: // T-Shirt
      geometry = new THREE.BoxGeometry(1, 1.4, 0.3);
  }
  
  model = new THREE.Mesh(
    geometry, 
    new THREE.MeshStandardMaterial({ 
      color: 0x000000, // Black color
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.1
    })
  );
  
  // Apply settings
  const settings = MODEL_SETTINGS[type] || MODEL_SETTINGS.tshirt;
  
  model.position.set(...settings.position);
  model.scale.set(...settings.scale);
  model.rotation.set(...settings.rotation);
  
  // Create a front panel for image placement
  const frontPanel = createFrontPanel(type, THREE);
  model.frontPanel = frontPanel;
  model.add(frontPanel);
  
  return model;
}

/**
 * Creates a front panel for the fallback model
 */
function createFrontPanel(type, THREE) {
  let frontPanel;
  
  if (type === 'cap') {
    // For a cap, create a curved panel
    frontPanel = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32, Math.PI * 1.2, Math.PI * 0.6, Math.PI * 0.25, Math.PI * 0.25),
      new THREE.MeshStandardMaterial({
        color: 0x000000, // Black color 
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.1
      })
    );
    frontPanel.position.set(0, 0, 0.45);
  } else {
    // For other garments, create a flat panel
    const width = type === 'sleevie' ? 0.6 : 0.7;
    const height = 0.7;
    frontPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshStandardMaterial({
        color: 0x000000, // Black color
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.1
      })
    );
    frontPanel.position.set(0, type === 'hoodie' ? 0 : 0.1, 0.2);
  }
  
  return frontPanel;
}

/**
 * Updates the texture on the model
 */
export function updateModelTexture(model, imageSrc, THREE) {
  if (!model) return;
  
  // Debug logging to help troubleshoot
  console.log("Updating texture:", model, imageSrc);
  
  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "Anonymous";
  
  // Create a temporary image to extract color
  const tempImage = new Image();
  tempImage.crossOrigin = "Anonymous";
  
  tempImage.onload = function() {
    // Create a canvas to analyze the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = tempImage.width;
    canvas.height = tempImage.height;
    ctx.drawImage(tempImage, 0, 0);
    
    // Get image data from the center of the image
    const imageData = ctx.getImageData(
      Math.floor(tempImage.width / 4),
      Math.floor(tempImage.height / 4),
      Math.floor(tempImage.width / 2),
      Math.floor(tempImage.height / 2)
    );
    
    // Calculate dominant color
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
      count++;
    }
    
    // Average the colors
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
    
    // Convert RGB to hex color
    const dominantColor = (r << 16) | (g << 8) | b;
    
    // Load and apply the texture
    textureLoader.load(imageSrc, (texture) => {
      console.log("Texture loaded successfully:", texture);
      
      // Apply the texture to the model
      if (model.mainMesh) {
        console.log("Applying to main mesh:", model.mainMesh);
        
        // Set texture properties for better quality
        texture.anisotropy = 16;
        texture.encoding = THREE.sRGBEncoding;
        
        // Create a new material with the dominant color as base
        const material = new THREE.MeshStandardMaterial({
          color: dominantColor,
          map: texture,
          side: THREE.DoubleSide,
          roughness: 0.5,
          metalness: 0.1
        });
        
        // Apply custom texture coordinates if needed
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        // Replace the material
        model.mainMesh.material = material;
        model.mainMesh.material.needsUpdate = true;
        
        console.log("Texture and color applied to 3D model");
      } else if (model.frontPanel) {
        // For fallback models, apply texture to the front panel
        console.log("Applying to front panel:", model.frontPanel);
        
        const imgWidth = texture.image.width;
        const imgHeight = texture.image.height;
        const imgAspect = imgWidth / imgHeight;
        
        // Get the aspect ratio of the front panel
        const frontPanel = model.frontPanel;
        const panelGeometry = frontPanel.geometry;
        let panelWidth, panelHeight;
        
        if (panelGeometry instanceof THREE.PlaneGeometry) {
          panelWidth = panelGeometry.parameters.width;
          panelHeight = panelGeometry.parameters.height;
        } else {
          panelWidth = 1;
          panelHeight = 1;
        }
        
        const panelAspect = panelWidth / panelHeight;
        
        // Calculate the texture scaling to maintain aspect ratio
        let offsetX = 0, offsetY = 0;
        let repeatX = 1, repeatY = 1;
        
        if (imgAspect > panelAspect) {
          repeatY = panelAspect / imgAspect;
          offsetY = (1 - repeatY) / 2;
        } else {
          repeatX = imgAspect / panelAspect;
          offsetX = (1 - repeatX) / 2;
        }
        
        texture.offset.set(offsetX, offsetY);
        texture.repeat.set(repeatX, repeatY);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        // Apply the texture and color to the front panel
        frontPanel.material = new THREE.MeshStandardMaterial({
          color: dominantColor,
          map: texture,
          side: THREE.DoubleSide,
          roughness: 0.5,
          metalness: 0.1
        });
      } else {
        // If model structure is different, try to find mesh child
        console.log("No mainMesh or frontPanel found, searching for child meshes");
        
        let meshFound = false;
        
        // Try to find a mesh to apply the texture to
        model.traverse((child) => {
          if (!meshFound && child.isMesh) {
            console.log("Found mesh child:", child);
            child.material = new THREE.MeshStandardMaterial({
              color: dominantColor,
              map: texture,
              side: THREE.DoubleSide,
              roughness: 0.5,
              metalness: 0.1
            });
            child.material.needsUpdate = true;
            meshFound = true;
          }
        });
      }
    }, 
    undefined,
    (error) => {
      console.error("Error loading texture:", error);
    });
  };
  
  tempImage.onerror = function(error) {
    console.error("Error loading image for color extraction:", error);
  };
  
  tempImage.src = imageSrc;
} 
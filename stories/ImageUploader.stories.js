export default {
  title: 'Components/ImageUploader',
};

export const ImageUploader = () => {
  // Create a container for the component
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.maxWidth = '500px';
  
  // Create image uploader HTML
  container.innerHTML = `
    <div class="file-upload">
      <label for="image-upload-story">Upload Your Image</label>
      <input type="file" id="image-upload-story" accept="image/*">
      <div id="drop-area-story">
        <p>Or drag and drop your image here</p>
      </div>
      <div class="preview-container" style="margin-top: 15px; display: none;">
        <h4>Preview:</h4>
        <img id="preview-image-story" src="" alt="Preview" style="max-width: 100%; max-height: 200px;">
      </div>
    </div>
  `;
  
  // Add the necessary styles
  const style = document.createElement('style');
  style.textContent = `
    *, *:after, *:before { box-sizing: border-box; }
    
    :root {
      --accent: hsl(230 80% 50%);
      --border-color: hsl(0 0% 70%);
    }
    
    .file-upload {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    label {
      display: block;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    input[type="file"] {
      width: 100%;
      margin-bottom: 10px;
    }
    
    #drop-area-story {
      border: 2px dashed var(--border-color);
      border-radius: 5px;
      padding: 20px;
      text-align: center;
      margin-top: 10px;
      transition: background-color 0.3s;
      cursor: pointer;
    }
    
    #drop-area-story.highlight {
      background-color: hsla(230, 80%, 90%, 0.3);
    }
    
    h4 {
      margin-top: 0;
      margin-bottom: 10px;
      color: var(--accent);
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listeners
  setTimeout(() => {
    const dropArea = document.getElementById('drop-area-story');
    const fileInput = document.getElementById('image-upload-story');
    const previewImage = document.getElementById('preview-image-story');
    const previewContainer = container.querySelector('.preview-container');
    
    // File input change
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    // Drag and drop functionality
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('highlight');
    });
    
    dropArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('highlight');
    });
    
    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('highlight');
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.match('image.*')) {
        fileInput.files = e.dataTransfer.files;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
      }
    });
  }, 100);
  
  return container;
}; 
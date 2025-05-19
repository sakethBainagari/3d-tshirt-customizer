export default {
  title: 'Components/ProductSelector',
  argTypes: {
    initialProduct: { control: 'select', options: ['T-Shirt', 'Hoodie', 'Sleevie', 'Cap'] }
  },
};

export const ProductSelector = ({ initialProduct = 'T-Shirt' }) => {
  // Create a container for the component
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.maxWidth = '300px';
  
  // Create product selector HTML
  container.innerHTML = `
    <div class="product-type">
      <h3>Product Type</h3>
      <button popovertarget="product-pop-story">
        <span>Type:</span>
        <span id="selected-product-story">${initialProduct}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      </button>
      <div id="product-pop-story" popover="auto">
        <div class="popover__content">
          <ul>
            <li>
              <button data-value="T-Shirt" data-selected="${initialProduct === 'T-Shirt'}" popovertarget="product-pop-story">
                T-Shirt
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </li>
            <li>
              <button data-value="Hoodie" data-selected="${initialProduct === 'Hoodie'}" popovertarget="product-pop-story">
                Hoodie
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </li>
            <li>
              <button data-value="Sleevie" data-selected="${initialProduct === 'Sleevie'}" popovertarget="product-pop-story">
                Sleevie
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </li>
            <li>
              <button data-value="Cap" data-selected="${initialProduct === 'Cap'}" popovertarget="product-pop-story">
                Cap
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  // Add the necessary styles
  const style = document.createElement('style');
  style.textContent = `
    *, *:after, *:before { box-sizing: border-box; }
    
    :root {
      --speed: 0.5s;
      --accent: hsl(230 80% 50%);
      --width: 160px;
      --ease: ease-in;
    }
    
    .product-type {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      margin-top: 0;
      color: var(--accent);
      font-weight: 500;
    }
    
    [popovertarget] {
      font-size: 0.875rem;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: hsl(0 0% 98%);
      border-radius: 6px;
      border: 1px solid hsl(0 0% 60%);
      outline-color: var(--accent);
      width: var(--width);
      cursor: pointer;
    }
    
    [popovertarget] svg {
      width: 24px;
      height: 1rem;
      opacity: 0.5;
    }
    
    [popovertarget] span:first-of-type {
      opacity: 0.5;
    }
    
    [popovertarget] span:last-of-type {
      flex: 1;
      text-align: left;
    }
    
    [popover] {
      inset: unset;
      width: var(--width);
      border: 0;
      padding: 0;
      background: transparent;
      transform-style: preserve-3d;
      overflow: visible;
      font-weight: 300;
      clip-path: inset(0 -100% -100vh -100%);
      max-height: 40vh;
    }
    
    .popover__content {
      position: relative;
      transform-style: preserve-3d;
      perspective: 500px;
    }
    
    .popover__content ul {
      border: 1px solid hsl(0 0% 60%);
      border-radius: 6px;
      padding: 0.25rem;
      background: hsl(0 0% 98%);
      transform-origin: 50% 0;
      margin: 0;
      padding: 0;
      list-style-type: none;
      display: grid;
      gap: 0.25rem;
      transform-style: preserve-3d;
      max-height: 40vh;
      overflow: auto;
    }
    
    .popover__content button {
      width: 100%;
      display: flex;
      border: 0;
      background: transparent;
      padding: 0.5rem;
      margin: 0;
      font-weight: 300;
      color: hsl(0 0% 10%);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 0.875rem;
      justify-content: space-between;
      outline: none;
    }
    
    .popover__content button svg {
      stroke: var(--accent);
      stroke-width: 3;
      display: none;
    }
    
    .popover__content button[data-selected=true] svg {
      display: block;
    }
  `;
  
  document.head.appendChild(style);
  
  // Add event listeners 
  setTimeout(() => {
    const pop = document.getElementById('product-pop-story');
    const productLabel = document.getElementById('selected-product-story');
    
    const handleSelect = (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      
      const value = button.dataset.value;
      
      // Update selected option
      const selectedButton = pop.querySelector('[data-selected=true]');
      if (selectedButton) {
        selectedButton.dataset.selected = 'false';
      }
      
      button.dataset.selected = 'true';
      productLabel.textContent = value;
    };
    
    pop.addEventListener('click', handleSelect);
  }, 100);
  
  return container;
}; 
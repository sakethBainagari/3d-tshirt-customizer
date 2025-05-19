/**
 * Simple polyfill for browsers that don't support the Popover API
 * Based on the @oddbird/popover-polyfill library
 */

// Check if the Popover API is supported
export function isPopoverSupported() {
  return HTMLElement.prototype.hasOwnProperty('popover') ||
    HTMLElement.prototype.hasOwnProperty('showPopover') ||
    HTMLElement.prototype.hasOwnProperty('hidePopover');
}

// Apply the polyfill if needed
export function applyPopoverPolyfill() {
  if (isPopoverSupported()) {
    return; // Popover API already supported
  }

  // Keep track of all popovers
  const popovers = new Set();
  
  // Helper to hide all popovers
  const hideAllPopovers = () => {
    popovers.forEach(popover => {
      if (popover.hasAttribute('popovershow')) {
        hidePopover(popover);
      }
    });
  };
  
  // Add click handler to document to close popovers when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[popovershow]') && !e.target.closest('[popovertarget]')) {
      hideAllPopovers();
    }
  });
  
  // Add ESC key handler to close popovers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAllPopovers();
    }
  });
  
  // Position the popover near its trigger
  const positionPopover = (popover, trigger) => {
    if (!trigger) return;
    
    const triggerRect = trigger.getBoundingClientRect();
    const popoverWidth = popover.offsetWidth || parseInt(getComputedStyle(popover).width) || 160;
    
    // Calculate position
    const left = triggerRect.left;
    const top = triggerRect.bottom + 5;
    
    // Apply position
    popover.style.position = 'fixed';
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.width = `${popoverWidth}px`;
    popover.style.zIndex = '1000';
  };
  
  // Show popover function
  const showPopover = (popover) => {
    // Find corresponding trigger
    const targetId = popover.id;
    const triggers = document.querySelectorAll(`[popovertarget="${targetId}"]`);
    const trigger = triggers[0];
    
    // Add 'popovershow' attribute
    popover.setAttribute('popovershow', '');
    
    // Dispatch beforetoggle event
    popover.dispatchEvent(new CustomEvent('beforetoggle', {
      bubbles: true,
      detail: { newState: 'open', oldState: 'closed' }
    }));
    
    // Show the popover
    popover.style.display = 'block';
    
    // Position the popover
    positionPopover(popover, trigger);
    
    // Dispatch toggle event
    popover.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { newState: 'open', oldState: 'closed' }
    }));
  };
  
  // Hide popover function
  const hidePopover = (popover) => {
    // Dispatch beforetoggle event
    popover.dispatchEvent(new CustomEvent('beforetoggle', {
      bubbles: true,
      detail: { newState: 'closed', oldState: 'open' }
    }));
    
    // Remove 'popovershow' attribute
    popover.removeAttribute('popovershow');
    
    // Hide the popover
    popover.style.display = 'none';
    
    // Dispatch toggle event
    popover.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { newState: 'closed', oldState: 'open' }
    }));
  };
  
  // Toggle popover function
  const togglePopover = (popover) => {
    if (popover.hasAttribute('popovershow')) {
      hidePopover(popover);
    } else {
      // Hide all other popovers before showing this one
      hideAllPopovers();
      showPopover(popover);
    }
  };
  
  // Initialize the polyfill
  const initPopover = () => {
    // Find all elements with 'popover' attribute
    document.querySelectorAll('[popover]').forEach(popover => {
      // Add to our set of popovers
      popovers.add(popover);
      
      // Hide initially
      popover.style.display = 'none';
      
      // Add the native methods if they don't exist
      if (!popover.showPopover) {
        popover.showPopover = () => showPopover(popover);
      }
      
      if (!popover.hidePopover) {
        popover.hidePopover = () => hidePopover(popover);
      }
      
      if (!popover.togglePopover) {
        popover.togglePopover = () => togglePopover(popover);
      }
    });
    
    // Find all trigger buttons
    document.querySelectorAll('[popovertarget]').forEach(trigger => {
      const targetId = trigger.getAttribute('popovertarget');
      const target = document.getElementById(targetId);
      
      if (target) {
        // Add click handler to toggle the popover
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          togglePopover(target);
        });
      }
    });
    
    // Add window resize handler
    window.addEventListener('resize', () => {
      popovers.forEach(popover => {
        if (popover.hasAttribute('popovershow')) {
          const targetId = popover.id;
          const triggers = document.querySelectorAll(`[popovertarget="${targetId}"]`);
          const trigger = triggers[0];
          positionPopover(popover, trigger);
        }
      });
    });
  };
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopover);
  } else {
    initPopover();
  }
  
  // Re-init when DOM changes to catch new popovers
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          initPopover();
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }
}

// Auto-apply on import
if (!isPopoverSupported()) {
  applyPopoverPolyfill();
} 
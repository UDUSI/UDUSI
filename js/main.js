// Provenance panel functionality
const provenanceBtn = document.getElementById('provenance-btn');
const provenancePanel = document.getElementById('provenance-panel');
const closeBtn = document.querySelector('.close-btn');
const provenanceText = document.getElementById('provenance-text');

provenanceBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default button behavior
    provenancePanel.classList.add('active');
});

closeBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default button behavior
    provenancePanel.classList.remove('active');
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    if (!provenancePanel.contains(e.target) &&
        !provenanceBtn.contains(e.target) &&
        provenancePanel.classList.contains('active')) {
        provenancePanel.classList.remove('active');
    }
});

function updateSubtitle() {
    const iframe = document.getElementById('content-container');
    const subtitle = document.getElementById('page-subtitle');

    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const pageTitle = iframeDoc.querySelector('title')?.textContent || 'Loading...';
        subtitle.textContent = pageTitle;

        // Extract and update provenance information
        const provenanceElement = iframeDoc.getElementById('provenance-data');
        if (provenanceElement) {
            provenanceText.innerHTML = provenanceElement.innerHTML;
        } else {
            provenanceText.innerHTML = 'No provenance information available for this page.';
        }
    } catch (e) {
        console.error('Error updating subtitle:', e);
        subtitle.textContent = 'Loading...';
    }
}

// Add visual feedback for focus
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-list button');
    
    // Add focus and blur handlers for visual feedback
    navButtons.forEach(button => {
        button.addEventListener('focus', () => {
            button.style.outline = '2px solid #4a90e2';
        });
        
        button.addEventListener('blur', () => {
            button.style.outline = 'none';
        });
    });
});

// Improved content loading function with better error handling
function loadContent(url) {
    const contentFrame = document.getElementById('content-container');
    const loading = document.querySelector('.loading');

    // Show loading indicator
    loading.classList.add('active');
    
    // Set a loading timeout
    const loadingTimeout = setTimeout(() => {
        if (loading.classList.contains('active')) {
            console.warn('Content loading is taking longer than expected');
        }
    }, 3000);
    
    // Set onload handler
    contentFrame.onload = () => {
        clearTimeout(loadingTimeout);
        loading.classList.remove('active');
        updateSubtitle();
    };
    
    // Set onerror handler
    contentFrame.onerror = (error) => {
        clearTimeout(loadingTimeout);
        loading.classList.remove('active');
        console.error('Error loading content:', error);
        contentFrame.srcdoc = `<html><body><h1>Error Loading Content</h1><p>Failed to load: ${url}</p></body></html>`;
    };

    // Load the content
    try {
        contentFrame.src = url;
    } catch (error) {
        clearTimeout(loadingTimeout);
        loading.classList.remove('active');
        console.error('Error setting iframe src:', error);
    }
}

// Improved click handler for navigation
document.addEventListener('DOMContentLoaded', () => {
    // Navigation event delegation with improved handling
    const navList = document.querySelector('.nav-list');
    
    navList.addEventListener('click', (e) => {
        // Find the button element (could be the button itself or a child like <i>)
        let target = e.target;
        while (target !== navList && target.tagName !== 'BUTTON') {
            target = target.parentElement;
        }
        
        if (target !== navList && target.tagName === 'BUTTON') {
            // Remove active class from all buttons
            document.querySelectorAll('.nav-list button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            target.classList.add('active');
            
            // Load content
            if (target.dataset.page) {
                loadContent(target.dataset.page);
                
                // For debugging specifically the CF notes issue
                if (target.id === 'cf-notes-btn') {
                    console.log('CF Notes button clicked, loading:', target.dataset.page);
                }
            }
        }
    });

    // Load the default page
    const defaultPage = document.querySelector('.nav-list button.active');
    if (defaultPage) {
        loadContent(defaultPage.dataset.page);
    }
    
    // Add specific handling for the problematic CF notes button
    const cfNotesBtn = document.getElementById('cf-notes-btn');
    if (cfNotesBtn) {
        cfNotesBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop event bubbling
            
            // Explicit handling of this specific button
            document.querySelectorAll('.nav-list button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            cfNotesBtn.classList.add('active');
            loadContent(cfNotesBtn.dataset.page);
            console.log('CF Notes direct handler called');
        });
    }
});

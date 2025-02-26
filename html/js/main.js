// Provenance panel functionality
const provenanceBtn = document.getElementById('provenance-btn');
const provenancePanel = document.getElementById('provenance-panel');
const closeBtn = document.querySelector('.close-btn');
const provenanceText = document.getElementById('provenance-text');

provenanceBtn.addEventListener('click', () => {
    provenancePanel.classList.add('active');
});

closeBtn.addEventListener('click', () => {
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
        const pageTitle = iframeDoc.querySelector('title')?.textContent ||
                        iframeDoc.querySelector('h1')?.textContent ||
                        'Loading...';

        // Update subtitle
        subtitle.textContent = pageTitle;

        // Extract and update provenance information
        const provenanceElement = iframeDoc.getElementById('provenance-data');
        if (provenanceElement) {
            provenanceText.innerHTML = provenanceElement.innerHTML;
        } else {
            provenanceText.innerHTML = 'No provenance information available for this page.';
        }

        // Remove the title from the content if it exists
        const contentTitle = iframeDoc.querySelector('h1');
        if (contentTitle) {
            contentTitle.style.display = 'none';
        }
    } catch (e) {
        console.error('Error updating subtitle:', e);
        subtitle.textContent = 'Loading...';
    }
}

function loadContent(url) {
    const contentFrame = document.getElementById('content-container');
    const loading = document.querySelector('.loading');

    loading.classList.add('active');

    contentFrame.onload = () => {
        loading.classList.remove('active');
        updateSubtitle();
    };

    contentFrame.src = url;
}

document.querySelector('.nav-list').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        document.querySelectorAll('.nav-list button').forEach(btn =>
            btn.classList.remove('active'));
        e.target.classList.add('active');
        loadContent(e.target.dataset.page);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const defaultPage = document.querySelector('.nav-list button.active');
    if (defaultPage) {
        loadContent(defaultPage.dataset.page);
    }
});

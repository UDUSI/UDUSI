// Modal functionality for license display
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal element
    const modal = document.getElementById('licenseModal');

    // Get the button that opens the modal
    const viewLicenseBtn = document.getElementById('viewLicenseBtn');

    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector('.license-modal-close');

    // Get the license text container
    const licenseTextContainer = document.getElementById('license-text-container');

    // Function to load the license text
    async function loadLicenseText() {
        try {
            const response = await fetch('../text/UDUNITS2-COPYRIGHT');
            if (response.ok) {
                const licenseText = await response.text();
                licenseTextContainer.textContent = licenseText;
            } else {
                licenseTextContainer.textContent = 'Error loading license text. Please try again later.';
            }
        } catch (error) {
            console.error('Error loading license text:', error);
            licenseTextContainer.textContent = 'Error loading license text. Please try again later.';
        }
    }

    // When the user clicks the button, open the modal and load the license text
    if (viewLicenseBtn) {
        viewLicenseBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            // Add class to body to prevent scrolling when modal is open
            document.body.classList.add('modal-open');

            // Load the license text if not already loaded
            if (licenseTextContainer.textContent === 'Loading license text...' ||
                licenseTextContainer.textContent.includes('Error loading')) {
                loadLicenseText();
            }
        });
    }

    // When the user clicks on the close button, close the modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            // Remove class from body to allow scrolling again
            document.body.classList.remove('modal-open');
        });
    }

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            // Remove class from body to allow scrolling again
            document.body.classList.remove('modal-open');
        }
    });
});

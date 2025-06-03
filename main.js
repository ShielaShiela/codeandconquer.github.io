
// Country autocomplete functionality
const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
    'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cambodia',
    'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
    'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania',
    'Luxembourg', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand',
    'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore',
    'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain',
    'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Venezuela', 'Vietnam'
];

const countryInput = document.getElementById('country');
const countryDropdown = document.getElementById('countryDropdown');
let highlightedIndex = -1;

countryInput.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    const filteredCountries = countries.filter(country => 
        country.toLowerCase().includes(value)
    );

    if (value && filteredCountries.length > 0) {
        showCountryDropdown(filteredCountries);
    } else {
        hideCountryDropdown();
    }
});

countryInput.addEventListener('keydown', function(e) {
    const options = countryDropdown.querySelectorAll('.country-option');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, options.length - 1);
        updateHighlight(options);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        updateHighlight(options);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        selectCountry(options[highlightedIndex].textContent);
    } else if (e.key === 'Escape') {
        hideCountryDropdown();
    }
});

function showCountryDropdown(countries) {
    countryDropdown.innerHTML = '';
    countries.slice(0, 8).forEach(country => {
        const option = document.createElement('div');
        option.className = 'country-option';
        option.textContent = country;
        option.addEventListener('click', () => selectCountry(country));
        countryDropdown.appendChild(option);
    });
    countryDropdown.classList.add('show');
    highlightedIndex = -1;
}

function hideCountryDropdown() {
    countryDropdown.classList.remove('show');
    highlightedIndex = -1;
}

function updateHighlight(options) {
    options.forEach((option, index) => {
        option.classList.toggle('highlighted', index === highlightedIndex);
    });
}

function selectCountry(country) {
    countryInput.value = country;
    hideCountryDropdown();
}

// Hide dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!countryInput.contains(e.target) && !countryDropdown.contains(e.target)) {
        hideCountryDropdown();
    }
});

// Course selection functionality
document.querySelectorAll('.course-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove selected class from all options
        document.querySelectorAll('.course-option').forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        this.classList.add('selected');
        
        // Update hidden input
        document.getElementById('selectedCourse').value = this.dataset.course;
    });
});

// Form submission
document.getElementById('trialBookingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate course selection
    if (!document.getElementById('selectedCourse').value) {
        alert('Please select a course you want to learn.');
        return;
    }
    
    // Show loading
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('submitBtn').disabled = true;
    
    // Collect form data
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Add timestamp and debug info
    data.timestamp = new Date().toISOString();
    
    // Debug: Log the data being sent
    console.log('Form data being sent:', data);
    
    try {
        // Submit to Google Apps Script
        // REPLACE 'YOUR_GOOGLE_APPS_SCRIPT_URL' with your actual deployed script URL
        const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
        
        console.log('Sending to URL:', scriptUrl);
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (response.ok && responseData.success) {
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
            
            // Reset form
            this.reset();
            document.querySelectorAll('.course-option').forEach(opt => opt.classList.remove('selected'));
            document.getElementById('selectedCourse').value = '';
            
            // Scroll to calendar section
            document.querySelector('.calendar-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error(responseData.error || 'Server returned an error');
        }
    } catch (error) {
        console.error('Error details:', error);
        document.getElementById('errorMessage').innerHTML = `
            ❌ Error: ${error.message}<br>
            <small>Check browser console for details. Make sure your Google Apps Script URL is correct.</small>
        `;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    } finally {
        // Hide loading
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;
    }
});

// Auto-hide messages after 5 seconds
function hideMessage(elementId) {
    setTimeout(() => {
        document.getElementById(elementId).style.display = 'none';
    }, 5000);
}

// Watch for success/error messages and auto-hide them
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            if (mutation.target.style.display === 'block') {
                hideMessage(mutation.target.id);
            }
        }
    });
});

observer.observe(document.getElementById('successMessage'), { attributes: true });
observer.observe(document.getElementById('errorMessage'), { attributes: true });

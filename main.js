(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBookingForm);
    } else {
        initBookingForm();
    }
    
    function initBookingForm() {
        // Check if elements exist before initializing
        const countryInput = document.getElementById('country');
        const countryDropdown = document.getElementById('countryDropdown');
        const bookingForm = document.getElementById('trialBookingForm');
        
        if (!countryInput || !countryDropdown || !bookingForm) {
            console.log('Booking form elements not found, skipping initialization');
            return;
        }
        
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

        let highlightedIndex = -1;

        // Country input events
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

        function showCountryDropdown(countriesList) {
            countryDropdown.innerHTML = '';
            countriesList.slice(0, 8).forEach(country => {
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
            if (countryInput && countryDropdown && 
                !countryInput.contains(e.target) && !countryDropdown.contains(e.target)) {
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
                const selectedCourseInput = document.getElementById('selectedCourse');
                if (selectedCourseInput) {
                    selectedCourseInput.value = this.dataset.course;
                }
            });
        });

        // Form submission
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submission started');
            
            // Validate required fields
            const nickName = document.getElementById('nickName').value.trim();
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const country = document.getElementById('country').value.trim();
            const selectedCourse = document.getElementById('selectedCourse').value;
            
            if (!nickName || !firstName || !lastName || !email || !country) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!selectedCourse) {
                alert('Please select a course you want to learn.');
                return;
            }
            
            // Show loading
            const loadingIndicator = document.getElementById('loadingIndicator');
            const submitBtn = document.getElementById('submitBtn');
            
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            if (submitBtn) submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value.trim();
            });
            
            // Add timestamp
            data.timestamp = new Date().toISOString();
            
            console.log('Form data being sent:', data);
            
            try {
                // IMPORTANT: Your Google Apps Script URL
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbwbZpePWqbP828BRUX97KeqX6YCG46Xn5MOslKkGyEYHB3vpkzcStIvkej7viURgmtu/exec';
                
                console.log('Sending to URL:', scriptUrl);
                
                // Use FormData to avoid CORS preflight issues
                const formDataToSend = new FormData();
                Object.keys(data).forEach(key => {
                    formDataToSend.append(key, data[key]);
                });
                
                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    body: formDataToSend
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                const responseData = await response.json();
                console.log('Response data:', responseData);
                
                if (responseData.success) {
                    // Show success message
                    const successMessage = document.getElementById('successMessage');
                    const errorMessage = document.getElementById('errorMessage');
                    
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        setTimeout(() => {
                            successMessage.style.display = 'none';
                        }, 10000);
                    }
                    if (errorMessage) errorMessage.style.display = 'none';
                    
                    // Clear form
                    this.reset();
                    document.querySelectorAll('.course-option').forEach(opt => opt.classList.remove('selected'));
                    const selectedCourseInput = document.getElementById('selectedCourse');
                    if (selectedCourseInput) selectedCourseInput.value = '';
                    
                    // Scroll to calendar section after success
                    const calendarSection = document.querySelector('.calendar-section');
                    if (calendarSection) {
                        setTimeout(() => {
                            calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 500);
                    }
                    
                } else {
                    throw new Error(responseData.error || 'Server returned an error');
                }
                
                
                
            } catch (error) {
                console.error('Submission error:', error);
                
                const errorMessage = document.getElementById('errorMessage');
                const successMessage = document.getElementById('successMessage');
                
                if (errorMessage) {
                    errorMessage.innerHTML = `
                        ❌ <strong>Error:</strong> ${error.message}<br>
                        <small>Please check your internet connection and try again. If the problem persists, contact us directly at shielacabahug96@gmail.com</small>
                    `;
                    errorMessage.style.display = 'block';
                    
                    // Auto-hide after 15 seconds
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 15000);
                }
                if (successMessage) successMessage.style.display = 'none';
                
            } finally {
                // Hide loading
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
        
        console.log('Booking form initialized successfully');
    }
})();
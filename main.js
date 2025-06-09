(function() {
    'use strict';
    
    // Configuration
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTz9cB41_tTWqeuBMe4kSn18CUEa9Huk8w5UYeWT7xOJr03Jr6r5JTHwAVPX3G2YWj/exec';
    const ZOOM_SCHEDULER_URL = 'https://scheduler.zoom.us/shiela-cabahug/codenconquerclasses'; // Replace with your actual Zoom scheduler link
    
    // Store submitted form data
    let submittedTrialData = null;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBookingForm);
    } else {
        initBookingForm();
    }
    
    function initBookingForm() {
        console.log('🟢 Enhanced Trial Booking System Loading...');
        
        // Add CSS for smooth transitions
        addTransitionStyles();
        
        // Check if elements exist before initializing
        const countryInput = document.getElementById('country');
        const countryDropdown = document.getElementById('countryDropdown');
        const bookingForm = document.getElementById('trialBookingForm');
        
        if (!countryInput || !countryDropdown || !bookingForm) {
            console.log('Booking form elements not found, skipping initialization');
            return;
        }
        
        // Initialize step system
        initializeTrialSteps();
        
        // Country autocomplete functionality
        initCountryAutocomplete(countryInput, countryDropdown);
        
        // Course selection functionality
        initCourseSelection();
        
        // Form submission
        initFormSubmission(bookingForm);
        
        // Initialize global functions for step navigation
        initGlobalFunctions();
        
        console.log('🟢 Enhanced Trial Booking System Ready!');
        console.log('⚠️ Remember to replace ZOOM_SCHEDULER_URL with your actual Zoom scheduler link');
    }
    
    // Add smooth transition styles
    function addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .trial-step {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .success-message, .error-message {
                transition: all 0.3s ease;
            }
            
            .student-welcome {
                animation: slideInUp 0.5s ease;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize step system
    function initializeTrialSteps() {
        // Hide all steps first
        document.querySelectorAll('.trial-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show only Step 1
        const step1 = document.getElementById('trial-step-info');
        if (step1) {
            step1.classList.add('active');
        }
        
        // Set step indicator to Step 1
        updateTrialStepIndicator(1);
        
        console.log('📍 Initialized to Step 1');
    }
    
    // Update step indicators for trial booking
    function updateTrialStepIndicator(currentStep) {
        // Reset all dots
        for (let i = 1; i <= 2; i++) {
            const dot = document.getElementById(`trial-dot-${i}`);
            if (dot) {
                dot.classList.remove('active', 'completed');
            }
        }
        
        // Mark completed steps
        for (let i = 1; i < currentStep; i++) {
            const dot = document.getElementById(`trial-dot-${i}`);
            if (dot) {
                dot.classList.add('completed');
            }
        }
        
        // Mark current step
        const currentDot = document.getElementById(`trial-dot-${currentStep}`);
        if (currentDot) {
            currentDot.classList.add('active');
        }
    }

    // Show specific trial step
    function showTrialStep(stepId, stepNumber) {
        console.log(`🔄 Switching to step: ${stepId} (${stepNumber})`);
        
        // Hide all steps
        document.querySelectorAll('.trial-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.classList.add('active');
            console.log(`✅ Step ${stepId} is now active`);
        } else {
            console.error(`❌ Step ${stepId} not found`);
        }
        
        updateTrialStepIndicator(stepNumber);
    }
    
    // Country autocomplete functionality
    function initCountryAutocomplete(countryInput, countryDropdown) {
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
    }
    
    // Course selection functionality
    function initCourseSelection() {
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
    }
    
    // Form submission with step progression
    function initFormSubmission(bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🟡 Trial form submission started');
            
            // Validate required fields (including age)
            const nickName = document.getElementById('nickName').value.trim();
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const age = document.getElementById('age').value.trim(); // NEW: Age field
            const email = document.getElementById('email').value.trim();
            const country = document.getElementById('country').value.trim();
            const selectedCourse = document.getElementById('selectedCourse').value;
            const otherDetails = document.getElementById('otherDetails').value.trim() || '';
            
            console.log('📝 Form Data:', {
                nickName,
                firstName, 
                lastName,
                age, // NEW: Include age in logging
                email,
                country,
                selectedCourse,
                otherDetails
            });
            
            // Enhanced validation including age
            if (!nickName || !firstName || !lastName || !age || !email || !country) {
                showTrialError('Please fill in all required fields including age.');
                return;
            }
            
            // Validate age is a number and within range
            const ageNumber = parseInt(age);
            if (isNaN(ageNumber) || ageNumber < 3 || ageNumber > 100) {
                showTrialError('Please enter a valid age between 3 and 100.');
                return;
            }
            
            if (!selectedCourse) {
                showTrialError('Please select a course you want to learn.');
                return;
            }
            
            // Show loading with immediate feedback
            const loadingIndicator = document.getElementById('loadingIndicator');
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            // Immediate feedback
            if (successMessage) {
                successMessage.innerHTML = `🔄 Processing your trial class request... We'll contact you within 2-4 hours!`;
                successMessage.classList.add('show');
            }
            if (errorMessage) errorMessage.classList.remove('show');
            
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
            
            // Create FormData object (avoids CORS preflight completely)
            const formDataToSend = new FormData();
            formDataToSend.append('timestamp', new Date().toISOString());
            formDataToSend.append('nickName', nickName);
            formDataToSend.append('firstName', firstName);
            formDataToSend.append('lastName', lastName);
            formDataToSend.append('age', age); // NEW: Include age in FormData
            formDataToSend.append('email', email);
            formDataToSend.append('country', country);
            formDataToSend.append('course', selectedCourse);
            formDataToSend.append('otherDetails', otherDetails);
            formDataToSend.append('action', 'trial_booking'); // Add action for backend
            
            console.log('🚀 Sending trial booking...');
            console.log('FormData being sent:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}: ${value}`);
            }
            
            try {
                console.log('Sending FormData to:', GOOGLE_APPS_SCRIPT_URL);
                
                // Send FormData WITHOUT any headers (this avoids CORS preflight)
                const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: formDataToSend
                    // NO headers property at all - this is crucial!
                });
                
                console.log('📡 Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                
                const responseData = await response.json();
                console.log('📬 Response data:', responseData);
                
                if (responseData.success) {
                    console.log('🟢 SUCCESS!');
                    
                    // Store submitted data for Step 2 (including age)
                    submittedTrialData = {
                        nickName,
                        firstName,
                        lastName,
                        age, // NEW: Store age in submitted data
                        email,
                        country,
                        course: selectedCourse,
                        otherDetails
                    };
                    
                    // Hide loading immediately
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    
                    // Show success message with realistic expectations
                    const successMessage = document.getElementById('successMessage');
                    const errorMessage = document.getElementById('errorMessage');
                    
                    if (successMessage) {
                        successMessage.innerHTML = `✅ Trial class request submitted successfully! 
                        <br><strong>Next:</strong> We'll contact you within 2-4 hours to confirm your booking.
                        <br><small>💡 Check your email (including spam folder) for confirmation, or we'll reach out via WhatsApp.</small>`;
                        successMessage.classList.add('show');
                    }
                    if (errorMessage) errorMessage.classList.remove('show');
                    
                    // Move to booking step with minimal delay for smooth transition
                    setTimeout(() => {
                        if (successMessage) successMessage.classList.remove('show');
                        showBookingStep();
                    }, 800); // Reduced from 2000ms to 800ms for faster transition
                    
                } else {
                    throw new Error(responseData.message || responseData.error || 'Server returned an error');
                }
                
            } catch (error) {
                console.error('❌ Error submitting trial form:', error);
                
                // Hide loading and reset success message
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                if (successMessage) successMessage.classList.remove('show');
                
                showTrialError(`Error: ${error.message}`);
                
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit & Continue to Booking';
                }
            }
        });
    }
    
    // Show booking step with student info
    function showBookingStep() {
        console.log('🎯 Moving to booking step');
        
        // Add smooth transition effect
        const currentStep = document.getElementById('trial-step-info');
        const nextStep = document.getElementById('trial-step-booking');
        
        if (currentStep) {
            currentStep.style.opacity = '0.5';
            currentStep.style.transition = 'opacity 0.3s ease';
        }
        
        if (submittedTrialData) {
            // Populate student info (including age)
            const studentInfo = document.getElementById('trialStudentInfo');
            if (studentInfo) {
                studentInfo.innerHTML = `
                    <div class="student-welcome" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
                        <h3 style="color: #28a745; margin: 0 0 10px 0;">Welcome, ${submittedTrialData.nickName}! 👋</h3>
                        <p style="margin: 5px 0;"><strong>Full Name:</strong> ${submittedTrialData.firstName} ${submittedTrialData.lastName}</p>
                        <p style="margin: 5px 0;"><strong>Age:</strong> ${submittedTrialData.age} years old</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${submittedTrialData.email}</p>
                        <p style="margin: 5px 0;"><strong>Selected Course:</strong> ${getCourseDisplayName(submittedTrialData.course)}</p>
                        <p style="margin: 5px 0;"><strong>Country:</strong> ${submittedTrialData.country}</p>
                    </div>
                `;
            }

            // Set up Zoom scheduler link (updated email address)
            const zoomLink = document.getElementById('zoomSchedulerLink');
            if (zoomLink && ZOOM_SCHEDULER_URL !== 'YOUR_ZOOM_SCHEDULER_LINK_HERE') {
                zoomLink.href = ZOOM_SCHEDULER_URL;
            } else if (zoomLink) {
                // Fallback if no Zoom link is provided (updated email address)
                zoomLink.href = `mailto:shiela@codeconquer.com?subject=Trial Class Booking&body=Hi, I would like to schedule a trial class. My name is ${submittedTrialData.firstName} ${submittedTrialData.lastName}, age ${submittedTrialData.age}.`;
                zoomLink.innerHTML = '📧 Email to Schedule';
            }
        }
        
        // Smooth transition to next step
        setTimeout(() => {
            showTrialStep('trial-step-booking', 2);
            
            // Reset opacity
            if (currentStep) {
                currentStep.style.opacity = '';
                currentStep.style.transition = '';
            }
            
            // Add entrance animation to next step
            if (nextStep) {
                nextStep.style.opacity = '0';
                nextStep.style.transform = 'translateY(20px)';
                nextStep.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    nextStep.style.opacity = '1';
                    nextStep.style.transform = 'translateY(0)';
                }, 50);
            }
        }, 100);
    }
    
    // Get display name for course
    function getCourseDisplayName(courseId) {
        const courseNames = {
            'scratch': 'Scratch for Kids',
            'python': 'Python Programming', 
            'cpp': 'C/C++ Programming',
            'web': 'Web Development',
            'data': 'Data Science',
            'sql': 'SQL & Databases',
            'office': 'Microsoft Office'
        };
        return courseNames[courseId] || courseId;
    }
    
    // Show trial error with better UX
    function showTrialError(message) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (successMessage) successMessage.classList.remove('show');
        
        if (errorMessage) {
            errorMessage.innerHTML = `❌ ${message}`;
            errorMessage.classList.add('show');
            
            // Auto-hide error after 8 seconds (reduced from 10)
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 8000);
            
            // Scroll error message into view if needed
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Initialize global functions for step navigation
    function initGlobalFunctions() {
        // Global functions for button clicks
        window.goBackToTrialForm = function() {
            console.log('🔙 Going back to trial form');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            if (successMessage) successMessage.classList.remove('show');
            if (errorMessage) errorMessage.classList.remove('show');
            showTrialStep('trial-step-info', 1);
        };

        window.completeTrialBooking = function() {
            console.log('✅ Completing trial booking');
            if (submittedTrialData) {
                // Populate final details (including age)
                const finalDetails = document.getElementById('finalTrialDetails');
                if (finalDetails) {
                    finalDetails.innerHTML = `
                        <p><strong>👤 Student:</strong> ${submittedTrialData.firstName} ${submittedTrialData.lastName}</p>
                        <p><strong>🎂 Age:</strong> ${submittedTrialData.age} years old</p>
                        <p><strong>📧 Email:</strong> ${submittedTrialData.email}</p>
                        <p><strong>📚 Course:</strong> ${getCourseDisplayName(submittedTrialData.course)}</p>
                        <p><strong>⏰ Submission Time:</strong> ${new Date().toLocaleString()}</p>
                    `;
                }
            }
            showTrialStep('trial-step-complete', 2);
        };

        window.scheduleAnotherTrial = function() {
            console.log('🔄 Scheduling another trial');
            const bookingForm = document.getElementById('trialBookingForm');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            // Reset form and data
            if (bookingForm) bookingForm.reset();
            submittedTrialData = null;
            
            // Clear course selection
            document.querySelectorAll('.course-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            const selectedCourseInput = document.getElementById('selectedCourse');
            if (selectedCourseInput) selectedCourseInput.value = '';
            
            // Clear messages
            if (successMessage) successMessage.classList.remove('show');
            if (errorMessage) errorMessage.classList.remove('show');
            
            // Go back to first step
            showTrialStep('trial-step-info', 1);
        };
    }
    
})();
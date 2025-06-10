(function() {
    'use strict';
    
    // Configuration
    const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxfSYvCXtXM8XQkn2-DpQo-hI9SfAuFVXJFTxLLHmv9cFGkCoX31LvRIOiBxD2vHoAe/exec';
    
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
        
        // Add improved CSS for better layout and transitions
        addImprovedStyles();
        
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
    }
    
    // Add improved styles for better layout and fixed scrolling
    function addImprovedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Smooth transitions */
            .trial-step {
                transition: opacity 0.4s ease, transform 0.4s ease;
                min-height: 400px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            /* Compact success/error messages */
            .success-message, .error-message {
                transition: all 0.3s ease;
                padding: 10px 15px;
                margin-bottom: 15px;
                border-radius: 6px;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .success-message {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .error-message {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            /* Compact student welcome */
            .student-welcome {
                animation: slideInUp 0.5s ease;
                padding: 12px 15px;
                margin-bottom: 15px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #28a745;
            }
            
            .student-welcome h3 {
                margin: 0 0 8px 0;
                font-size: 18px;
                color: #28a745;
            }
            
            .student-welcome p {
                margin: 3px 0;
                font-size: 14px;
                line-height: 1.3;
            }
            
            /* Compact form sections */
            .form-row {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .form-group {
                margin-bottom: 15px;
                flex: 1;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-size: 14px;
                font-weight: 600;
            }
            
            .form-group input, .form-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 2px solid #e1e5e9;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s ease;
            }
            
            .form-group input:focus, .form-group textarea:focus {
                outline: none;
                border-color: #007bff;
            }
            
            /* Compact course grid */
            .course-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 8px;
                margin-top: 8px;
            }
            
            .course-option {
                padding: 10px 8px;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 13px;
            }
            
            .course-option:hover {
                border-color: #007bff;
                background: #f8f9fa;
            }
            
            .course-option.selected {
                border-color: #007bff;
                background: #e3f2fd;
            }
            
            .course-icon {
                font-size: 20px;
                margin-bottom: 4px;
            }
            
            /* Compact instructions */
            .booking-instructions ol {
                padding-left: 18px;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .booking-instructions li {
                margin-bottom: 6px;
            }
            
            /* Compact calendly container */
            .calendly-container {
                margin: 15px 0;
                border-radius: 8px;
                overflow: hidden;
                max-height: 600px;
            }
            
            .calendly-inline-widget {
                height: 500px !important;
                min-height: 500px !important;
            }
            
            /* Privacy notice compact */
            .privacy-notice {
                background: #f8f9fa;
                padding: 12px 15px;
                border-radius: 6px;
                margin: 15px 0;
                font-size: 13px;
                line-height: 1.4;
            }
            
            .privacy-notice h4 {
                margin: 0 0 6px 0;
                font-size: 14px;
                color: #333;
            }
            
            .privacy-notice p {
                margin: 0;
            }
            
            /* Button improvements */
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                display: inline-block;
                text-align: center;
            }
            
            .btn-primary {
                background: #007bff;
                color: white;
            }
            
            .btn-primary:hover {
                background: #0056b3;
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            /* Responsive improvements */
            @media (max-width: 768px) {
                .form-row {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .course-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .calendly-inline-widget {
                    height: 400px !important;
                }
            }
            
            /* Animation keyframes */
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(15px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Scroll management */
            .trial-booking-container {
                scroll-behavior: smooth;
            }
            
            /* Step indicator improvements */
            .step-indicator {
                display: flex;
                justify-content: center;
                margin: 20px 0;
                gap: 20px;
            }
            
            .step-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #dee2e6;
                transition: all 0.3s ease;
            }
            
            .step-dot.active {
                background: #007bff;
                transform: scale(1.3);
            }
            
            .step-dot.completed {
                background: #28a745;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize step system with better scroll management
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
        
        // Scroll to top of contact section
        // scrollToContactSection();
        
        console.log('📍 Initialized to Step 1');
    }
    
    // Scroll to contact section smoothly
    function scrollToContactSection() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
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

    // Show specific trial step with improved scroll management
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
        
        // Scroll to contact section to keep user oriented
        setTimeout(() => {
            scrollToContactSection();
        }, 100);
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
            countriesList.slice(0, 6).forEach(country => {
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
                document.querySelectorAll('.course-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                const selectedCourseInput = document.getElementById('selectedCourse');
                if (selectedCourseInput) {
                    selectedCourseInput.value = this.dataset.course;
                }
            });
        });
    }
    
    // Form submission with improved UX
    function initFormSubmission(bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🟡 Trial form submission started');
            
            // Get form data
            const nickName = document.getElementById('nickName').value.trim();
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const age = document.getElementById('age').value.trim();
            const email = document.getElementById('email').value.trim();
            const country = document.getElementById('country').value.trim();
            const selectedCourse = document.getElementById('selectedCourse').value;
            const otherDetails = document.getElementById('otherDetails').value.trim() || '';
            
            // Validation
            if (!nickName || !firstName || !lastName || !age || !email || !country) {
                showTrialError('Please fill in all required fields.');
                return;
            }
            
            const ageNumber = parseInt(age);
            if (isNaN(ageNumber) || ageNumber < 3 || ageNumber > 100) {
                showTrialError('Please enter a valid age between 3 and 100.');
                return;
            }
            
            if (!selectedCourse) {
                showTrialError('Please select a course you want to learn.');
                return;
            }
            
            // Show loading
            const loadingIndicator = document.getElementById('loadingIndicator');
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            if (successMessage) {
                successMessage.innerHTML = `🔄 Submitting your request...`;
                successMessage.classList.add('show');
            }
            if (errorMessage) errorMessage.classList.remove('show');
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
            
            // Create FormData
            const formDataToSend = new FormData();
            formDataToSend.append('timestamp', new Date().toISOString());
            formDataToSend.append('nickName', nickName);
            formDataToSend.append('firstName', firstName);
            formDataToSend.append('lastName', lastName);
            formDataToSend.append('age', age);
            formDataToSend.append('email', email);
            formDataToSend.append('country', country);
            formDataToSend.append('course', selectedCourse);
            formDataToSend.append('otherDetails', otherDetails);
            
            try {
                const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: formDataToSend
                });
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                
                const responseData = await response.json();
                
                if (responseData.success) {
                    submittedTrialData = {
                        nickName, firstName, lastName, age, email, country,
                        course: selectedCourse, otherDetails
                    };
                    
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    if (successMessage) {
                        successMessage.innerHTML = `✅ Request submitted! Moving to booking step...`;
                        successMessage.classList.add('show');
                    }
                    
                    setTimeout(() => {
                        if (successMessage) successMessage.classList.remove('show');
                        showBookingStep();
                    }, 1000);
                    
                } else {
                    throw new Error(responseData.message || 'Server error');
                }
                
            } catch (error) {
                console.error('❌ Error:', error);
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                if (successMessage) successMessage.classList.remove('show');
                showTrialError(`Error: ${error.message}`);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit & Continue to Booking';
                }
            }
        });
    }
    
    // Show booking step with compact layout
    function showBookingStep() {
        console.log('🎯 Moving to booking step');
        
        if (submittedTrialData) {
            const studentInfo = document.getElementById('trialStudentInfo');
            if (studentInfo) {
                studentInfo.innerHTML = `
                    <div class="student-welcome">
                        <h3>Welcome, ${submittedTrialData.nickName}! 👋</h3>
                        <p><strong>Name:</strong> ${submittedTrialData.firstName} ${submittedTrialData.lastName}</p>
                        <p><strong>Age:</strong> ${submittedTrialData.age} years old</p>
                        <p><strong>Course:</strong> ${getCourseDisplayName(submittedTrialData.course)}</p>
                        <p><strong>Email:</strong> ${submittedTrialData.email}</p>
                    </div>
                `;
            }
        }
        
        showTrialStep('trial-step-booking', 2);
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
    
    // Show compact error messages
    function showTrialError(message) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (successMessage) successMessage.classList.remove('show');
        
        if (errorMessage) {
            errorMessage.innerHTML = `❌ ${message}`;
            errorMessage.classList.add('show');
            
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 6000);
        }
    }
    
    // Initialize global functions
    function initGlobalFunctions() {
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
                const finalDetails = document.getElementById('finalTrialDetails');
                if (finalDetails) {
                    finalDetails.innerHTML = `
                        <p><strong>Student:</strong> ${submittedTrialData.firstName} ${submittedTrialData.lastName}</p>
                        <p><strong>Age:</strong> ${submittedTrialData.age} years old</p>
                        <p><strong>Course:</strong> ${getCourseDisplayName(submittedTrialData.course)}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
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
            
            if (bookingForm) bookingForm.reset();
            submittedTrialData = null;
            
            document.querySelectorAll('.course-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            const selectedCourseInput = document.getElementById('selectedCourse');
            if (selectedCourseInput) selectedCourseInput.value = '';
            
            if (successMessage) successMessage.classList.remove('show');
            if (errorMessage) errorMessage.classList.remove('show');
            
            showTrialStep('trial-step-info', 1);
        };
    }
    
})();
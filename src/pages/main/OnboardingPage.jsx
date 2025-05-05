import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

/**
 * Onboarding page component to welcome new users
 */
const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Onboarding steps content
  const steps = [
    {
      title: 'Welcome to Victoria Kids!',
      description: 'Your one-stop shop for quality baby products.',
      image: '/onboarding/welcome.jpg',
      color: 'from-[#e8f5e9] to-[#f1f8e9]'
    },
    {
      title: 'Explore Our Collection',
      description: 'Discover a wide range of baby products, from clothing to furniture.',
      image: '/onboarding/collection.jpg',
      color: 'from-[#e3f2fd] to-[#bbdefb]'
    },
    {
      title: 'Easy Shopping Experience',
      description: 'Search, filter, and find exactly what you need for your little one.',
      image: '/onboarding/shopping.jpg',
      color: 'from-[#fff8e1] to-[#ffecb3]'
    },
    {
      title: 'Create an Account',
      description: 'Save your favorites, track orders, and enjoy a personalized experience.',
      image: '/onboarding/account.jpg',
      color: 'from-[#fce4ec] to-[#f8bbd0]'
    }
  ];
  
  // Handle next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step, navigate to home
      navigate('/');
    }
  };
  
  // Handle previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle skip
  const skipOnboarding = () => {
    navigate('/');
  };
  
  const currentStepData = steps[currentStep];

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-r ${currentStepData.color}`}>
      {/* Skip button */}
      <div className="container pt-4 flex justify-end">
        <button 
          onClick={skipOnboarding}
          className="text-sm text-gray-600 hover:underline"
        >
          Skip
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center container py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video relative overflow-hidden bg-gray-100">
            <img 
              src={currentStepData.image || '/placeholder.svg'} 
              alt={currentStepData.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{currentStepData.title}</h1>
            <p className="text-gray-600 mb-6">{currentStepData.description}</p>
            
            {/* Progress dots */}
            <div className="flex justify-center mb-6">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === currentStep ? 'bg-[#e91e63]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                Previous
              </Button>
              
              <Button 
                className="bg-[#e91e63] hover:bg-[#c2185b]"
                onClick={nextStep}
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="container py-4 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Victoria Kids Baby Shop. All rights reserved.</p>
      </div>
    </div>
  );
};

export default OnboardingPage;

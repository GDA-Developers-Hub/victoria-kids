import React from 'react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

/**
 * About page component with company information, mission, and team details
 */
const AboutPage = () => {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Story</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Victoria Kids was founded with a simple mission: to make parenting easier by providing 
          high-quality, affordable baby products that both parents and children love.
        </p>
      </div>

      {/* Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
        <div>
          <img 
            src="/about/our-mission.jpg" 
            alt="Our mission" 
            className="rounded-lg shadow-md w-full"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            At Victoria Kids, we believe that every child deserves the best start in life. Our mission is to provide 
            parents with high-quality, safe, and stylish baby products that make parenting easier and more enjoyable.
          </p>
          <p className="mb-6">
            We carefully select each product in our store, ensuring it meets our strict quality standards. We work with 
            trusted suppliers who share our values of quality, safety, and sustainability.
          </p>
          <Button className="bg-[#e91e63] hover:bg-[#c2185b]" asChild>
            <Link to="/products">Explore Our Products</Link>
          </Button>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="rounded-full bg-[#e8f5e9] p-4 mb-4 w-16 h-16 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#4caf50] h-8 w-8"
              >
                <path d="M17.25 10c.46 2.3-.75 4.7-2.69 5.46"/>
                <path d="M8.73 10c-.46 2.3.75 4.7 2.69 5.46"/>
                <path d="M12 8a2.5 2 0 1 0 0-4 2.5 2 0 0 0 0 4Z"/>
                <path d="M12 8v3"/>
                <path d="M12 16a2 2 0 0 0 0 4"/>
                <path d="M12 19a2 2 0 0 1 0-4"/>
                <path d="M15.5 19c.83 0 1.5-.67 1.5-1.5v-1a1.5 1.5 0 0 1 3 0v.5"/>
                <path d="M8.5 19c-.83 0-1.5-.67-1.5-1.5v-1a1.5 1.5 0 0 0-3 0v.5"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Quality</h3>
            <p className="text-muted-foreground">
              We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="rounded-full bg-[#fce4ec] p-4 mb-4 w-16 h-16 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#e91e63] h-8 w-8"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Care</h3>
            <p className="text-muted-foreground">
              We care deeply about the well-being of children and are committed to creating products that nurture and support their development.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="rounded-full bg-[#e0f7fa] p-4 mb-4 w-16 h-16 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#00bcd4] h-8 w-8"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Sustainability</h3>
            <p className="text-muted-foreground">
              We are committed to reducing our environmental impact by choosing eco-friendly materials and sustainable practices.
            </p>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Founder & CEO',
              image: '/team/ceo.jpg',
              bio: 'Sarah founded Victoria Kids in 2020 after struggling to find quality baby products for her own children.'
            },
            {
              name: 'David Kimani',
              role: 'Product Manager',
              image: '/team/product-manager.jpg',
              bio: 'David oversees our product selection process, ensuring that each item meets our quality standards.'
            },
            {
              name: 'Emily Waweru',
              role: 'Customer Service Manager',
              image: '/team/customer-service.jpg',
              bio: 'Emily leads our customer service team, dedicated to providing exceptional support to our customers.'
            }
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border">
              <img 
                src={member.image || '/placeholder.svg'} 
                alt={member.name} 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-[#e91e63] mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#f3e5f5] rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Victoria Kids Family</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Discover our collection of high-quality baby products designed with your child's comfort and safety in mind.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-[#e91e63] hover:bg-[#c2185b]" size="lg" asChild>
            <Link to="/products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

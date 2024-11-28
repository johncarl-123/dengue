import React from 'react';
import {
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='w-full py-16 px-4 bg-gray-900 text-white'>
      <div className='max-w-[1240px] mx-auto grid lg:grid-cols-3 gap-8'>
        {/* Left Section: Contact Info */}
        <div>
          <h1 className='w-full text-3xl font-bold text-[#915EFF]'>Created by Our Team</h1>
          <p className='py-4'>
            This website was developed by a dedicated team working on predictive modeling for dengue disease. Get in touch with us for more information or collaboration opportunities.
          </p>
          <div className='flex justify-between md:w-[75%] my-6'>
            <FaFacebookSquare size={30} className='text-[#915EFF]' />
            <FaInstagram size={30} className='text-[#915EFF]' />
            <FaTwitterSquare size={30} className='text-[#915EFF]' />
            <FaGithubSquare size={30} className='text-[#915EFF]' />
          </div>
        </div>

        {/* Middle Section: Quick Links */}
        <div className='lg:col-span-2 flex justify-between mt-6'>
          <div>
            <h6 className='font-medium text-gray-400'>Solutions</h6>
            <ul>
              <li className='py-2 text-sm'>Dengue Prediction</li>
              <li className='py-2 text-sm'>Patient Outcome Predition</li>
              <li className='py-2 text-sm'>Trusted</li>
              <li className='py-2 text-sm'>Give Recommendation</li>
            </ul>
          </div>
          <div>
            <h6 className='font-medium text-gray-400'>Support</h6>
            <ul>
              <li className='py-2 text-sm'>FAQs</li>
              <li className='py-2 text-sm'>Documentation</li>
              <li className='py-2 text-sm'>Guides</li>
              <li className='py-2 text-sm'>API Status</li>
            </ul>
          </div>
          <div>
            <h6 className='font-medium text-gray-400'>Company</h6>
            <ul>
              <li className='py-2 text-sm'>About Us</li>
              <li className='py-2 text-sm'>Blog</li>
              <li className='py-2 text-sm'>Careers</li>
              <li className='py-2 text-sm'>Contact</li>
            </ul>
          </div>
          <div>
            <h6 className='font-medium text-gray-400'>Legal</h6>
            <ul>
              <li className='py-2 text-sm'>Privacy Policy</li>
              <li className='py-2 text-sm'>Terms & Conditions</li>
              <li className='py-2 text-sm'>Disclaimer</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='text-center py-6'>
        <p className='text-sm text-gray-400'>
          &copy; 2024 Created by John Carl Torrefalma & Michael Rey Samuya. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;

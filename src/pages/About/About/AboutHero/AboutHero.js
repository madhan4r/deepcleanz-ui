import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const AboutHero = () => {
   return (
      <section className="about-hero">
         <div className="container">
            <div className="about-hero__inner">
               <div className="about-hero__rating-pill">
                  <FaStar />
                  <span>4.7 on Google &middot; 80+ Reviews</span>
               </div>
               <h1 className="about-hero__title">
                  The Cleaning Service<br />Chennai Actually Trusts
               </h1>
               <p className="about-hero__copy">
                  Founded in 2025, DeepCleanz has grown from a word-of-mouth service into one of Chennai's most reviewed home cleaning providers — built on punctuality, real results, and a pay-after-service promise.
               </p>
               <div className="about-hero__actions">
                  <Link to="/appointment" className="theme-btn text-white">
                     <i className="flaticon-enter"></i> Book a Cleaning
                  </Link>
                  <a href="tel:+919363609470" className="about-hero__call">
                     or call +91 93636 09470
                  </a>
               </div>
            </div>
         </div>
      </section>
   );
};

export default AboutHero;

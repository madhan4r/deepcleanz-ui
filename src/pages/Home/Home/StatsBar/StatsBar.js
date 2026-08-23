import React from 'react';

const stats = [
   { number: '500+', label: 'Homes Cleaned' },
   { number: '4.7', label: 'Google Rating' },
   { number: '80+', label: 'Verified Reviews' },
   { number: '8', label: 'Specialist Services' },
];

const StatsBar = () => {
   return (
      <section className="premium-home__stats" aria-label="Key statistics">
         <div className="container">
            <div className="row g-0">
               {stats.map((stat, i) => (
                  <div className="col-6 col-lg-3" key={stat.label}>
                     <div className={`premium-home__stat-item${i < stats.length - 1 ? ' premium-home__stat-item--sep' : ''}`}>
                        <div className="premium-home__stat-number">{stat.number}</div>
                        <div className="premium-home__stat-label">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default StatsBar;

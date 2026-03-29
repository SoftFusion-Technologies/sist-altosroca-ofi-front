import React from 'react';

const Ubication = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.858020612662!2d-65.22894372421711!3d-26.82276338870308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d36e788c6c9%3A0xe54e12e1f57d605a!2sLamadrid%20986%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1714494191390!5m2!1ses-419!2sar"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'invert(99%)' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Ubication;
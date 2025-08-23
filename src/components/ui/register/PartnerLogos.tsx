import React from 'react';
import Image from 'next/image';

const PartnerLogos: React.FC = () => {
  const partners = [
    { src: '/images/img_nees_01_1.png', alt: 'NEES', width: 80, height: 26 },
    { src: '/images/img_ufal_3.png', alt: 'UFAL', width: 51, height: 66 },
    { src: '/images/img_logo_aibox_2.png', alt: 'AiBox Lab', width: 120, height: 27 },
    { src: '/images/img_screenshot_2024_12_03.png', alt: 'Partner Logo', width: 35, height: 46 },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-2 lg:gap-4">
          {partners.map((partner, index) => (
            <Image
              key={index}
              src={partner.src}
              alt={partner.alt}
              width={partner.width}
              height={partner.height}
              className={`
                ${partner.alt === 'UFAL' ? 'h-12 sm:h-16' : 'h-6 sm:h-8'} 
                w-auto opacity-70 hover:opacity-100 transition-opacity
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;

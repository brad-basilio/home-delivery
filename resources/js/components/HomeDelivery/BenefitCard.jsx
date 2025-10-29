import React from 'react';

const BenefitCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="text-center p-6 rounded-xl hover:bg-white/5 transition-all duration-300 group">
      <div className="bg-gradient-to-br from-hd-green/20 to-hd-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10">
        {Icon && <Icon className="w-8 h-8 text-hd-green" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default BenefitCard;

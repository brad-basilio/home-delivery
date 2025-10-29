import React from 'react';

const ServiceCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
      <div className="bg-gradient-to-br from-hd-green/10 to-hd-blue/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {Icon && <Icon className="w-7 h-7 text-hd-green" />}
      </div>
      <h3 className="text-xl font-bold text-hd-onyx mb-2 group-hover:text-hd-green transition-colors duration-300">
        {title}
      </h3>
      <p className="text-hd-gray leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;

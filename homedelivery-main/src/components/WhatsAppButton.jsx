import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '51933411599';
  const message = encodeURIComponent(
    'Hola, me gustaría obtener más información sobre sus servicios.'
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-brand-green text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 hover:scale-110 transition-all duration-200 z-50 focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;

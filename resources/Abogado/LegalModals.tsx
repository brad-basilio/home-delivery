import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

interface LegalModalsProps {
  privacyOpen: boolean;
  termsOpen: boolean;
  legalOpen: boolean;
  onClosePrivacy: () => void;
  onCloseTerms: () => void;
  onCloseLegal: () => void;
}

const LegalModals: React.FC<LegalModalsProps> = ({
  privacyOpen,
  termsOpen,
  legalOpen,
  onClosePrivacy,
  onCloseTerms,
  onCloseLegal
}) => {
  return (
    <>
      {/* Privacy Policy Modal */}
      <Modal isOpen={privacyOpen} onClose={onClosePrivacy} title="Política de Privacidad">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Última actualización:</strong> Enero 2024
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Información que Recopilamos</h3>
          <p className="text-gray-700 mb-4">
            En LexInmobiliaria recopilamos información personal que usted nos proporciona directamente, 
            como su nombre, dirección de correo electrónico, número de teléfono y detalles sobre su 
            consulta legal cuando se pone en contacto con nosotros.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Uso de la Información</h3>
          <p className="text-gray-700 mb-4">
            Utilizamos su información personal para:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Responder a sus consultas y brindar servicios legales</li>
            <li>Comunicarnos con usted sobre su caso</li>
            <li>Mejorar nuestros servicios</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Protección de Datos</h3>
          <p className="text-gray-700 mb-4">
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
            su información personal contra el acceso no autorizado, alteración, divulgación o destrucción.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Compartir Información</h3>
          <p className="text-gray-700 mb-4">
            No vendemos, intercambiamos ni transferimos su información personal a terceros sin su 
            consentimiento, excepto cuando sea necesario para brindar nuestros servicios o cuando 
            lo requiera la ley.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Sus Derechos</h3>
          <p className="text-gray-700 mb-4">
            Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus 
            datos personales. Para ejercer estos derechos, contáctenos a través de los medios 
            proporcionados en nuestro sitio web.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Contacto</h3>
          <p className="text-gray-700">
            Si tiene preguntas sobre esta Política de Privacidad, puede contactarnos en 
            contacto@lexinmobiliaria.com o al +51 982 292 914.
          </p>
        </div>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal isOpen={termsOpen} onClose={onCloseTerms} title="Términos de Servicio">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Última actualización:</strong> Enero 2024
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Aceptación de Términos</h3>
          <p className="text-gray-700 mb-4">
            Al acceder y utilizar los servicios de LexInmobiliaria, usted acepta estar sujeto a 
            estos Términos de Servicio y todas las leyes y regulaciones aplicables.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Servicios Ofrecidos</h3>
          <p className="text-gray-700 mb-4">
            LexInmobiliaria proporciona servicios de asesoría legal especializada en derecho 
            inmobiliario, incluyendo pero no limitado a:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Contratos de compraventa de inmuebles</li>
            <li>Contratos de arrendamiento</li>
            <li>Procedimientos de desalojo</li>
            <li>Prescripción adquisitiva de dominio</li>
            <li>División y partición de bienes</li>
            <li>Regularización de terrenos</li>
            <li>Defensa en juicios de propiedad</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Responsabilidades del Cliente</h3>
          <p className="text-gray-700 mb-4">
            El cliente se compromete a:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Proporcionar información veraz y completa</li>
            <li>Cumplir con los pagos acordados</li>
            <li>Colaborar activamente en el desarrollo del caso</li>
            <li>Respetar los plazos establecidos</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Limitación de Responsabilidad</h3>
          <p className="text-gray-700 mb-4">
            LexInmobiliaria no será responsable por daños indirectos, incidentales o consecuentes 
            que puedan surgir del uso de nuestros servicios, excepto en casos de negligencia grave 
            o dolo.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Confidencialidad</h3>
          <p className="text-gray-700 mb-4">
            Mantenemos estricta confidencialidad sobre toda la información proporcionada por 
            nuestros clientes, de acuerdo con el secreto profesional establecido en la legislación 
            aplicable.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Modificaciones</h3>
          <p className="text-gray-700">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Las modificaciones entrarán en vigor inmediatamente después de su publicación 
            en nuestro sitio web.
          </p>
        </div>
      </Modal>

      {/* Legal Notice Modal */}
      <Modal isOpen={legalOpen} onClose={onCloseLegal} title="Aviso Legal">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Información General</h3>
          <p className="text-gray-700 mb-4">
            <strong>Denominación:</strong> LexInmobiliaria - Estudio Jurídico Especializado<br />
            <strong>Dirección:</strong> Lima, Perú<br />
            <strong>Teléfono:</strong> +51 982 292 914<br />
            <strong>Email:</strong> contacto@lexinmobiliaria.com
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Objeto Social</h3>
          <p className="text-gray-700 mb-4">
            LexInmobiliaria es un estudio jurídico especializado en derecho inmobiliario, 
            constituido bajo las leyes peruanas, con más de 15 años de experiencia en la 
            protección del patrimonio inmobiliario de nuestros clientes.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Propiedad Intelectual</h3>
          <p className="text-gray-700 mb-4">
            Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos, 
            diseños y código fuente, son propiedad de LexInmobiliaria o de terceros que han 
            autorizado su uso, y están protegidos por las leyes de propiedad intelectual.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Uso del Sitio Web</h3>
          <p className="text-gray-700 mb-4">
            El acceso y uso de este sitio web implica la aceptación de las condiciones generales 
            establecidas en este aviso legal. El usuario se compromete a hacer un uso adecuado 
            de los contenidos y servicios ofrecidos.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Exclusión de Garantías</h3>
          <p className="text-gray-700 mb-4">
            LexInmobiliaria no garantiza la disponibilidad continua del sitio web ni se hace 
            responsable de los daños que puedan derivarse de la falta de disponibilidad, 
            errores de acceso o funcionamiento defectuoso.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Legislación Aplicable</h3>
          <p className="text-gray-700 mb-4">
            Este aviso legal se rige por la legislación peruana. Para cualquier controversia 
            que pudiera derivarse del acceso o uso de este sitio web, las partes se someten 
            a los juzgados y tribunales de Lima, Perú.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contacto</h3>
          <p className="text-gray-700">
            Para cualquier consulta relacionada con este aviso legal, puede contactarnos a 
            través de los medios indicados en la sección de contacto de nuestro sitio web.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default LegalModals;
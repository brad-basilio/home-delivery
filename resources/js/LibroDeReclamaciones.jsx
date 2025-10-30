import { useState, useRef, useEffect } from "react";
import {
    CheckCircle,
    AlertCircle,
    Info,
    Calendar,
    Upload,
    X,
    HelpCircle,
    Phone,
    Mail,
    MapPin,
    FileText,
    Shield,
    RefreshCw,
    User,
    Building,
    Clock,
    MessageSquare,
    Package,
    IdCard,
} from "lucide-react";
import { CarritoProvider } from "./context/CarritoContext";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Footer from "./components/HomeDelivery/Footer";
import Header from "./components/HomeDelivery/Header";
import WhatsAppButton from "./components/HomeDelivery/WhatsAppButton";
import { motion, AnimatePresence } from "framer-motion";
import { Cookies } from "sode-extend-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import HtmlContent from "./Utils/HtmlContent";
import '../css/homedelivery.css';

const LibroDeReclamaciones = ({ offices = [], servicios, terms, generals = [], socials = [] }) => {
    const [formData, setFormData] = useState({
        // Datos del consumidor
        nombre: "",
        apellido: "",
        tipoDocumento: "dni",
        numeroDocumento: "",
        telefono: "",
        email: "",
        direccion: "",
        //departamento: "",

        //provincia: "",
        //distrito: "",
        // Datos del reclamo
        office_id: "",
        servicio: "",
        tipoReclamo: "queja",
        fechaIncidente: "",
        horaIncidente: "",
        detalleReclamo: "",
        pedido: "",
        // Datos adicionales
        autorizaNotificacion: true,
        aceptaTerminos: false,
        captchaResuelto: false,
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [numeroReclamo, setNumeroReclamo] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
    const [errores, setErrores] = useState({});
    const [captchaValue, setCaptchaValue] = useState("");
    const [captchaActual, setCaptchaActual] = useState("");
    const [mostrarTerminos, setMostrarTerminos] = useState(false);
    const [formTouched, setFormTouched] = useState(false);

    const fileInputRef = useRef(null);

    // Generar captcha al cargar y cuando se necesite refrescar
    const generarCaptcha = () => {
        const caracteres =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        let resultado = "";
        for (let i = 0; i < 6; i++) {
            resultado += caracteres.charAt(
                Math.floor(Math.random() * caracteres.length)
            );
        }
        setCaptchaActual(resultado);
        return resultado;
    };

    // Generar captcha al montar el componente
    useEffect(() => {
        generarCaptcha();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Actualizar el estado del formulario
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            // Si cambia el departamento, resetear provincia y distrito
            if (name === "departamento") {
                newData.provincia = "";
                newData.distrito = "";
            }

            // Si cambia la provincia, resetear distrito
            if (name === "provincia") {
                newData.distrito = "";
            }

            return newData;
        });

        // Marcar el formulario como tocado para activar validaciones
        if (!formTouched) {
            setFormTouched(true);
        }

        // Validar el campo que cambió
        validarCampo(name, type === "checkbox" ? checked : value);
    };

    const validarCampo = (campo, valor) => {
        const nuevoErrores = { ...errores };

        switch (campo) {
            case "nombre":
            case "apellido":
                if (!valor.trim()) {
                    nuevoErrores[campo] = "Este campo es obligatorio";
                } else if (valor.length < 2) {
                    nuevoErrores[campo] = "Debe tener al menos 2 caracteres";
                } else {
                    delete nuevoErrores[campo];
                }
                break;

            case "numeroDocumento":
                if (!valor.trim()) {
                    nuevoErrores[campo] = "Este campo es obligatorio";
                } else if (
                    formData.tipoDocumento === "dni" &&
                    !/^\d{8}$/.test(valor)
                ) {
                    nuevoErrores[campo] = "El DNI debe tener 8 dígitos";
                } else if (
                    formData.tipoDocumento === "ruc" &&
                    !/^\d{11}$/.test(valor)
                ) {
                    nuevoErrores[campo] = "El RUC debe tener 11 dígitos";
                } else {
                    delete nuevoErrores[campo];
                }
                break;

            case "telefono":
                if (!valor.trim()) {
                    nuevoErrores[campo] = "Este campo es obligatorio";
                } else if (!/^\d{9}$/.test(valor)) {
                    nuevoErrores[campo] = "El teléfono debe tener 9 dígitos";
                } else {
                    delete nuevoErrores[campo];
                }
                break;

            case "email":
                if (!valor.trim()) {
                    nuevoErrores[campo] = "Este campo es obligatorio";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                    nuevoErrores[campo] =
                        "Ingrese un correo electrónico válido";
                } else {
                    delete nuevoErrores[campo];
                }
                break;

            case "detalleReclamo":
            case "pedido":
                if (!valor.trim()) {
                    nuevoErrores[campo] = "Este campo es obligatorio";
                } else if (valor.length < 10) {
                    nuevoErrores[campo] =
                        "Proporcione una descripción más detallada";
                } else {
                    delete nuevoErrores[campo];
                }
                break;

            case "aceptaTerminos":
                if (!valor) {
                    nuevoErrores[campo] =
                        "Debe aceptar los términos y condiciones";
                } else {
                    delete nuevoErrores[campo];
                }
                break;

            default:
                if (
                    campo !== "captchaResuelto" &&
                    campo !== "autorizaNotificacion" &&
                    !valor &&
                    campo !== "horaIncidente"
                ) {
                    nuevoErrores[campo] = "Este campo es obligatorio";
                } else {
                    delete nuevoErrores[campo];
                }
        }

        setErrores(nuevoErrores);
        return Object.keys(nuevoErrores).length === 0;
    };

    const validarFormulario = () => {
        const nuevoErrores = {};
        let esValido = true;

        // Validar campos obligatorios (excepto captcha)
        const camposObligatorios = [
            "nombre",
            "apellido",
            "tipoDocumento",
            "numeroDocumento",
            "telefono",
            "email",
            "direccion",
            "office_id",
            "servicio",
            "fechaIncidente",
            "detalleReclamo",
            "pedido",
        ];

        camposObligatorios.forEach((campo) => {
            if (!formData[campo]) {
                nuevoErrores[campo] = "Este campo es obligatorio";
                esValido = false;
            }
        });

        // Resto de validaciones específicas...

        // Validar términos y condiciones
        if (!formData.aceptaTerminos) {
            nuevoErrores.aceptaTerminos =
                "Debe aceptar los términos y condiciones";
            esValido = false;
        }

        setErrores(nuevoErrores);
        return esValido;
    };
    const verificarCaptcha = () => {
        // Convertir a minúsculas y eliminar espacios para hacer la comparación más flexible
        const valorIngresado = captchaValue.trim().toLowerCase();
        const captchaEsperado = captchaActual.toLowerCase();

        if (valorIngresado === captchaEsperado) {
            setFormData((prev) => ({ ...prev, captchaResuelto: true }));
            setErrores((prev) => {
                const newErrors = { ...prev };
                delete newErrors.captcha;
                return newErrors;
            });
            return true;
        } else {
            setErrores((prev) => ({
                ...prev,
                captcha: "El código ingresado no coincide",
            }));
            generarCaptcha();
            setCaptchaValue("");
            setFormData((prev) => ({ ...prev, captchaResuelto: false }));
            return false;
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            const fileSize = file.size / 1024 / 1024; // MB
            const fileType = file.type;
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "application/pdf",
            ];

            if (fileSize > 5) {
                invalidFiles.push(`${file.name} (tamaño excedido)`);
            } else if (!validTypes.includes(fileType)) {
                invalidFiles.push(`${file.name} (tipo no válido)`);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            setErrores((prev) => ({
                ...prev,
                archivos: `Algunos archivos no son válidos: ${invalidFiles.join(
                    ", "
                )}. 
                      Solo se permiten JPG, PNG o PDF (máx. 5MB)`,
            }));
        }

        const newFiles = [...archivosAdjuntos, ...validFiles].slice(0, 3);
        setArchivosAdjuntos(newFiles);
    };
    const FilePreview = ({ file, onRemove }) => {
        const isImage = file.type.startsWith("image/");

        return (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                <div className="flex items-center min-w-0">
                    {isImage ? (
                        <div className="w-10 h-10 mr-2 flex-shrink-0">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Vista previa"
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    ) : (
                        <FileText className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0" />
                    )}

                    <div className="min-w-0">
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {file.type}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Eliminar archivo"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    };
    const eliminarArchivo = (index) => {
        setArchivosAdjuntos(archivosAdjuntos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Primero verificar el captcha si no está resuelto
        if (!formData.captchaResuelto) {
            const captchaValido = verificarCaptcha();
            if (!captchaValido) {
                // Desplazarse al campo CAPTCHA si hay error
                document.getElementById("captcha-input")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                return;
            }
        }

        if (!validarFormulario()) {
            const primerError = document.querySelector(".error-message");
            if (primerError) {
                primerError.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Agregar todos los campos del formulario
            Object.keys(formData).forEach((key) => {
                if (key !== "archivosAdjuntos") {
                    // Excluir archivos que se manejan aparte
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Agregar archivos adjuntos
            archivosAdjuntos.forEach((file, index) => {
                formDataToSend.append(`archivos[${index}]`, file);
            });

            // Obtener el token CSRF de la meta tag
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            const response = await fetch(`/api/reclamos`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                setNumeroReclamo(data.numero_reclamo);
                setSubmitted(true);
            } else {
                throw new Error(data.message || "Error al procesar el reclamo");
            }
        } catch (error) {
            console.error("Error al enviar el reclamo:", error);
            alert(`Error al enviar el reclamo: ${error.message}`);
        }
    };

    const fechaActual = new Date().toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const horaActual = new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setProperties({
            title: `Reclamo ${numeroReclamo}`,
            subject: "Libro de Reclamaciones",
            author: "NoPain",
            keywords: "reclamo, queja, consumidor",
            creator: "NoPain",
        });

        const margin = 15;
        let yPos = 20;
        doc.addImage("assets/img/logo.png", "PNG", margin, 10, 30, 15);
        // Configuración inicial
        doc.setFontSize(16);
        doc.setTextColor(34, 68, 131);
        doc.text("COMPROBANTE DE RECLAMO", 105, yPos, { align: "center" });
        yPos += 20;

        // Información básica
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Número de Reclamo: ${numeroReclamo}`, margin, yPos);
        doc.text(
            `Fecha de Registro: ${fechaActual} ${horaActual}`,
            margin,
            yPos + 8
        );
        yPos += 20;

        // Datos del consumidor
        autoTable(doc, {
            startY: yPos,
            head: [["DATOS DEL CONSUMIDOR"]],
            body: [
                [
                    "Nombre",
                    `${formData.nombre || ""} ${formData.apellido || ""}`,
                ],
                [
                    "Documento",
                    `${(formData.tipoDocumento || "").toUpperCase()} ${
                        formData.numeroDocumento || ""
                    }`,
                ],
                ["Teléfono", formData.telefono || ""],
                ["Email", formData.email || ""],
                ["Dirección", formData.direccion || ""],
            ],
            headStyles: {
                fillColor: [34, 68, 131],
                textColor: [255, 255, 255],
                fontSize: 14,
            },
            margin: { left: margin },
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // Obtener el nombre de la oficina seleccionada
        const selectedOffice = offices.find(o => o.id === formData.office_id);
        const officeName = selectedOffice ? selectedOffice.name : "";

        // Detalles del reclamo
        autoTable(doc, {
            startY: yPos,
            head: [["DETALLES DEL RECLAMO"]],
            body: [
                ["Sede", officeName],
                ["Servicio", formData.servicio || ""],
                [
                    "Tipo",
                    formData.tipoReclamo === "queja" ? "Queja" : "Reclamo",
                ],
                [
                    "Fecha del incidente",
                    `${formData.fechaIncidente || ""} ${
                        formData.horaIncidente || ""
                    }`,
                ],
            ],
            headStyles: {
                fillColor: [34, 68, 131],
                textColor: [255, 255, 255],
                fontSize: 14,
            },
            margin: { left: margin },
        });
        yPos = doc.lastAutoTable.finalY + 15;

        // Descripción del reclamo - Manejo de texto largo
        doc.setFontSize(14);
        doc.setTextColor(34, 68, 131);
        doc.text("DESCRIPCIÓN DEL RECLAMO", margin, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const detalleLines = doc.splitTextToSize(
            formData.detalleReclamo || "",
            180
        );
        doc.text(detalleLines, margin, yPos);

        // Calcular nueva posición Y considerando la altura del texto
        yPos += detalleLines.length * 7; // Aprox. 7pt por línea

        // Si nos acercamos al final de la página, añadir nueva página
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        // Pedido del consumidor - Manejo de texto largo
        doc.setFontSize(14);
        doc.setTextColor(34, 68, 131);
        doc.text("PEDIDO DEL CONSUMIDOR", margin, yPos);
        yPos += 10;

        doc.setFontSize(12);
        const pedidoLines = doc.splitTextToSize(formData.pedido || "", 180);
        doc.text(pedidoLines, margin, yPos);

        // Guardar el PDF
        doc.save(`reclamo_${numeroReclamo}.pdf`);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
                <Header />
                <main className="pt-20 md:pt-24 pb-16">
                    <div className="max-w-4xl mx-auto px-[5%] py-8 md:py-12">
                        {/* Card principal con gradiente y sombra mejorada */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            {/* Header con gradiente */}
                            <div 
                                className="px-8 py-10 text-center"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                                }}
                            >
                                {/* Icono de éxito animado */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                                        <div className="relative p-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                                            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>

                                <h2 
                                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent mb-4"
                                    style={{
                                        backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                                    }}
                                >
                                    ¡Reclamo Registrado Exitosamente!
                                </h2>
                                
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Su reclamo ha sido recibido y será procesado según lo establecido por el Código de Protección al Consumidor.
                                </p>
                            </div>

                            {/* Número de reclamo destacado */}
                            <div className="px-8 py-6">
                                <div 
                                    className="p-8 rounded-2xl text-center relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.08) 0%, rgba(35, 84, 184, 0.08) 50%, rgba(222, 52, 100, 0.08) 100%)'
                                    }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full -ml-12 -mb-12"></div>
                                    
                                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                        Número de Reclamo
                                    </p>
                                    <p 
                                        className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent"
                                        style={{
                                            backgroundImage: 'linear-gradient(135deg, #2354B8 0%, #DE3464 100%)'
                                        }}
                                    >
                                        {numeroReclamo}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Guarde este número para futuras consultas
                                    </p>
                                </div>
                            </div>

                            {/* Resumen del reclamo */}
                            <div className="px-8 pb-8">
                                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                                    <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                        Resumen de su reclamo
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Nombre completo</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formData.nombre} {formData.apellido}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Documento</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formData.tipoDocumento.toUpperCase()} {formData.numeroDocumento}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Contacto</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formData.telefono}
                                                </p>
                                                <p className="text-sm text-gray-600">{formData.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Sede</p>
                                                <p className="font-semibold text-gray-800">
                                                    {offices.find(o => o.id === formData.office_id)?.name || ""}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Servicio</p>
                                                <p className="font-semibold text-gray-800">{formData.servicio}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Tipo</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formData.tipoReclamo === "queja" ? "Queja" : "Reclamo"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Fecha de registro</p>
                                                <p className="font-semibold text-gray-800">
                                                    {fechaActual} {horaActual}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-sm text-gray-500 mb-2">Detalle del reclamo</p>
                                        <p className="text-gray-700 bg-white p-4 rounded-xl border border-gray-200 leading-relaxed">
                                            {formData.detalleReclamo}
                                        </p>
                                    </div>
                            {archivosAdjuntos.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-3">
                                        Archivos adjuntos ({archivosAdjuntos.length}/3)
                                    </p>
                                    <div className="space-y-2">
                                        {archivosAdjuntos.map((file, index) => (
                                            <FilePreview
                                                key={index}
                                                file={file}
                                                onRemove={() => eliminarArchivo(index)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                                </div>
                            </div>

                            {/* Información de plazo */}
                            <div className="px-8 pb-8">
                                <div 
                                    className="p-6 rounded-2xl border-2"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.05) 0%, rgba(35, 84, 184, 0.05) 100%)',
                                        borderColor: 'rgba(35, 84, 184, 0.2)'
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-blue-100">
                                            <AlertCircle className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 mb-2 text-lg">
                                                Plazo de atención
                                            </p>
                                            <p className="text-gray-600 leading-relaxed">
                                                De acuerdo con el Código de Protección y Defensa del Consumidor, 
                                                su caso será atendido en un plazo máximo de{" "}
                                                <span className="font-bold text-blue-600">30 días hábiles</span>. 
                                                Recibirá una respuesta a través del correo electrónico proporcionado.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="px-8 pb-8">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setFormData({
                                                nombre: "",
                                                apellido: "",
                                                tipoDocumento: "dni",
                                                numeroDocumento: "",
                                                telefono: "",
                                                email: "",
                                                direccion: "",
                                                office_id: "",
                                                servicio: "",
                                                tipoReclamo: "queja",
                                                fechaIncidente: "",
                                                horaIncidente: "",
                                                detalleReclamo: "",
                                                pedido: "",
                                                autorizaNotificacion: true,
                                                aceptaTerminos: false,
                                                captchaResuelto: false,
                                            });
                                            setArchivosAdjuntos([]);
                                            setErrores({});
                                            setCaptchaValue("");
                                            generarCaptcha();
                                        }}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        Registrar nuevo reclamo
                                    </button>
                                    <a
                                        href="/"
                                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold text-base hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-center"
                                    >
                                        Volver al inicio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer generals={generals} socials={socials} />
                <WhatsAppButton socials={socials} generals={generals} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
            <Header />
            <main className="pt-20 md:pt-32 pb-16 md:pb-24">
                <div className="max-w-5xl px-[5%] py-12 md:py-16 mx-auto bg-white shadow-2xl rounded-3xl border border-gray-100">
                    {/* Encabezado con gradiente */}
                    <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-gray-100 pb-8 mb-8">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-2xl mr-4 shadow-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                                    LIBRO DE RECLAMACIONES
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">Protegemos tus derechos como consumidor</p>
                            </div>
                        </div>
                        <div className="text-right bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                            <p className="text-sm text-gray-700 font-semibold">
                                📅 {fechaActual}
                            </p>
                            <p className="text-sm text-gray-700 font-semibold">
                                🕐 {horaActual}
                            </p>
                            <p className="text-xs font-medium text-blue-700 mt-2 bg-white px-3 py-1 rounded-full inline-block">
                                Hoja de Reclamación
                            </p>
                        </div>
                    </div>

                {/* Barra de progreso mejorada */}
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-100">
                    <div className="flex justify-between text-sm text-gray-700 mb-3 font-semibold">
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            Progreso del formulario
                        </span>
                        <span className="bg-white px-3 py-1 rounded-full text-xs">
                            {
                                Object.keys(formData).filter(
                                    (key) =>
                                        formData[key] &&
                                        key !== "autorizaNotificacion" &&
                                        key !== "aceptaTerminos" &&
                                        key !== "captchaResuelto"
                                ).length
                            }{" "}
                            / 14 campos
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                            style={{
                                width: `${Math.min(
                                    100,
                                    (Object.keys(formData).filter(
                                        (key) =>
                                            formData[key] &&
                                            key !== "autorizaNotificacion" &&
                                            key !== "aceptaTerminos" &&
                                            key !== "captchaResuelto"
                                    ).length /
                                        15) *
                                        100
                                )}%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Información legal mejorada */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl mb-8 border-l-4 border-yellow-500 shadow-md">
                    <div className="flex">
                        <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                            <Info className="w-6 h-6 text-yellow-700" />
                        </div>
                        <div className="text-sm text-yellow-900 flex-1">
                            <p className="font-bold text-base mb-2 text-yellow-800">
                                📋 AVISO IMPORTANTE
                            </p>
                            <p className="leading-relaxed">
                                Conforme a lo establecido en el <span className="font-semibold">Código de
                                Protección y Defensa del Consumidor (Ley N°
                                29571)</span>, este establecimiento cuenta con un Libro
                                de Reclamaciones a tu disposición. Ingresa la
                                información solicitada para registrar tu queja o
                                reclamo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
                        <span className="text-red-500 text-lg">*</span>
                        Campos obligatorios
                    </p>
                    <p className="text-gray-700">
                        Por favor complete todos los campos marcados como
                        obligatorios para registrar su reclamo.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE */}
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg border-2 border-blue-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-200 flex items-center">
                            <span className="bg-gradient-to-br from-blue-600 to-blue-800 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-lg">
                                1
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                                IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Nombres{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese sus nombres"
                                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                                            errores.nombre
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                    />
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        formData.nombre ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                </div>
                                {errores.nombre && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.nombre}
                                    </p>
                                )}
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Apellidos{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese sus apellidos"
                                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                                            errores.apellido
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                    />
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        formData.apellido ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                </div>
                                {errores.apellido && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.apellido}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <IdCard className="w-4 h-4 text-blue-600" />
                                    Tipo de Documento{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="tipoDocumento"
                                        value={formData.tipoDocumento}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                                            errores.tipoDocumento
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer`}
                                    >
                                        <option value="dni">DNI</option>
                                        <option value="ce">Carné de Extranjería</option>
                                        <option value="pasaporte">Pasaporte</option>
                                        <option value="ruc">RUC</option>
                                    </select>
                                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {errores.tipoDocumento && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.tipoDocumento}
                                    </p>
                                )}
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Número de Documento{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="numeroDocumento"
                                        value={formData.numeroDocumento}
                                        onChange={handleChange}
                                        required
                                        placeholder={
                                            formData.tipoDocumento === "dni"
                                                ? "Ej: 12345678"
                                                : formData.tipoDocumento === "ruc"
                                                ? "Ej: 20123456789"
                                                : "Ingrese su documento"
                                        }
                                        className={`w-full pl-12 pr-12 py-4 border-2 ${
                                            errores.numeroDocumento
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                    />
                                    <FileText className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        formData.numeroDocumento ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                    <HelpCircle
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-help"
                                        title={
                                            formData.tipoDocumento === "dni"
                                                ? "El DNI debe tener 8 dígitos"
                                                : formData.tipoDocumento === "ruc"
                                                ? "El RUC debe tener 11 dígitos"
                                                : "Ingrese su número de documento"
                                        }
                                    />
                                </div>
                                {errores.numeroDocumento && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.numeroDocumento}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    Teléfono{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: 987654321"
                                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                                            errores.telefono
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                    />
                                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        formData.telefono ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                </div>
                                {errores.telefono && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.telefono}
                                    </p>
                                )}
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Correo Electrónico{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="ejemplo@correo.com"
                                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                                            errores.email
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-blue-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                    />
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                        formData.email ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                </div>
                                {errores.email && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Dirección{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                    placeholder="Av. / Calle / Jr. / Psje., N°, Dpto., Int., Urb."
                                    className={`w-full pl-12 pr-4 py-4 border-2 ${
                                        errores.direccion
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200 focus:border-blue-500"
                                    } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                />
                                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                    formData.direccion ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                            </div>
                            {errores.direccion && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {errores.direccion}
                                </p>
                            )}
                        </div>
                    </div>

                    {/*      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Departamento{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="departamento"
                                    value={formData.departamento}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errores.departamento
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">Seleccione</option>
                                    {departamentos.map((dep) => (
                                        <option key={dep} value={dep}>
                                            {dep}
                                        </option>
                                    ))}
                                </select>
                                {errores.departamento && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.departamento}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Provincia{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="provincia"
                                    value={formData.provincia}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.departamento}
                                    className={`w-full px-4 py-2 border ${
                                        errores.provincia
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        !formData.departamento
                                            ? "bg-gray-100"
                                            : ""
                                    }`}
                                >
                                    <option value="">Seleccione</option>
                                    {formData.departamento &&
                                        provincias[formData.departamento]?.map(
                                            (prov) => (
                                                <option key={prov} value={prov}>
                                                    {prov}
                                                </option>
                                            )
                                        )}
                                </select>
                                {errores.provincia && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.provincia}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Distrito{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="distrito"
                                    value={formData.distrito}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.provincia}
                                    className={`w-full px-4 py-2 border ${
                                        errores.distrito
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        !formData.provincia ? "bg-gray-100" : ""
                                    }`}
                                >
                                    <option value="">Seleccione</option>
                                    {formData.provincia &&
                                        distritos[formData.provincia]?.map(
                                            (dist) => (
                                                <option key={dist} value={dist}>
                                                    {dist}
                                                </option>
                                            )
                                        )}
                                </select>
                                {errores.distrito && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.distrito}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
*/}
                    {/* 2. IDENTIFICACIÓN DEL BIEN CONTRATADO */}
                    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg border-2 border-purple-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-purple-200 flex items-center">
                            <span className="bg-gradient-to-br from-purple-600 to-purple-800 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-lg">
                                2
                            </span>
                            <span className="bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">
                                IDENTIFICACIÓN DEL BIEN CONTRATADO
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <Building className="w-4 h-4 text-purple-600" />
                                    Sede donde ocurrió el incidente{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="office_id"
                                        value={formData.office_id}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pl-12 pr-10 py-4 border-2 ${
                                            errores.office_id
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-purple-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer`}
                                    >
                                        <option value="">
                                            Seleccione una sede
                                        </option>
                                        {offices.map((office) => (
                                            <option
                                                key={office.id}
                                                value={office.id}
                                            >
                                                {office.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 pointer-events-none" />
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {errores.office_id && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.office_id}
                                    </p>
                                )}
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <Shield className="w-4 h-4 text-purple-600" />
                                    Servicio relacionado{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="servicio"
                                        value={formData.servicio}
                                        onChange={handleChange}
                                        required
                                        className={`w-full pl-12 pr-10 py-4 border-2 ${
                                            errores.servicio
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-purple-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer`}
                                    >
                                        <option value="">
                                            Seleccione un servicio
                                        </option>
                                        {servicios.map((servicio) => (
                                            <option
                                                key={servicio.id}
                                                value={servicio.title}
                                            >
                                                {servicio.title}
                                            </option>
                                        ))}
                                    </select>
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 pointer-events-none" />
                                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {errores.servicio && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.servicio}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    Fecha del incidente{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="fechaIncidente"
                                        value={formData.fechaIncidente}
                                        onChange={handleChange}
                                        required
                                        max={new Date().toISOString().split("T")[0]}
                                        className={`w-full pl-12 pr-4 py-4 border-2 ${
                                            errores.fechaIncidente
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-purple-500"
                                        } rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-gray-800 font-medium cursor-pointer`}
                                    />
                                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${
                                        formData.fechaIncidente ? 'text-purple-600' : 'text-gray-400'
                                    }`} />
                                </div>
                                {errores.fechaIncidente && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.fechaIncidente}
                                    </p>
                                )}
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hora aproximada (opcional)
                                </label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        name="horaIncidente"
                                        value={formData.horaIncidente}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-purple-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-gray-800 font-medium cursor-pointer"
                                    />
                                    <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none ${
                                        formData.horaIncidente ? 'text-purple-600' : 'text-gray-400'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR */}
                    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-orange-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-orange-200 flex items-center">
                            <span className="bg-gradient-to-br from-orange-600 to-orange-800 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-lg">
                                3
                            </span>
                            <span className="bg-gradient-to-r from-orange-800 to-orange-600 bg-clip-text text-transparent">
                                DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR
                            </span>
                        </h2>

                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                Tipo <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`flex items-start p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                    formData.tipoReclamo === "reclamo"
                                        ? "border-orange-500 bg-orange-50 shadow-lg ring-4 ring-orange-500/20"
                                        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                                }`}>
                                    <input
                                        type="radio"
                                        name="tipoReclamo"
                                        value="reclamo"
                                        checked={
                                            formData.tipoReclamo === "reclamo"
                                        }
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500"
                                    />
                                    <div className="ml-4">
                                        <span className="font-bold text-lg text-gray-800 block mb-1">
                                            Reclamo
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Disconformidad relacionada a los
                                            productos o servicios.
                                        </p>
                                    </div>
                                </label>
                                <label className={`flex items-start p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                    formData.tipoReclamo === "queja"
                                        ? "border-orange-500 bg-orange-50 shadow-lg ring-4 ring-orange-500/20"
                                        : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                                }`}>
                                    <input
                                        type="radio"
                                        name="tipoReclamo"
                                        value="queja"
                                        checked={
                                            formData.tipoReclamo === "queja"
                                        }
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500"
                                    />
                                    <div className="ml-4">
                                        <span className="font-bold text-lg text-gray-800 block mb-1">
                                            Queja
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Disconformidad no relacionada a los
                                            productos o servicios, o malestar
                                            por la atención.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="mb-6 group">
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                <FileText className="w-4 h-4 text-orange-600" />
                                Detalle <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    name="detalleReclamo"
                                    value={formData.detalleReclamo}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className={`w-full pl-12 pr-4 py-4 border-2 ${
                                        errores.detalleReclamo
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200 focus:border-orange-500"
                                    } rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 text-gray-800 font-medium resize-none`}
                                    placeholder="Describa con detalle su reclamo o queja..."
                                ></textarea>
                                <FileText className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                                    formData.detalleReclamo ? 'text-orange-600' : 'text-gray-400'
                                }`} />
                            </div>
                            {errores.detalleReclamo && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {errores.detalleReclamo}
                                </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                <Info className="w-4 h-4 text-orange-600" />
                                Mínimo 10 caracteres. Sea lo más específico posible.
                            </p>
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                                <Shield className="w-4 h-4 text-orange-600" />
                                Pedido <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    name="pedido"
                                    value={formData.pedido}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className={`w-full pl-12 pr-4 py-4 border-2 ${
                                        errores.pedido
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200 focus:border-orange-500"
                                    } rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 text-gray-800 font-medium resize-none`}
                                    placeholder="Indique qué solución espera recibir..."
                                ></textarea>
                                <Shield className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                                    formData.pedido ? 'text-orange-600' : 'text-gray-400'
                                }`} />
                            </div>
                            {errores.pedido && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {errores.pedido}
                                </p>
                            )}
                        </div>

                        {/*  <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Archivos adjuntos (opcional)
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Adjuntar archivos
                                </button>
                                <span className="text-xs text-gray-500">
                                    Máximo 3 archivos (JPG, PNG, PDF - 5MB máx.
                                    c/u)
                                </span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                            />
                            {errores.archivos && (
                                <p className="text-red-500 text-xs mt-1 error-message">
                                    {errores.archivos}
                                </p>
                            )}

                            {archivosAdjuntos.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-medium mb-2">
                                        Archivos seleccionados:
                                    </p>
                                    <ul className="space-y-2">
                                        {archivosAdjuntos.map((file, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between bg-gray-50 p-2 rounded border"
                                            >
                                                <div className="flex items-center">
                                                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                                    <span className="text-sm truncate max-w-xs">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        (
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarArchivo(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>*/}
                    </div>

                    {/* 4. VERIFICACIÓN DE SEGURIDAD */}
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg border-2 border-green-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-green-200 flex items-center">
                            <span className="bg-gradient-to-br from-green-600 to-green-800 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-lg">
                                4
                            </span>
                            <span className="bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                                VERIFICACIÓN DE SEGURIDAD
                            </span>
                        </h2>

                        <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl select-none text-center w-full md:w-56 font-mono text-2xl tracking-widest shadow-inner border-2 border-gray-200">
                                <span
                                    className="relative z-10 inline-block font-bold text-gray-800"
                                    aria-label="Código de seguridad"
                                >
                                    {captchaActual.split("").map((char, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                transform: `rotate(${
                                                    Math.random() * 20 - 10
                                                }deg)`,
                                                display: "inline-block",
                                                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-full h-0.5 bg-gray-400/30"
                                            style={{
                                                top: `${
                                                    Math.random() * 70 + 15
                                                }%`,
                                                transform: `rotate(${
                                                    Math.random() * 50 - 25
                                                }deg)`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <label
                                    htmlFor="captcha-input"
                                    className="flex items-center gap-2 text-gray-700 font-semibold mb-3"
                                >
                                    <Shield className="w-4 h-4 text-green-600" />
                                    Ingrese el código mostrado{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-green-600" />
                                    Distingue entre mayúsculas y minúsculas
                                </p>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            id="captcha-input"
                                            type="text"
                                            value={captchaValue}
                                            onChange={(e) => {
                                                setCaptchaValue(e.target.value);
                                                // Limpiar error si el usuario está escribiendo
                                                if (errores.captcha) {
                                                    setErrores((prev) => {
                                                        const newErrors = {
                                                            ...prev,
                                                        };
                                                        delete newErrors.captcha;
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                            onBlur={() => {
                                                // Verificar automáticamente cuando el usuario sale del campo
                                                if (
                                                    captchaValue.length > 0 &&
                                                    !formData.captchaResuelto
                                                ) {
                                                    verificarCaptcha();
                                                }
                                            }}
                                            className={`w-full pl-12 pr-4 py-4 border-2 ${
                                                errores.captcha
                                                    ? "border-red-500 bg-red-50"
                                                    : formData.captchaResuelto
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200 focus:border-green-500"
                                            } rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 font-medium`}
                                            placeholder="Ingrese el código"
                                            aria-describedby="captcha-help"
                                            maxLength="6"
                                        />
                                        <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                            formData.captchaResuelto ? 'text-green-600' : captchaValue ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            generarCaptcha();
                                            setCaptchaValue("");
                                            setFormData((prev) => ({
                                                ...prev,
                                                captchaResuelto: false,
                                            }));
                                        }}
                                        className="px-5 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                                        aria-label="Generar nuevo código"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Nuevo
                                    </button>
                                </div>
                                {errores.captcha && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                                        <AlertCircle className="w-4 h-4" />
                                        {errores.captcha}
                                    </p>
                                )}
                                {formData.captchaResuelto && (
                                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1 font-semibold">
                                        <CheckCircle className="w-5 h-5" />
                                        CAPTCHA verificado correctamente
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 5. AUTORIZACIÓN Y TÉRMINOS */}
                    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-lg border-2 border-indigo-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200 flex items-center">
                            <span className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-lg">
                                5
                            </span>
                            <span className="bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
                                AUTORIZACIÓN Y TÉRMINOS
                            </span>
                        </h2>

                        <div className="space-y-4">
                            <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                formData.autorizaNotificacion 
                                    ? "border-indigo-500 bg-indigo-50 shadow-md" 
                                    : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                            }`}>
                                <input
                                    type="checkbox"
                                    name="autorizaNotificacion"
                                    checked={formData.autorizaNotificacion}
                                    onChange={handleChange}
                                    className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded"
                                />
                                <div className="flex-1">
                                    <p className="text-gray-800 font-medium leading-relaxed">
                                        Autorizo que la respuesta a este reclamo sea
                                        notificada al correo electrónico consignado en
                                        el presente documento.
                                    </p>
                                </div>
                            </label>

                            <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                                errores.aceptaTerminos
                                    ? "border-red-500 bg-red-50"
                                    : formData.aceptaTerminos
                                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                                    : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                            }`}>
                                <input
                                    type="checkbox"
                                    name="aceptaTerminos"
                                    checked={formData.aceptaTerminos}
                                    onChange={handleChange}
                                    className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded"
                                />
                                <div className="flex-1">
                                    <p className="text-gray-800 font-medium leading-relaxed">
                                        He leído y acepto los{" "}
                                        <button
                                            type="button"
                                            onClick={() => setMostrarTerminos(true)}
                                            className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
                                        >
                                            términos y condiciones
                                        </button>{" "}
                                        y la política de privacidad.{" "}
                                        <span className="text-red-500">*</span>
                                    </p>
                                </div>
                            </label>
                            {errores.aceptaTerminos && (
                                <p className="text-red-500 text-sm ml-9 flex items-center gap-1 animate-fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {errores.aceptaTerminos}
                                </p>
                            )}
                        </div>
                        
                        {/* Modal de Términos y Condiciones - Mejorado */}
                        {mostrarTerminos && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div 
                                    className="bg-white lg:min-w-[600px] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header FIJO con título y botón cerrar */}
                                    <div 
                                        className="sticky top-0 z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.05) 0%, rgba(35, 84, 184, 0.05) 50%, rgba(222, 52, 100, 0.05) 100%)'
                                        }}
                                    >
                                        <h2 
                                            className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent"
                                            style={{
                                                backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                                            }}
                                        >
                                            Términos y Condiciones
                                        </h2>
                                        
                                        {/* Botón cerrar */}
                                        <button
                                            type="button"
                                            onClick={() => setMostrarTerminos(false)}
                                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-300 hover:scale-110"
                                            aria-label="Cerrar"
                                        >
                                            <X className="w-6 h-6" strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    {/* Contenido con scroll */}
                                    <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                                        <HtmlContent
                                            className="prose prose-lg max-w-none
                                                prose-headings:bg-clip-text prose-headings:text-transparent prose-headings:font-bold
                                                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                                prose-a:text-hd-cerulean prose-a:no-underline hover:prose-a:text-hd-android prose-a:transition-colors
                                                prose-strong:text-gray-900 prose-strong:font-bold
                                                prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2
                                                prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2
                                                prose-li:text-gray-700
                                                prose-blockquote:border-l-4 prose-blockquote:border-hd-android prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                                            "
                                            html={terms?.description}
                                            style={{
                                                '--tw-prose-headings': 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)',
                                            }}
                                        />

                                        {/* Botón de aceptar inferior */}
                                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMostrarTerminos(false);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        aceptaTerminos: true,
                                                    }));
                                                    setErrores((prev) => {
                                                        const newErrors = {
                                                            ...prev,
                                                        };
                                                        delete newErrors.aceptaTerminos;
                                                        return newErrors;
                                                    });
                                                }}
                                                className="px-10 py-3 bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
                                            >
                                                Aceptar Términos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Información legal */}
                    <div className="bg-blue-50 p-4 rounded-xl mb-6 border-l-4 border-blue-400">
                        <div className="flex">
                            <AlertCircle className="w-6 h-6 text-[#224483] mr-2 flex-shrink-0" />
                            <div className="text-sm text-[#224483]">
                                <p className="font-semibold mb-1">
                                    INFORMACIÓN IMPORTANTE:
                                </p>
                                <ol className="list-decimal pl-4 space-y-1">
                                    <li>
                                        La formulación del reclamo no impide
                                        acudir a otras vías de solución de
                                        controversias ni es requisito previo
                                        para interponer una denuncia ante el
                                        INDECOPI.
                                    </li>
                                    <li>
                                        El proveedor deberá dar respuesta al
                                        reclamo en un plazo no mayor a treinta
                                        (30) días calendario, pudiendo ampliar
                                        el plazo hasta por treinta (30) días
                                        más, previa comunicación al consumidor.
                                    </li>
                                    <li>
                                        El proveedor deberá conservar los Libros
                                        de Reclamaciones por un período mínimo
                                        de dos (2) años.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Modal de Confirmación de Envío - Mejorado */}
                    {showConfirmation && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div 
                                className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header con gradiente */}
                                <div 
                                    className="px-8 py-6 text-center"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                                    }}
                                >
                                    {/* Icono de alerta */}
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 rounded-full bg-blue-100">
                                            <AlertCircle className="w-16 h-16 text-blue-600" strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    <h3 
                                        className="text-2xl font-bold bg-clip-text text-transparent mb-3"
                                        style={{
                                            backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                                        }}
                                    >
                                        Confirmar envío
                                    </h3>
                                    
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        ¿Está seguro que desea enviar su reclamo?
                                        Revise que todos los datos sean correctos.
                                    </p>
                                </div>

                                {/* Botones de acción */}
                                <div className="px-8 pb-8 pt-4 flex gap-3 justify-center">
                                    <button
                                        onClick={() => setShowConfirmation(false)}
                                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold text-base hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            setShowConfirmation(false);
                                            handleSubmit(e);
                                        }}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        Confirmar envío
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón de envío */}
                    <div className="flex justify-center pt-4">
                        <button
                            type="button"
                            onClick={() => setShowConfirmation(true)}
                            disabled={submitted}
                            className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-3">
                                {submitted ? (
                                    <>
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                        Enviando reclamo...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ENVIAR RECLAMO
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <Info className="w-4 h-4 inline mr-2 text-blue-600" />
                        Al enviar este formulario, recibirá un número de reclamo
                        que le permitirá hacer seguimiento a su caso.
                    </p>
                </form>
            </div>
            </main>
            <Footer generals={generals} socials={socials} />
            <WhatsAppButton socials={socials} generals={generals} />
        </div>
    );
};
CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <LibroDeReclamaciones {...properties} />
            </Base>
        </CarritoProvider>
    );
});

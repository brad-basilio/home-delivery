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

const LibroDeReclamaciones = ({ sedes, servicios, terms, generals = [], socials = [] }) => {
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
        sede: "",
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
            "sede",
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

        // Detalles del reclamo
        autoTable(doc, {
            startY: yPos,
            head: [["DETALLES DEL RECLAMO"]],
            body: [
                ["Sede", formData.sede || ""],
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
            <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
                <Header />
                <main className="pt-20 md:pt-24">
                    <div className="max-w-4xl mx-auto px-[5%] py-12 md:py-16 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="text-center py-10">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-[#224483]" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            ¡Reclamo Registrado Exitosamente!
                        </h2>
                        <div className="mb-6 p-6 border-2 border-[#224483] rounded-lg inline-block bg-blue-50">
                            <p className="text-lg font-semibold text-gray-800 mb-1">
                                Número de Reclamo:{" "}
                                <span className="text-[#224483] text-xl">
                                    {numeroReclamo}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Guarde este número para futuras consultas
                            </p>
                            <div className="mt-4 flex justify-center">
                                {/* <button
                                    onClick={generarPDF}
                                    className="flex items-center text-[#224483] hover:text-blue-800 font-medium"
                                >
                                    <FileText className="w-4 h-4 mr-1" />
                                    Descargar comprobante
                                </button>*/}
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto mb-8 text-left p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">
                                Resumen de su reclamo:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Nombre:
                                        </span>{" "}
                                        {formData.nombre} {formData.apellido}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Documento:
                                        </span>{" "}
                                        {formData.tipoDocumento.toUpperCase()}{" "}
                                        {formData.numeroDocumento}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Contacto:
                                        </span>{" "}
                                        {formData.telefono} / {formData.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Sede:
                                        </span>{" "}
                                        {formData.sede}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Servicio:
                                        </span>{" "}
                                        {formData.servicio}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Tipo:
                                        </span>{" "}
                                        {formData.tipoReclamo === "queja"
                                            ? "Queja"
                                            : "Reclamo"}
                                    </p>
                                    <p className="mb-2">
                                        <span className="font-semibold">
                                            Fecha de registro:
                                        </span>{" "}
                                        {fechaActual} {horaActual}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="mb-1 font-semibold">Detalle:</p>
                                <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                                    {formData.detalleReclamo}
                                </p>
                            </div>
                            {archivosAdjuntos.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <p className="text-sm font-medium mb-2">
                                        Archivos seleccionados (
                                        {archivosAdjuntos.length}/3):
                                    </p>
                                    {archivosAdjuntos.map((file, index) => (
                                        <FilePreview
                                            key={index}
                                            file={file}
                                            onRemove={() =>
                                                eliminarArchivo(index)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl mb-8 max-w-2xl mx-auto border border-blue-200">
                            <div className="flex items-start">
                                <div>
                                    <p className="text-[#224483] font-medium mb-1">
                                        Plazo de atención:
                                    </p>
                                    <p className="text-[#224483] text-sm">
                                        De acuerdo con el Código de Protección y
                                        Defensa del Consumidor, su caso será
                                        atendido en un plazo máximo de{" "}
                                        <span className="font-bold">
                                            30 días hábiles
                                        </span>
                                        . Recibirá una respuesta a través del
                                        correo electrónico proporcionado.
                                    </p>
                                </div>
                            </div>
                        </div>

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
                                        //departamento: "",
                                        //provincia: "",
                                        //distrito: "",
                                        sede: "",
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
                                className="px-6 py-3 bg-[#224483] text-white rounded-xl hover:hover:bg-blue-900 transition-colors font-semibold"
                            >
                                Registrar nuevo reclamo
                            </button>
                            <a
                                href="/"
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                            >
                                Volver a la página principal
                            </a>
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
        <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
            <Header />
            <main className="pt-20 md:pt-32 pb-16 md:pb-24">
                <div className="max-w-4xl px-[5%] py-12 md:py-16 mx-auto bg-white shadow-2xl rounded-3xl">
                    {/* Encabezado */}
                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6 mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                LIBRO DE RECLAMACIONES
                            </h1>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">
                            Fecha: {fechaActual}
                        </p>
                        <p className="text-sm text-gray-600">
                            Hora: {horaActual}
                        </p>
                        <p className="text-sm font-medium text-[#224483] mt-1">
                            Hoja de Reclamación
                        </p>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso del formulario</span>
                        <span>
                            {
                                Object.keys(formData).filter(
                                    (key) =>
                                        formData[key] &&
                                        key !== "autorizaNotificacion" &&
                                        key !== "aceptaTerminos" &&
                                        key !== "captchaResuelto"
                                ).length
                            }{" "}
                            de 14 campos completados
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-[#224483] h-2.5 rounded-full"
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

                {/* Información legal */}
                <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-l-4 border-yellow-400">
                    <div className="flex">
                        <Info className="w-6 h-6 text-yellow-600 mr-2 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                            <p className="font-semibold mb-1">
                                AVISO IMPORTANTE:
                            </p>
                            <p>
                                Conforme a lo establecido en el Código de
                                Protección y Defensa del Consumidor (Ley N°
                                29571), este establecimiento cuenta con un Libro
                                de Reclamaciones a tu disposición. Ingresa la
                                información solicitada para registrar tu queja o
                                reclamo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 text-sm text-gray-600 border-b pb-2">
                    <p className="font-medium mb-1">
                        Campos obligatorios{" "}
                        <span className="text-red-500">*</span>
                    </p>
                    <p>
                        Por favor complete todos los campos marcados como
                        obligatorios para registrar su reclamo.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE */}
                    <div className=" rounded-xl p-6 shadow-xl ">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <span className="bg-[#224483] text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">
                                1
                            </span>
                            IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nombres{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errores.nombre
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errores.nombre && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.nombre}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Apellidos{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errores.apellido
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errores.apellido && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.apellido}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tipo de Documento{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="tipoDocumento"
                                    value={formData.tipoDocumento}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errores.tipoDocumento
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="dni">DNI</option>
                                    <option value="ce">
                                        Carné de Extranjería
                                    </option>
                                    <option value="pasaporte">Pasaporte</option>
                                    <option value="ruc">RUC</option>
                                </select>
                                {errores.tipoDocumento && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.tipoDocumento}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
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
                                        className={`w-full px-4 py-2 border ${
                                            errores.numeroDocumento
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <HelpCircle
                                            className="w-4 h-4 text-gray-400"
                                            title={
                                                formData.tipoDocumento === "dni"
                                                    ? "El DNI debe tener 8 dígitos"
                                                    : formData.tipoDocumento ===
                                                      "ruc"
                                                    ? "El RUC debe tener 11 dígitos"
                                                    : "Ingrese su número de documento"
                                            }
                                        />
                                    </div>
                                </div>
                                {errores.numeroDocumento && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.numeroDocumento}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Teléfono{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ejemplo: 987654321"
                                    className={`w-full px-4 py-2 border ${
                                        errores.telefono
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errores.telefono && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.telefono}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Correo Electrónico{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="ejemplo@correo.com"
                                    className={`w-full px-4 py-2 border ${
                                        errores.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errores.email && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Dirección{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                                placeholder="Av. / Calle / Jr. / Psje., N°, Dpto., Int., Urb."
                                className={`w-full px-4 py-2 border ${
                                    errores.direccion
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errores.direccion && (
                                <p className="text-red-500 text-xs mt-1 error-message">
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
                    <div className="rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <span className="bg-[#224483] text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">
                                2
                            </span>
                            IDENTIFICACIÓN DEL BIEN CONTRATADO
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Sede donde ocurrió el incidente{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="sede"
                                    value={formData.sede}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errores.sede
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">
                                        Seleccione una sede
                                    </option>
                                    {sedes.map((sede) => (
                                        <option
                                            key={sede.id}
                                            value={sede.title}
                                        >
                                            {sede.title}
                                        </option>
                                    ))}
                                </select>
                                {errores.sede && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.sede}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Servicio relacionado{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="servicio"
                                    value={formData.servicio}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errores.servicio
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                                {errores.servicio && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.servicio}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Fecha del incidente{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fechaIncidente"
                                    value={formData.fechaIncidente}
                                    onChange={handleChange}
                                    required
                                    max={new Date().toISOString().split("T")[0]}
                                    className={`w-full px-4 py-2 border ${
                                        errores.fechaIncidente
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errores.fechaIncidente && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.fechaIncidente}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Hora aproximada (opcional)
                                </label>
                                <input
                                    type="time"
                                    name="horaIncidente"
                                    value={formData.horaIncidente}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR */}
                    <div className="rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <span className="bg-[#224483] text-white w-7 h-7 rounded-full flex items-center justify-center mr-2 text-sm">
                                3
                            </span>
                            DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR
                        </h2>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Tipo <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="tipoReclamo"
                                        value="reclamo"
                                        checked={
                                            formData.tipoReclamo === "reclamo"
                                        }
                                        onChange={handleChange}
                                        className="mr-2 h-5 w-5"
                                    />
                                    <div>
                                        <span className="font-medium">
                                            Reclamo
                                        </span>
                                        <p className="text-sm text-gray-500">
                                            Disconformidad relacionada a los
                                            productos o servicios.
                                        </p>
                                    </div>
                                </label>
                                <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="tipoReclamo"
                                        value="queja"
                                        checked={
                                            formData.tipoReclamo === "queja"
                                        }
                                        onChange={handleChange}
                                        className="mr-2 h-5 w-5"
                                    />
                                    <div>
                                        <span className="font-medium">
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

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Detalle <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="detalleReclamo"
                                value={formData.detalleReclamo}
                                onChange={handleChange}
                                required
                                rows={5}
                                className={`w-full px-4 py-2 border ${
                                    errores.detalleReclamo
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Describa con detalle su reclamo o queja..."
                            ></textarea>
                            {errores.detalleReclamo && (
                                <p className="text-red-500 text-xs mt-1 error-message">
                                    {errores.detalleReclamo}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                Mínimo 10 caracteres. Sea lo más específico
                                posible.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Pedido <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="pedido"
                                value={formData.pedido}
                                onChange={handleChange}
                                required
                                rows={3}
                                className={`w-full px-4 py-2 border ${
                                    errores.pedido
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Indique qué solución espera recibir..."
                            ></textarea>
                            {errores.pedido && (
                                <p className="text-red-500 text-xs mt-1 error-message">
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

                    <div className="rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-blue-600" />
                            VERIFICACIÓN DE SEGURIDAD
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative bg-gray-100 p-3 rounded-md select-none text-center w-full md:w-48 font-mono text-lg tracking-widest">
                                <span
                                    className="relative z-10 inline-block"
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
                                            className="absolute w-full h-0.5 bg-gray-300"
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
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Ingrese el código mostrado{" "}
                                    <span className="text-red-500">*</span>
                                    <span className="block text-xs font-normal text-gray-500 mt-1">
                                        (Distingue entre mayúsculas y
                                        minúsculas)
                                    </span>
                                </label>
                                <div className="flex gap-2">
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
                                        className={`flex-1 px-4 py-2 border ${
                                            errores.captcha
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Ingrese el código"
                                        aria-describedby="captcha-help"
                                        maxLength="6"
                                    />
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
                                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                                        aria-label="Generar nuevo código"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-1" />
                                        Nuevo
                                    </button>
                                </div>
                                {errores.captcha && (
                                    <p className="text-red-500 text-xs mt-1 error-message">
                                        {errores.captcha}
                                    </p>
                                )}
                                {formData.captchaResuelto && (
                                    <p className="text-green-500 text-xs mt-1">
                                        <CheckCircle className="inline w-4 h-4 mr-1" />
                                        CAPTCHA verificado correctamente
                                    </p>
                                )}
                                <p
                                    id="captcha-help"
                                    className="text-xs text-gray-500 mt-1"
                                >
                                    Por seguridad, ingrese el código que aparece
                                    en la imagen.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Autorización de notificación y términos */}
                    <div className="rounded-xl p-6 shadow-xl">
                        <div className="flex items-start mb-4">
                            <input
                                type="checkbox"
                                name="autorizaNotificacion"
                                checked={formData.autorizaNotificacion}
                                onChange={handleChange}
                                className="mt-1 mr-2 h-5 w-5"
                            />
                            <label className="text-gray-700">
                                Autorizo que la respuesta a este reclamo sea
                                notificada al correo electrónico consignado en
                                el presente documento.
                            </label>
                        </div>

                        <div className="flex items-start mb-2">
                            <input
                                type="checkbox"
                                name="aceptaTerminos"
                                checked={formData.aceptaTerminos}
                                onChange={handleChange}
                                className={`mt-1 mr-2 h-5 w-5 ${
                                    errores.aceptaTerminos
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />
                            <label className="text-gray-700">
                                He leído y acepto los{" "}
                                <button
                                    type="button"
                                    onClick={() => setMostrarTerminos(true)}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    términos y condiciones
                                </button>{" "}
                                y la política de privacidad.{" "}
                                <span className="text-red-500">*</span>
                            </label>
                        </div>
                        {errores.aceptaTerminos && (
                            <p className="text-red-500 text-xs ml-7 error-message">
                                {errores.aceptaTerminos}
                            </p>
                        )}

                        {mostrarTerminos && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-xl max-w-2xl max-h-[80vh] overflow-auto p-6">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                                        <h3 className="text-lg font-bold">
                                            Términos y Condiciones
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMostrarTerminos(false)
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <HtmlContent
                                        className="prose"
                                        html={terms?.description}
                                    />
                                    <div className="mt-4 pt-2 border-t flex justify-end">
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
                                            className="px-4 py-2 bg-[#224483] text-white rounded-md hover:bg-blue-900 transition-colors"
                                        >
                                            Aceptar
                                        </button>
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
                    {showConfirmation && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-md w-full p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">
                                        Confirmar envío
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowConfirmation(false)
                                        }
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="mb-4">
                                    ¿Está seguro que desea enviar su reclamo?
                                    Revise que todos los datos sean correctos.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() =>
                                            setShowConfirmation(false)
                                        }
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            setShowConfirmation(false);
                                            handleSubmit(e);
                                        }}
                                        className="px-4 py-2 bg-[#224483] text-white rounded-md hover:bg-blue-900"
                                    >
                                        Confirmar envío
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón de envío */}
                    <button
                        type="button" // Cambiado a type="button" para evitar envío directo
                        onClick={() => setShowConfirmation(true)}
                        className="px-8 py-3 bg-[#224483] text-white rounded-md hover:hover:bg-blue-900 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
                    >
                        Enviar Reclamo
                    </button>
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

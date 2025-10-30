import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Asume que tienes un servicio para guardar los datos
import BaseAdminto from "../Components/Adminto/Base";
import GeneralsRest from "../Actions/Admin/GeneralsRest";
import CreateReactScript from "../Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import QuillFormGroup from "../Components/Adminto/form/QuillFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import Global from "../Utils/Global";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import TinyMCEFormGroup from "../components/form/TinyMCEFormGroup";


const generalsRest = new GeneralsRest();

const Generals = ({ generals }) => {
    const location =
        generals.find((x) => x.correlative == "location")?.description ?? "0,0";
    // Filtrar solo los generales que son plantillas de email (excluyendo correo de soporte)
    const emailTemplates = generals.filter(g => g.correlative.endsWith('_email') && g.correlative !== 'support_email');

    const [showPreview, setShowPreview] = useState(false);
    const [selectedEmailCorrelative, setSelectedEmailCorrelative] = useState(emailTemplates[0]?.correlative || "");
    const [templateVariables, setTemplateVariables] = useState({});
    const [loadingVars, setLoadingVars] = useState(false);
    const [varsError, setVarsError] = useState(null);
    // Fetch variables for selected template
    useEffect(() => {
        if (!selectedEmailCorrelative) return;
        // Map correlatives to API types
        const correlativeToType = {
            purchase_summary_email: "purchase_summary",
            order_status_changed_email: "order_status_changed",
            blog_published_email: "blog_published",
            claim_email: "claim",
            password_changed_email: "password_changed",
            reset_password_email: "password_reset",
            subscription_email: "subscription",
            verify_account_email: "verify_account",
            message_contact_email: "message_contact",
            admin_contact_notification_email: "admin_contact_notification",
        };
        const type = correlativeToType[selectedEmailCorrelative];
        if (!type) {
            setTemplateVariables({});
            return;
        }
        setLoadingVars(true);
        setVarsError(null);
        fetch(`/api/notification-variables/${type}`)
            .then(res => res.json())
            .then(data => {
                setTemplateVariables(data.variables || {});
                setLoadingVars(false);
            })
            .catch(err => {
                setVarsError("No se pudieron cargar las variables.");
                setLoadingVars(false);
            });
    }, [selectedEmailCorrelative]);
    const [formData, setFormData] = useState({

        email_templates: Object.fromEntries(
            emailTemplates.map(t => [t.correlative, t.description ?? ""])
        ),
        whatsapp_phone:
            generals.find((x) => x.correlative == "whatsapp_phone")?.description ?? "",
        whatsapp_message:
            generals.find((x) => x.correlative == "whatsapp_message")?.description ?? "",
        phones: generals
            .find((x) => x.correlative == "phone_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        emails: generals
            .find((x) => x.correlative == "email_contact")
            ?.description?.split(",")
            ?.map((x) => x.trim()) ?? [""],
        address:
            generals.find((x) => x.correlative == "address")?.description ?? "",
        openingHours:
            generals.find((x) => x.correlative == "opening_hours")
                ?.description ?? "",
        supportPhone:
            generals.find((x) => x.correlative == "support_phone")
                ?.description ?? "",
        supportEmail:
            generals.find((x) => x.correlative == "support_email")
                ?.description ?? "",
        privacyPolicy:
            generals.find((x) => x.correlative == "privacy_policy")
                ?.description ?? "",
        termsConditions:
            generals.find((x) => x.correlative == "terms_conditions")
                ?.description ?? "",
        exchangePolicy:
            generals.find((x) => x.correlative == "exchange_policy")
                ?.description ?? "",
        seoTitle:
            generals.find((x) => x.correlative == "seo_title")?.description ??
            "",
        seoDescription:
            generals.find((x) => x.correlative == "seo_description")
                ?.description ?? "",
        seoKeywords:
            generals.find((x) => x.correlative == "seo_keywords")
                ?.description ?? "",
        cintillo:
            generals.find((x) => x.correlative == "cintillo")?.description ?? "",

        copyright:
            generals.find((x) => x.correlative == "copyright")?.description ?? 
            "Cambia FX © 2019 - Marca registrada de Tu Cambio S.A.C. - RUC: 20603864957",
        emailCoorporativo:
            generals.find((x) => x.correlative == "email_coorporativo")
                ?.description ?? "",
        location: {
            lat: Number(location.split(",").map((x) => x.trim())[0]),
            lng: Number(location.split(",").map((x) => x.trim())[1]),
        },
        // Píxeles de seguimiento
        facebookPixel:
            generals.find((x) => x.correlative == "facebook_pixel")?.description ?? "",
        googleAnalytics:
            generals.find((x) => x.correlative == "google_analytics")?.description ?? "",
        googleTagManager:
            generals.find((x) => x.correlative == "google_tag_manager")?.description ?? "",
        tiktokPixel:
            generals.find((x) => x.correlative == "tiktok_pixel")?.description ?? "",
        linkedinPixel:
            generals.find((x) => x.correlative == "linkedin_pixel")?.description ?? "",
        customPixels:
            generals.find((x) => x.correlative == "custom_pixels")?.description ?? "",
    });

    const [activeTab, setActiveTab] = useState("contact");

    const handleInputChange = (e, index, field) => {
        const { value } = e.target;
        const list = [...formData[field]];
        list[index] = value;
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleAddField = (field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: [...prevState[field], ""],
        }));
    };

    const handleRemoveField = (index, field) => {
        const list = [...formData[field]];
        list.splice(index, 1);
        setFormData((prevState) => ({
            ...prevState,
            [field]: list,
        }));
    };

    const handleMapClick = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await generalsRest.save([
                // Guardar solo el template seleccionado
                ...Object.keys(formData.email_templates).map(correlative => ({
                    correlative,
                    name: emailTemplates.find(t => t.correlative === correlative)?.name || correlative,
                    description: formData.email_templates[correlative],
                })),
                {
                    correlative: "whatsapp_phone",
                    name: "Número de WhatsApp",
                    description: formData.whatsapp_phone,
                },
                {
                    correlative: "whatsapp_message",
                    name: "Mensaje de WhatsApp",
                    description: formData.whatsapp_message,
                },
                {
                    correlative: "phone_contact",
                    name: "Teléfono de contacto",
                    description: formData.phones.join(","),
                },
                {
                    correlative: "email_contact",
                    name: "Correo de contacto",
                    description: formData.emails.join(","),
                },
                {
                    correlative: "address",
                    name: "Dirección",
                    description: formData.address,
                },
                {
                    correlative: "opening_hours",
                    name: "Horarios de atención",
                    description: formData.openingHours,
                },
                {
                    correlative: "support_phone",
                    name: "Número de soporte",
                    description: formData.supportPhone,
                },
                {
                    correlative: "support_email",
                    name: "Correo de soporte",
                    description: formData.supportEmail,
                },
                {
                    correlative: "privacy_policy",
                    name: "Política de privacidad",
                    description: formData.privacyPolicy,
                },
                {
                    correlative: "terms_conditions",
                    name: "Términos y condiciones",
                    description: formData.termsConditions,
                },
                {
                    correlative: "exchange_policy",
                    name: "Política de cambio",
                    description: formData.exchangePolicy,
                },
                {
                    correlative: "seo_title",
                    name: "Titulo - SEO",
                    description: formData.seoTitle,
                },
                {
                    correlative: "seo_description",
                    name: "Descripcion - SEO",
                    description: formData.seoDescription,
                },
                {
                    correlative: "seo_keywords",
                    name: "Palabras clave - SEO",
                    description: formData.seoKeywords,
                },
                {
                    correlative: "copyright",
                    name: "Texto de Copyright",
                    description: formData.copyright,
                },
                {
                    correlative: "email_coorporativo",
                    name: "Email Corporativo",
                    description: formData.emailCoorporativo,
                },
                {
                    correlative: "location",
                    name: "Ubicación",
                    description: `${formData.location.lat},${formData.location.lng}`,
                },
                // Píxeles de seguimiento
                {
                    correlative: "facebook_pixel",
                    name: "Facebook Pixel ID",
                    description: formData.facebookPixel,
                },
                {
                    correlative: "google_analytics",
                    name: "Google Analytics ID",
                    description: formData.googleAnalytics,
                },
                {
                    correlative: "google_tag_manager",
                    name: "Google Tag Manager ID",
                    description: formData.googleTagManager,
                },
                {
                    correlative: "tiktok_pixel",
                    name: "TikTok Pixel ID",
                    description: formData.tiktokPixel,
                },
                {
                    correlative: "linkedin_pixel",
                    name: "LinkedIn Insight Tag ID",
                    description: formData.linkedinPixel,
                },
                {
                    correlative: "custom_pixels",
                    name: "Píxeles Personalizados",
                    description: formData.customPixels,
                },
            ]);
            // alert('Datos guardados exitosamente');
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            // alert('Error al guardar los datos');
        }
    };

    const seo_keywords = (
        generals.find((x) => x.correlative == "seo_keywords")?.description ?? ""
    )
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    useEffect(() => {
        $("#cbo-keywords option").prop("selected", true).trigger("change");
    }, [null]);

    console.log(formData);

    return (
        <div className="card">
            <form className="card-body" onSubmit={handleSubmit}>
                <ul className="nav nav-tabs" id="contactTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        {" "}
                        {/* Quitar el hidden para que se muestren las opciones */}
                        <button
                            className={`nav-link ${activeTab === "contact" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("contact")}
                            type="button"
                            role="tab"
                        >
                            Información de Contacto
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "policies" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("policies")}
                            type="button"
                            role="tab"
                        >
                            Políticas y Términos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "seo" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("seo")}
                            type="button"
                            role="tab"
                        >
                            SEO (Metatags)
                        </button>
                    </li>
                    <li className="nav-item" role="presentation" hidden>
                        {" "}
                        {/* Quitar el hidden para que se muestren las opciones */}
                        <button
                            className={`nav-link ${activeTab === "location" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("location")}
                            type="button"
                            role="tab"
                        >
                            Ubicación
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "pixels" ? "active" : ""}`}
                            onClick={() => setActiveTab("pixels")}
                            type="button"
                            role="tab"
                        >
                            Píxeles de Seguimiento
                        </button>
                    </li>
                    {Global.APP_CORRELATIVE === "cambioDev" && (
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${activeTab === "email" ? "active" : ""}`}
                                onClick={() => setActiveTab("email")}
                                type="button"
                                role="tab"
                            >
                                Email
                            </button>
                        </li>
                    )}
                </ul>

                <div className="tab-content" id="contactTabsContent">
                    <div
                        className={`tab-pane fade ${activeTab === "contact" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="row">
                            <div className="col-md-6">
                                {formData.phones.map((phone, index) => (
                                    <div
                                        key={`phone-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`phone-${index}`}
                                            className="form-label"
                                        >
                                            Teléfono {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id={`phone-${index}`}
                                                value={phone}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "phones"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("phones")}
                                >
                                    Agregar teléfono
                                </button>
                            </div>
                            <div className="col-md-6">
                                {formData.emails.map((email, index) => (
                                    <div
                                        key={`email-${index}`}
                                        className="mb-3"
                                    >
                                        <label
                                            htmlFor={`email-${index}`}
                                            className="form-label"
                                        >
                                            Correo {index + 1}
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`email-${index}`}
                                                value={email}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveField(
                                                        index,
                                                        "emails"
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handleAddField("emails")}
                                >
                                    Agregar correo
                                </button>
                            </div>
                        </div>
                        <div className="mb-3 mt-2">
                            <label htmlFor="address" className="form-label">
                                Dirección
                            </label>
                            <textarea
                                className="form-control"
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <TextareaFormGroup
                                label="Horarios de atencion"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        openingHours: e.target.value,
                                    })
                                }
                                value={formData.openingHours}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportPhone"
                                className="form-label"
                            >
                                Número de soporte
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="supportPhone"
                                value={formData.supportPhone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportPhone: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="supportEmail"
                                className="form-label"
                            >
                                Correo de soporte
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="supportEmail"
                                value={formData.supportEmail}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        supportEmail: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                         <div className="mb-3">
                            <label
                                htmlFor="whatsapp_phone"
                                className="form-label"
                            >
                                Número de WhatsApp
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="whatsapp_phone"
                                value={formData.whatsapp_phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        whatsapp_phone: e.target.value,
                                    })
                                }
                            />
                            <small className="form-text text-muted">
                                Este número se utilizará para recibir consultas a través de WhatsApp.
                            </small>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="whatsapp_message"
                                className="form-label"
                            >
                                Mensaje de WhatsApp
                            </label>
                            <textarea
                                className="form-control"
                                id="whatsapp_message"
                                value={formData.whatsapp_message}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        whatsapp_message: e.target.value,
                                    })
                                }
                            ></textarea>
                            <small className="form-text text-muted">
                                Este mensaje se enviará automáticamente al iniciar una conversación.
                            </small>
                        </div>
                       {/*
                               <div className="mb-3">
                            <label
                                htmlFor="copyright"
                                className="form-label"
                            >
                                Texto del Cintillo
                            </label>
                            <textarea
                                className="form-control"
                                id="cintillo"
                                value={formData.cintillo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cintillo: e.target.value,
                                    })
                                }
                                rows="3"
                            ></textarea>
                            <small className="form-text text-muted">
                                Este texto aparecerá en el header del sitio web.
                            </small>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="copyright"
                                className="form-label"
                            >
                                Texto de Copyright
                            </label>
                            <textarea
                                className="form-control"
                                id="copyright"
                                value={formData.copyright}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        copyright: e.target.value,
                                    })
                                }
                                rows="3"
                            ></textarea>
                            <small className="form-text text-muted">
                                Este texto aparecerá en el footer del sitio web.
                            </small>
                        </div> */}
                        
                        <div className="mb-3">
                            <label
                                htmlFor="emailCoorporativo"
                                className="form-label"
                            >
                                Email Corporativo
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailCoorporativo"
                                value={formData.emailCoorporativo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emailCoorporativo: e.target.value,
                                    })
                                }
                                placeholder="admin@cambiafx.com"
                            />
                            <small className="form-text text-muted">
                                Email donde se enviarán las notificaciones de nuevos contactos.
                            </small>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "policies" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Política de privacidad"
                                value={formData.privacyPolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        privacyPolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <QuillFormGroup
                                label="Términos y condiciones"
                                value={formData.termsConditions}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        termsConditions: value,
                                    })
                                }
                            />
                        </div>
                       <div className="mb-3">
                            <QuillFormGroup
                                label="Políticas de cambio"
                                value={formData.exchangePolicy}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        exchangePolicy: value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <InputFormGroup
                                label="Email Corporativo (para notificaciones)"
                                type="email"
                                value={formData.emailCoorporativo ?? ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emailCoorporativo: e.target.value,
                                    })
                                }
                                placeholder="admin@empresa.com"
                            />
                            <small className="form-text text-muted">
                                Este email recibirá las notificaciones de nuevos mensajes de contacto.
                            </small>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "seo" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <InputFormGroup
                            label="Titulo - SEO"
                            value={formData.seoTitle ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoTitle: e.target.value,
                                })
                            }
                        />
                        <TextareaFormGroup
                            label="Descripcion - SEO"
                            value={formData.seoDescription ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoDescription: e.target.value,
                                })
                            }
                        />
                        <SelectFormGroup
                            id="cbo-keywords"
                            label="Palabras clave - SEO"
                            tags
                            multiple
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seoKeywords: [...$(e.target).val()].join(
                                        ", "
                                    ),
                                })
                            }
                        >
                            {seo_keywords.map((keyword, index) => {
                                return (
                                    <option key={index} value={keyword}>
                                        {keyword}
                                    </option>
                                );
                            })}
                        </SelectFormGroup>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "location" ? "show active" : ""
                            }`}
                        role="tabpanel"
                    >
                        <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "400px",
                                }}
                                center={formData.location}
                                zoom={10}
                                onClick={handleMapClick}
                            >
                                <Marker position={formData.location} />
                            </GoogleMap>
                        </LoadScript>
                        <small className="form-text text-muted">
                            Haz clic en el mapa para seleccionar la ubicación.
                        </small>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "pixels" ? "show active" : ""}`}
                        role="tabpanel"
                    >
                        <div className="alert alert-info">
                            <strong>Píxeles de Seguimiento</strong><br />
                            Configura aquí los códigos de seguimiento para diferentes plataformas. Solo ingresa el ID o código, el script completo se generará automáticamente.
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="facebookPixel" className="form-label">
                                        Facebook Pixel ID
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="facebookPixel"
                                        value={formData.facebookPixel}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                facebookPixel: e.target.value,
                                            })
                                        }
                                        placeholder="123456789012345"
                                    />
                                    <small className="form-text text-muted">
                                        Solo ingresa el ID del pixel (ej: 123456789012345)
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="googleAnalytics" className="form-label">
                                        Google Analytics ID
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="googleAnalytics"
                                        value={formData.googleAnalytics}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                googleAnalytics: e.target.value,
                                            })
                                        }
                                        placeholder="G-XXXXXXXXXX o UA-XXXXXXXX-X"
                                    />
                                    <small className="form-text text-muted">
                                        Ingresa tu Google Analytics ID (GA4: G-XXXXXXXXXX o Universal: UA-XXXXXXXX-X)
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="googleTagManager" className="form-label">
                                        Google Tag Manager ID
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="googleTagManager"
                                        value={formData.googleTagManager}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                googleTagManager: e.target.value,
                                            })
                                        }
                                        placeholder="GTM-XXXXXXX"
                                    />
                                    <small className="form-text text-muted">
                                        Ingresa tu Google Tag Manager ID (ej: GTM-XXXXXXX)
                                    </small>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="tiktokPixel" className="form-label">
                                        TikTok Pixel ID
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tiktokPixel"
                                        value={formData.tiktokPixel}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tiktokPixel: e.target.value,
                                            })
                                        }
                                        placeholder="C4XXXXXXXXXXXXXXXXXXXXXXXXXX"
                                    />
                                    <small className="form-text text-muted">
                                        Ingresa tu TikTok Pixel ID
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="linkedinPixel" className="form-label">
                                        LinkedIn Insight Tag ID
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="linkedinPixel"
                                        value={formData.linkedinPixel}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                linkedinPixel: e.target.value,
                                            })
                                        }
                                        placeholder="12345"
                                    />
                                    <small className="form-text text-muted">
                                        Ingresa tu LinkedIn Partner ID
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="customPixels" className="form-label">
                                Píxeles Personalizados (Código HTML)
                            </label>
                            <textarea
                                className="form-control"
                                id="customPixels"
                                rows="8"
                                value={formData.customPixels}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customPixels: e.target.value,
                                    })
                                }
                                placeholder="<!-- Ingresa aquí scripts personalizados de seguimiento -->
<script>
  // Tu código personalizado aquí
</script>"
                            ></textarea>
                            <small className="form-text text-muted">
                                Aquí puedes agregar scripts personalizados de seguimiento. ⚠️ <strong>Cuidado:</strong> Solo agrega código de fuentes confiables.
                            </small>
                        </div>
                    </div>

                    <div
                        className={`tab-pane fade ${activeTab === "email" ? "show active" : ""}`}
                        role="tabpanel"
                    >
                        <div className="mb-3">
                            <label htmlFor="email_correlative" className="form-label">
                                Tipo de Email <span className="badge bg-info">{emailTemplates.length} disponibles</span>
                            </label>

                            {emailTemplates.length === 0 ? (
                                <div className="alert alert-warning">
                                    <strong>No se encontraron plantillas de email.</strong><br />
                                    Asegúrate de que el seeder se haya ejecutado correctamente: <code>php artisan db:seed --class=EmailsGeneralSeeder</code>
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="email_correlative"
                                        className="form-select mb-3"
                                        value={selectedEmailCorrelative}
                                        onChange={e => setSelectedEmailCorrelative(e.target.value)}
                                    >
                                        <option value="">Selecciona un template</option>
                                        {emailTemplates.map(t => (
                                            <option key={t.correlative} value={t.correlative}>
                                                {t.name || t.correlative.replace(/_/g, ' ').replace(/email/g, '').trim()}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedEmailCorrelative && (
                                        <TinyMCEFormGroup
                                            label={
                                                <>
                                                    Plantilla de Email (HTML seguro, variables: <code>{`{{variable}}`}</code>)
                                                    <small className="d-block text-muted">
                                                        No se permite código PHP ni Blade. Solo variables seguras.<br />
                                                        {loadingVars && <span>Cargando variables...</span>}
                                                        {varsError && <span className="text-danger">{varsError}</span>}
                                                        {!loadingVars && !varsError && (
                                                            <>
                                                                <b>Variables disponibles:</b>{" "}
                                                                {Object.keys(templateVariables).length === 0
                                                                    ? <span>No hay variables para esta notificación.</span>
                                                                    : Object.entries(templateVariables).map(([key, desc]) => (
                                                                        <span key={key} style={{ display: 'inline-block', marginRight: 8 }}>
                                                                            <code>{`{{${key}}}`}</code> <span className="text-muted">({desc})</span>{" "}
                                                                        </span>
                                                                    ))
                                                                }
                                                            </>
                                                        )}
                                                    </small>
                                                </>
                                            }
                                            value={formData.email_templates[selectedEmailCorrelative] || ""}
                                            onChange={content => setFormData({
                                                ...formData,
                                                email_templates: {
                                                    ...formData.email_templates,
                                                    [selectedEmailCorrelative]: content
                                                }
                                            })}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>



                </div>

                <button type="submit" className="btn btn-primary mt-3">
                    Guardar
                </button>
            </form>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Datos Generales">
            <Generals {...properties} />
        </BaseAdminto>
    );
});

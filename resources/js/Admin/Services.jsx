import React, { useEffect, useRef, useState } from "react";
import BaseAdminto from "@Adminto/Base";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ServicesRest from "../Actions/Admin/ServicesRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import { LanguageProvider } from "../context/LanguageContext";
const servicesRest = new ServicesRest();

const Services = (props) => {
    const { brands } = props;
    const [itemData, setItemData] = useState([]);
    const gridRef = useRef();
    const modalRef = useRef();

    // Refs para subir imagen principal, galería y lang
    const imageRef = useRef();
    const galleryRef = useRef();
    const langIdRef = useRef();

    // Refs para campos del formulario
    const idRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();
    //const imageRef = useRef();
    const iconRef = useRef();
    //const colorRef = useRef();
    //const linkRef = useRef();
    // Estados para galería y características
    const [gallery, setGallery] = useState([]);
    //const galleryRef = useRef();
    const [characteristics, setCharacteristics] = useState([{ value: "" }]);
    const [isEditing, setIsEditing] = useState(false);

    // Manejo de la galería
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            isNew: true,
        }));
        setGallery((prev) => [...prev, ...newImages]);
    };

    const removeGalleryImage = (index) => {
        setGallery((prev) => prev.filter((_, i) => i !== index));
    };

    // Manejo de características
    const addCharacteristic = () => {
        setCharacteristics([...characteristics, { value: "" }]);
    };

    const updateCharacteristic = (index, value) => {
        const newCharacteristics = [...characteristics];
        newCharacteristics[index].value = value;
        setCharacteristics(newCharacteristics);
    };

    const removeCharacteristic = (index) => {
        if (characteristics.length <= 1) return;
        const newCharacteristics = characteristics.filter(
            (_, i) => i !== index
        );
        setCharacteristics(newCharacteristics);
    };

    // Cargar datos al editar
    const onModalOpen = (data) => {
        setItemData(data || null);
        setIsEditing(!!data?.id);

        // Resetear formulario
        idRef.current.value = data?.id || "";
        titleRef.current.value = data?.title || "";
        descriptionRef.current.value = data?.description || "";
    // imageRef.current.value = null;
        iconRef.current.value = null;
        
        // Manejo del color (transparente o con valor)
        const hasColor = data?.color && data.color !== "transparent" && data.color !== "";
        setItemData({
            ...data,
            transparent_color: !hasColor,
            color: hasColor ? data?.color : "transparent"
        });
        
       /* if (hasColor) {
            colorRef.current.value = data?.color;
        } else {
            colorRef.current.value = "#000000";
            colorRef.current.dataset.prevColor = "#000000";
        } */
        
        if (data?.image) {
            try {
                if (imageRef && imageRef.image) imageRef.image.src = `/api/service/media/${data.image}`;
            } catch (e) {
                // ignore
            }
        } else if (imageRef && imageRef.current) {
            imageRef.current.value = null;
        }

        // lang id (hidden)
        try {
            if (langIdRef && langIdRef.current) langIdRef.current.value = data?.lang_id ?? 1;
        } catch (e) {}
        
        if (data?.icon) {
            iconRef.image.src = `/api/service/media/${data.icon}`;
        }

        // Cargar galería existente
        if (data?.gallery) {
            console.log(data?.gallery);
            const existingImages = data.gallery.map((url) => ({
                url: `/api/service/media/${url}`,
                isNew: false,
            }));

            setGallery(existingImages);
        } else {
            setGallery([]);
        }

        // Cargar características existentes
        if (data?.characteristics && data.characteristics.length > 0) {
            setCharacteristics(
                data.characteristics.map((item) => ({ value: item }))
            );
        } else {
            setCharacteristics([{ value: "" }]);
        }
        //  linkRef.current.value = data?.link ?? "";
        $(modalRef.current).modal("show");
    };

    // Enviar formulario
    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", titleRef.current.value);
        formData.append("description", descriptionRef.current.value);
        
        // Si el color es transparente, enviar valor especial, de lo contrario enviar el color seleccionado
        //formData.append("color", itemData?.transparent_color ? "transparent" : colorRef.current.value);
        // formData.append("link", linkRef.current.value);

        // Si estamos editando, agregar el ID
        if (isEditing) {
            formData.append("id", idRef.current.value);
        }

        // Agregar imagen principal si existe
        if (imageRef && imageRef.current && imageRef.current.files && imageRef.current.files[0]) {
            formData.append("image", imageRef.current.files[0]);
        }

        // lang_id (por defecto 1 si no viene)
        formData.append('lang_id', (langIdRef && langIdRef.current && langIdRef.current.value) ? langIdRef.current.value : 1);

        // Agregar icono si existe
        if (iconRef.current.files[0]) {
            formData.append("icon", iconRef.current.files[0]);
        }

        // Agregar imágenes de galería nuevas
        gallery
            .filter((img) => img.isNew)
            .forEach((img, index) => {
                formData.append(`gallery[${index}]`, img.file);
            });

        // Agregar IDs de imágenes existentes
        const existingGallery = gallery
            .filter((img) => !img.isNew)
            .map((img) => {
                return img.url.split("/").pop();
            });
        formData.append("existing_gallery", JSON.stringify(existingGallery));

        // Agregar características (filtrar vacías)
        const nonEmptyCharacteristics = characteristics
            .map((c) => c.value.trim())
            .filter((c) => c.length > 0);
        formData.append(
            "characteristics",
            JSON.stringify(nonEmptyCharacteristics)
        );

        // Enviar al backend
        const result = await servicesRest.save(formData);
        if (!result) return;

        // Limpiar y cerrar
        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        setGallery([]);
        setCharacteristics([{ value: "" }]);
        
        // Resetear campos adicionales
       // colorRef.current.value = "#000000";
        iconRef.current.value = null;
    };

    // Resto de métodos (delete, boolean change, etc.)
    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Servicio",
            text: "¿Estás seguro de eliminar este servicio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await servicesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onFeaturedChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "featured",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };
    return (
        <>
            <Table
                gridRef={gridRef}
                title="Servicios"
                rest={servicesRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar",
                            hint: "Agregar nuevo servicio",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "title",
                        caption: "Título",
                        width: "200px",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <div
                                        className="text-truncate"
                                        style={{ maxWidth: "300px" }}
                                    >
                                        {data.description}
                                    </div>
                                )
                            );
                        },
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            if (data.image) {
                                ReactAppend(
                                    container,
                                    <img
                                        src={`/api/service/media/${data.image}`}
                                        style={{
                                            width: "60px",
                                            height: "40px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/images/default-image.png")
                                        }
                                    />
                                );
                            } else {
                                container.html('<span class="text-muted">Sin imagen</span>');
                            }
                        },
                    },
                    {
                        dataField: "icon",
                        caption: "Icono",
                        width: "80px",
                        cellTemplate: (container, { data }) => {
                            if (data.icon) {
                                ReactAppend(
                                    container,
                                    <img
                                        src={`/api/service/media/${data.icon}`}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/images/default-icon.png")
                                        }
                                        className="bg-secondary p-1"
                                    />
                                );
                            } else {
                                container.html('<span class="text-muted">Sin icono</span>');
                            }
                        },
                    },
                    {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.featured == 1}
                                    onChange={() =>
                                        onFeaturedChange({
                                            id: data.id,
                                            value: !data.featured,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />
                            );
                        },
                    },

                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className:
                                        "btn btn-xs btn-soft-primary me-1",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Servicio" : "Nuevo Servicio"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                <input ref={langIdRef} type="hidden" />

                <div className="row">
                    <div className="col-md-8">
                        <InputFormGroup
                            eRef={titleRef}
                            label="Título del servicio"
                            required
                        />

                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea
                                ref={descriptionRef}
                                className="form-control"
                                rows={4}
                                required
                            />
                        </div>

                      {/*  <div className="mb-3">
                            <label className="form-label">Color del servicio</label>
                            <div className="d-flex align-items-center">
                                <input
                                    ref={colorRef}
                                    type="color"
                                    className="form-control form-control-color me-2"
                                    defaultValue="#000000"
                                    title="Selecciona un color"
                                    disabled={itemData?.transparent_color}
                                    onChange={(e) => {
                                        // Actualizar el estado para que se refleje en el overlay
                                        setItemData({
                                            ...itemData,
                                            color: e.target.value
                                        });
                                    }}
                                />
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="transparentColorCheck"
                                        checked={itemData?.transparent_color}
                                        onChange={(e) => {
                                            const prevColor = colorRef.current.value;
                                            if (e.target.checked) {
                                                colorRef.current.dataset.prevColor = prevColor;
                                                colorRef.current.value = "";
                                                
                                                // Actualizar el estado para reflejar que es transparente
                                                setItemData({
                                                    ...itemData,
                                                    transparent_color: true,
                                                    color: "transparent"
                                                });
                                            } else {
                                                const restoredColor = colorRef.current.dataset.prevColor || "#000000";
                                                colorRef.current.value = restoredColor;
                                                
                                                // Actualizar el estado para reflejar el color restaurado
                                                setItemData({
                                                    ...itemData,
                                                    transparent_color: false,
                                                    color: restoredColor
                                                });
                                            }
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="transparentColorCheck">
                                        Sin color (transparente)
                                    </label>
                                </div>
                            </div>
                        </div> */}

                        <div className="mb-3">
                            <label className="form-label">Características</label>
                            {characteristics.map((char, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Entrega en 24h"
                                        value={char.value}
                                        onChange={(e) =>
                                            updateCharacteristic(index, e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeCharacteristic(index)}
                                        disabled={characteristics.length <= 1}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addCharacteristic}
                            >
                                <i className="fas fa-plus me-1"></i> Agregar característica
                            </button>
                        </div>
                        {/*  <InputFormGroup
                            type="url"
                            eRef={linkRef}
                            label="Link"
                        />*/}
                    </div>

                    <div className="col-md-4">
                       

                        {/* Imagen principal - Aspecto 9:16 (vertical) */}
                        <ImageFormGroup
                            eRef={imageRef}
                            label="Imagen principal"
                            aspect={9 / 16}
                            overlayColor={itemData?.transparent_color ? null : itemData?.color}
                            showColorOverlay={true}
                        />

                      
                    </div>
                   <div className="col-md-4">
                      {/* Icono del servicio - Aspecto 1:1 (cuadrado pequeño) */}
                        <ImageFormGroup
                            eRef={iconRef}
                            label="Icono del servicio"
                            aspect={1 / 1}
                            className="p-2"
                        />
                   </div>
                   <div className="col-md-8">
  {/* Galería de imágenes - Aspecto 1:1 (cuadrado) */}
                        <div className="mb-3">
                            <label className="form-label">Galería de imágenes</label>
                            <input
                                type="file"
                                ref={galleryRef}
                                multiple
                                accept="image/*"
                                onChange={handleGalleryChange}
                                className="form-control mb-2"
                            />

                            <div className="d-flex flex-wrap gap-2">
                                {gallery.map((image, index) => (
                                    <div
                                        key={index}
                                        className="position-relative"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                        }}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Galería ${index + 1}`}
                                            className="img-thumbnail h-100 w-100 object-fit-cover rounded"
                                            style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-xs position-absolute top-0 end-0 m-1"
                                            style={{ 
                                                width: "20px", 
                                                height: "20px", 
                                                padding: "0",
                                                lineHeight: "18px",
                                                fontSize: "14px"
                                            }}
                                            onClick={() => removeGalleryImage(index)}
                                            title="Eliminar imagen"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {gallery.length > 0 && (
                                <small className="text-muted d-block mt-2">
                                    {gallery.length} imagen{gallery.length !== 1 ? 'es' : ''} en galería
                                </small>
                            )}
                        </div>
                   </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <LanguageProvider>
            <BaseAdminto {...properties} title="Servicios">
                <Services {...properties} />
            </BaseAdminto>
        </LanguageProvider>
    );
});

import React, { useRef, useState, useCallback, useEffect } from "react";
import BaseAdminto from "@Adminto/Base";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import Global from "../Utils/Global";
// import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
// import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
// import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import OfficesRest from "../actions/Admin/OfficesRest";

const officesRest = new OfficesRest();

// Librerías de Google Maps - DEBE estar fuera del componente para evitar re-renders
const GOOGLE_MAPS_LIBRARIES = ["places"];

const officeTypes = [
    { value: "oficina_principal", label: "Oficina Principal" },
    { value: "oficina", label: "Oficina" },
    { value: "almacen", label: "Almacén" },
];

// Comentado: Horarios de atención - No se usa actualmente en LibroDeReclamaciones
// const defaultBusinessHours = [
//     { day: "Lunes", open: "08:00", close: "18:00", closed: false },
//     { day: "Martes", open: "08:00", close: "18:00", closed: false },
//     { day: "Miércoles", open: "08:00", close: "18:00", closed: false },
//     { day: "Jueves", open: "08:00", close: "18:00", closed: false },
//     { day: "Viernes", open: "08:00", close: "18:00", closed: false },
//     { day: "Sábado", open: "09:00", close: "13:00", closed: false },
//     { day: "Domingo", open: "", close: "", closed: true },
// ];

const Offices = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Refs para campos del formulario
    const idRef = useRef();
    const nameRef = useRef();
    const typeRef = useRef();
    const addressRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const latitudeRef = useRef();
    const longitudeRef = useRef();
    
    // Comentado: Campos no usados actualmente
    // const descriptionRef = useRef();
    // const ubigeoRef = useRef();
    // const managerRef = useRef();
    // const capacityRef = useRef();
    // const linkRef = useRef();
    // const imageRef = useRef();
    const visibleRef = useRef();

    // Comentado: Estados para business_hours - No se usa actualmente
    // const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
    const [isEditing, setIsEditing] = useState(false);
    
    // Estados para el mapa
    const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 }); // Lima por defecto
    const [markerPosition, setMarkerPosition] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const searchInputRef = useRef();
    
    // Efecto para arreglar el z-index de las sugerencias de Google Maps
    useEffect(() => {
        // El dropdown de Google (.pac-container) necesita z-index alto para aparecer sobre el modal
        const style = document.createElement('style');
        style.innerHTML = `
            .pac-container {
                z-index: 10000 !important;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    
    // Callback cuando se carga el script de Google Maps
    const onLoadScript = useCallback(() => {
        console.log("Google Maps script loaded");
        setMapsLoaded(true);
    }, []);
    
    // Callback cuando se carga el Autocomplete
    const onAutocompleteLoad = useCallback((autocompleteInstance) => {
        console.log("Autocomplete loaded:", autocompleteInstance);
        setAutocomplete(autocompleteInstance);
    }, []);
    
    // Callback cuando se selecciona un lugar del buscador
    const onPlaceChanged = useCallback(() => {
        console.log("Place changed, autocomplete:", autocomplete);
        if (autocomplete) {
            const place = autocomplete.getPlace();
            console.log("Selected place:", place);
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                
                setMapCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
                
                // Actualizar los campos de latitud y longitud
                if (latitudeRef.current) latitudeRef.current.value = lat;
                if (longitudeRef.current) longitudeRef.current.value = lng;
                
                // Si hay dirección, actualizar el campo de dirección
                if (place.formatted_address && addressRef.current) {
                    addressRef.current.value = place.formatted_address;
                }
            }
        }
    }, [autocomplete]);
    
    // Callback cuando se hace clic en el mapa
    const handleMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        setMarkerPosition({ lat, lng });
        
        // Actualizar los campos de latitud y longitud
        if (latitudeRef.current) latitudeRef.current.value = lat;
        if (longitudeRef.current) longitudeRef.current.value = lng;
    }, []);

    // Comentado: Manejo de horarios - No se usa actualmente
    // const updateBusinessHour = (index, field, value) => {
    //     const newBusinessHours = [...businessHours];
    //     newBusinessHours[index][field] = value;
    //     setBusinessHours(newBusinessHours);
    // };

    // Cargar datos al editar
    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);

        // Resetear formulario
        idRef.current.value = data?.id || "";
        nameRef.current.value = data?.name || "";
        typeRef.current.value = data?.type || "oficina";
        addressRef.current.value = data?.address || "";
        phoneRef.current.value = data?.phone || "";
        emailRef.current.value = data?.email || "";
        latitudeRef.current.value = data?.latitude || "";
        longitudeRef.current.value = data?.longitude || "";
        visibleRef.current.checked = data?.visible ?? true;
        
        // Configurar el mapa si hay coordenadas
        if (data?.latitude && data?.longitude) {
            const lat = parseFloat(data.latitude);
            const lng = parseFloat(data.longitude);
            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });
        } else {
            // Resetear a Lima por defecto
            setMapCenter({ lat: -12.0464, lng: -77.0428 });
            setMarkerPosition(null);
        }
        
        // Limpiar el buscador
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }

        // Comentado: Campos no usados actualmente
        // descriptionRef.current.value = data?.description || "";
        // ubigeoRef.current.value = data?.ubigeo || "";
        // managerRef.current.value = data?.manager || "";
        // capacityRef.current.value = data?.capacity || "";
        // linkRef.current.value = data?.link || "";

        // Comentado: Cargar imagen existente
        // if (data?.image) {
        //     $(imageRef.current)
        //         .closest(".image-form-group")
        //         .find("img")
        //         .attr("src", `/api/office/media/${data.image}`);
        // } else {
        //     $(imageRef.current)
        //         .closest(".image-form-group")
        //         .find("img")
        //         .attr("src", "/lte/images/placeholder.png");
        // }

        // Comentado: Cargar horarios de atención existentes
        // if (data?.business_hours && data.business_hours.length > 0) {
        //     setBusinessHours(
        //         data.business_hours.map((item) => ({
        //             day: item.day || "",
        //             open: item.open || "",
        //             close: item.close || "",
        //             closed: item.closed || false,
        //         }))
        //     );
        // } else {
        //     setBusinessHours(defaultBusinessHours);
        // }

        $(modalRef.current).modal("show");
    };

    // Enviar formulario
    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("type", typeRef.current.value);
        formData.append("address", addressRef.current.value);
        formData.append("phone", phoneRef.current.value);
        formData.append("email", emailRef.current.value);
        formData.append("latitude", latitudeRef.current.value);
        formData.append("longitude", longitudeRef.current.value);
        formData.append("visible", visibleRef.current.checked ? 1 : 0);

        // Comentado: Campos no usados actualmente
        // formData.append("description", descriptionRef.current.value);
        // formData.append("ubigeo", ubigeoRef.current.value);
        // formData.append("manager", managerRef.current.value);
        // formData.append("capacity", capacityRef.current.value);
        // formData.append("link", linkRef.current.value);

        // Si estamos editando, agregar el ID
        if (isEditing) {
            formData.append("id", idRef.current.value);
        }

        // Comentado: Agregar imagen si existe
        // if (imageRef.current.files[0]) {
        //     formData.append("image", imageRef.current.files[0]);
        // }

        // Comentado: Agregar horarios de atención
        // formData.append("business_hours", JSON.stringify(businessHours));

        // Enviar al backend
        const result = await officesRest.save(formData);
        if (!result) return;

        // Limpiar y cerrar
        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
        // setBusinessHours(defaultBusinessHours);
    };

    // Eliminar oficina
    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Oficina",
            text: "¿Estás seguro de eliminar esta oficina?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await officesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Cambiar visibilidad
    const onVisibleChange = async ({ id, value }) => {
        const result = await officesRest.boolean({ id, field: "visible", value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Oficinas / Almacenes"
                rest={officesRest}
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
                            hint: "Agregar nueva oficina",
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
                    // Comentado: Columna de imagen - No se usa actualmente
                    // {
                    //     dataField: "image",
                    //     caption: "Imagen",
                    //     width: "80px",
                    //     allowFiltering: false,
                    //     cellTemplate: (container, { data }) => {
                    //         const src = data.image
                    //             ? `/api/office/media/${data.image}`
                    //             : "/lte/images/placeholder.png";
                    //         container.html(
                    //             renderToString(
                    //                 <img
                    //                     src={src}
                    //                     alt={data.name}
                    //                     className="img-thumbnail"
                    //                     style={{
                    //                         width: "60px",
                    //                         height: "60px",
                    //                         objectFit: "cover",
                    //                     }}
                    //                 />
                    //             )
                    //         );
                    //     },
                    // },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        width: "250px",
                    },
                    {
                        dataField: "type",
                        caption: "Tipo",
                        width: "150px",
                        cellTemplate: (container, { data }) => {
                            const typeLabels = {
                                oficina_principal: "Oficina Principal",
                                oficina: "Oficina",
                                almacen: "Almacén",
                            };
                            const typeColors = {
                                oficina_principal: "bg-primary",
                                oficina: "bg-info",
                                almacen: "bg-warning",
                            };
                            container.html(
                                renderToString(
                                    <span
                                        className={`badge ${
                                            typeColors[data.type] || "bg-secondary"
                                        }`}
                                    >
                                        {typeLabels[data.type] || data.type}
                                    </span>
                                )
                            );
                        },
                    },
                    {
                        dataField: "address",
                        caption: "Dirección",
                    },
                    // Comentado: Columnas no usadas actualmente
                    // {
                    //     dataField: "phone",
                    //     caption: "Teléfono",
                    //     width: "120px",
                    // },
                    // {
                    //     dataField: "manager",
                    //     caption: "Encargado",
                    //     width: "150px",
                    // },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "80px",
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
                title={isEditing ? "Editar Oficina" : "Nueva Oficina"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />

                <InputFormGroup
                    eRef={nameRef}
                    label="Nombre de la oficina"
                    required
                />

                <div className="mb-3">
                    <label className="form-label">
                        Tipo <span className="text-danger">*</span>
                    </label>
                    <select
                        ref={typeRef}
                        className="form-select"
                        required
                    >
                        {officeTypes.map((type) => (
                            <option
                                key={type.value}
                                value={type.value}
                            >
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <InputFormGroup
                    eRef={addressRef}
                    label="Dirección"
                    required
                />

                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup eRef={phoneRef} label="Teléfono" />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup eRef={emailRef} label="Email" type="email" />
                    </div>
                </div>

                {/* Campos ocultos para latitud y longitud */}
                <input ref={latitudeRef} type="hidden" />
                <input ref={longitudeRef} type="hidden" />
                
                {/* Mapa con buscador */}
                <div className="mb-3">
                    <label className="form-label">
                        <i className="fa fa-map-marker-alt me-1"></i>
                        Ubicación en el mapa
                    </label>
                    <LoadScript 
                        googleMapsApiKey={Global.GMAPS_API_KEY} 
                        libraries={GOOGLE_MAPS_LIBRARIES}
                        onLoad={onLoadScript}
                    >
                        {/* Buscador de direcciones */}
                        <div className="mb-2">
                            <Autocomplete
                                onLoad={onAutocompleteLoad}
                                onPlaceChanged={onPlaceChanged}
                            >
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar dirección, lugar o establecimiento..."
                                    style={{ width: '100%' }}
                                />
                            </Autocomplete>
                        </div>
                        
                        {/* Mapa */}
                        <GoogleMap
                            mapContainerStyle={{
                                width: "100%",
                                height: "300px",
                                borderRadius: "8px"
                            }}
                            center={mapCenter}
                            zoom={15}
                            onClick={handleMapClick}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: true
                            }}
                        >
                            {markerPosition && (
                                <Marker 
                                    position={markerPosition}
                                    draggable={true}
                                    onDragEnd={(e) => {
                                        const lat = e.latLng.lat();
                                        const lng = e.latLng.lng();
                                        setMarkerPosition({ lat, lng });
                                        if (latitudeRef.current) latitudeRef.current.value = lat;
                                        if (longitudeRef.current) longitudeRef.current.value = lng;
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>
                    <small className="text-muted">
                        <i className="fa fa-info-circle me-1"></i>
                        Busca una dirección o haz clic en el mapa para marcar la ubicación. Puedes arrastrar el marcador para ajustar.
                    </small>
                    
                    {/* Mostrar coordenadas seleccionadas */}
                    {markerPosition && (
                        <div className="mt-2 p-2 bg-light rounded small">
                            <strong>Coordenadas:</strong> {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                        </div>
                    )}
                </div>

                {/* Comentado: Campos no usados actualmente
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea ref={descriptionRef} className="form-control" rows={3} />
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup eRef={ubigeoRef} label="Ubigeo" maxLength={6} />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup eRef={capacityRef} label="Capacidad" type="number" />
                    </div>
                </div>

                <InputFormGroup eRef={managerRef} label="Encargado" />
                <InputFormGroup eRef={linkRef} label="Link (Google Maps, etc.)" type="url" />

                <ImageFormGroup eRef={imageRef} label="Imagen" aspect={16 / 9} />

                <div className="mb-3">
                    <label className="form-label">Horarios de Atención</label>
                    <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                            <thead>
                                <tr>
                                    <th>Día</th>
                                    <th>Apertura</th>
                                    <th>Cierre</th>
                                    <th>Cerrado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {businessHours.map((bh, index) => (
                                    <tr key={index}>
                                        <td><input type="text" className="form-control form-control-sm" value={bh.day} onChange={(e) => updateBusinessHour(index, "day", e.target.value)} /></td>
                                        <td><input type="time" className="form-control form-control-sm" value={bh.open} disabled={bh.closed} onChange={(e) => updateBusinessHour(index, "open", e.target.value)} /></td>
                                        <td><input type="time" className="form-control form-control-sm" value={bh.close} disabled={bh.closed} onChange={(e) => updateBusinessHour(index, "close", e.target.value)} /></td>
                                        <td className="text-center"><input type="checkbox" className="form-check-input" checked={bh.closed} onChange={(e) => updateBusinessHour(index, "closed", e.target.checked)} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                */}

                <div className="mb-3">
                    <div className="form-check form-switch">
                        <input
                            ref={visibleRef}
                            className="form-check-input"
                            type="checkbox"
                            id="visibleSwitch"
                            defaultChecked={true}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="visibleSwitch"
                        >
                            Visible en el sitio web
                        </label>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Oficinas">
            <Offices {...properties} />
        </BaseAdminto>
    );
});

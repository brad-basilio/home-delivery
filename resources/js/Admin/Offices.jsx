import React, { useRef, useState } from "react";
import BaseAdminto from "@Adminto/Base";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";

import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
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

    // Refs para campos del formulario - Solo campos esenciales
    const idRef = useRef();
    const nameRef = useRef();
    const typeRef = useRef();
    const addressRef = useRef();
    
    // Comentado: Campos no usados actualmente en LibroDeReclamaciones
    // const phoneRef = useRef();
    // const emailRef = useRef();
    // const descriptionRef = useRef();
    // const ubigeoRef = useRef();
    // const latitudeRef = useRef();
    // const longitudeRef = useRef();
    // const managerRef = useRef();
    // const capacityRef = useRef();
    // const linkRef = useRef();
    // const imageRef = useRef();
    const visibleRef = useRef();

    // Comentado: Estados para business_hours - No se usa actualmente
    // const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
    const [isEditing, setIsEditing] = useState(false);

    // Comentado: Manejo de horarios - No se usa actualmente
    // const updateBusinessHour = (index, field, value) => {
    //     const newBusinessHours = [...businessHours];
    //     newBusinessHours[index][field] = value;
    //     setBusinessHours(newBusinessHours);
    // };

    // Cargar datos al editar
    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);

        // Resetear formulario - Solo campos esenciales
        idRef.current.value = data?.id || "";
        nameRef.current.value = data?.name || "";
        typeRef.current.value = data?.type || "oficina";
        addressRef.current.value = data?.address || "";
        visibleRef.current.checked = data?.visible ?? true;

        // Comentado: Campos no usados actualmente
        // phoneRef.current.value = data?.phone || "";
        // emailRef.current.value = data?.email || "";
        // descriptionRef.current.value = data?.description || "";
        // ubigeoRef.current.value = data?.ubigeo || "";
        // latitudeRef.current.value = data?.latitude || "";
        // longitudeRef.current.value = data?.longitude || "";
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
        formData.append("visible", visibleRef.current.checked ? 1 : 0);

        // Comentado: Campos no usados actualmente
        // formData.append("phone", phoneRef.current.value);
        // formData.append("email", emailRef.current.value);
        // formData.append("description", descriptionRef.current.value);
        // formData.append("ubigeo", ubigeoRef.current.value);
        // formData.append("latitude", latitudeRef.current.value);
        // formData.append("longitude", longitudeRef.current.value);
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
                size="md"
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

                {/* Comentado: Campos no usados actualmente en LibroDeReclamaciones
                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup eRef={phoneRef} label="Teléfono" />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup eRef={emailRef} label="Email" type="email" />
                    </div>
                </div>

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

                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup eRef={latitudeRef} label="Latitud" type="number" step="any" />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup eRef={longitudeRef} label="Longitud" type="number" step="any" />
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

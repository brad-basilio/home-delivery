import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";
import AlliancesRest from "../Actions/Admin/AlliancesRest";
import Swal from "sweetalert2";

const alliancesRest = new AlliancesRest();

const Alliances = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const websiteRef = useRef();
    const orderRef = useRef();
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        websiteRef.current.value = data?.website ?? "";
        orderRef.current.value = data?.order ?? 0;

        // Cargar imagen existente
        imageRef.current.value = null;
        imageRef.image.src = `/api/alliance/media/${data?.image ?? "undefined"}`;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("correlative", nameRef.current.value.toLowerCase().replace(/\s+/g, '_'));
        formData.append("description", descriptionRef.current.value);
        formData.append("website", websiteRef.current.value);
        formData.append("order", orderRef.current.value);

        if (isEditing) {
            formData.append("id", idRef.current.value);
        }

        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }

        const result = await alliancesRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await alliancesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar Alianza",
            text: "¿Estás seguro de eliminar esta alianza comercial?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await alliancesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Alianzas Comerciales"
                rest={alliancesRest}
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
                            hint: "Agregar nueva alianza",
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
                        dataField: "image",
                        caption: "Logo",
                        width: "100px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            const src = data.image
                                ? `/api/alliance/media/${data.image}?v=${new Date(data.updated_at).getTime()}`
                                : "/lte/images/placeholder.png";
                            container.html(
                                renderToString(
                                    <img
                                        src={src}
                                        alt={data.name}
                                        className="img-thumbnail bg-light"
                                        style={{
                                            width: "80px",
                                            height: "50px",
                                            objectFit: "contain",
                                        }}
                                    />
                                )
                            );
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        width: "200px",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                    },
                    {
                        dataField: "website",
                        caption: "Sitio Web",
                        width: "200px",
                        cellTemplate: (container, { data }) => {
                            if (data.website) {
                                container.html(
                                    renderToString(
                                        <a
                                            href={data.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary"
                                        >
                                            <i className="mdi mdi-open-in-new me-1"></i>
                                            Visitar
                                        </a>
                                    )
                                );
                            } else {
                                container.text("-");
                            }
                        },
                    },
                    {
                        dataField: "order",
                        caption: "Orden",
                        width: "80px",
                        dataType: "number",
                    },
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
                                    className: "btn btn-xs btn-soft-primary me-1",
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
                title={isEditing ? "Editar Alianza" : "Nueva Alianza"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <input ref={idRef} type="hidden" />

                <InputFormGroup
                    eRef={nameRef}
                    label="Nombre de la empresa"
                    required
                />

                <TextareaFormGroup
                    eRef={descriptionRef}
                    label="Descripción (opcional)"
                    rows={2}
                />

                <InputFormGroup
                    eRef={websiteRef}
                    label="Sitio Web (opcional)"
                    type="url"
                    placeholder="https://www.ejemplo.com"
                />

                <InputFormGroup
                    eRef={orderRef}
                    label="Orden de aparición"
                    type="number"
                    defaultValue={0}
                />

                <ImageFormGroup
                    eRef={imageRef}
                    label="Logo de la empresa"
                    aspect={16 / 9}
                />

                <small className="text-muted">
                    <i className="fa fa-info-circle me-1"></i>
                    Sube el logo de la empresa aliada. Se recomienda imagen con fondo transparente (PNG).
                </small>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Alianzas Comerciales">
            <Alliances {...properties} />
        </BaseAdminto>
    );
});

export default Alliances;

import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "@Utils/CreateReactScript";
import Table from "../Components/Table";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "@Utils/ReactAppend";
import MessagesRest from "@Rest/Admin/MessagesRest";
import Modal from "@Adminto/Modal";
import Swal from "sweetalert2";

const messagesRest = new MessagesRest();

const Messages = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    const [dataLoaded, setDataLoaded] = useState(null);

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar mensaje",
            text: "¿Estas seguro de eliminar este mensaje?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await messagesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onModalOpen = (data) => {
        if (!data.seen) {
            messagesRest.boolean({
                id: data,
                field: "seen",
                value: true,
            });
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
        setDataLoaded(data);
        $(modalRef.current).modal("show");
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Mensajes"
                rest={messagesRest}
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
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span
                                    style={{
                                        width: "100%",
                                        fontWeight: data.seen
                                            ? "lighter"
                                            : "bold",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onModalOpen(data)}
                                >
                                    {data.name}
                                </span>
                            );
                        },
                    },
                    {
                        dataField: "email",
                        caption: "Correo",
                    },
                    {
                        dataField: "service.title",
                        caption: "Servicio",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span>
                                    {data.service?.title || 
                                        <i className="text-muted">- Consulta General -</i>
                                    }
                                </span>
                            );
                        },
                    },
                    {
                        dataField: "company",
                        caption: "Empresa",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span>
                                    {data.company || 
                                        <i className="text-muted">-</i>
                                    }
                                </span>
                            );
                        },
                    },
                    {
                        dataField: "phone",
                        caption: "Teléfono",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span>
                                    {data.phone || 
                                        <i className="text-muted">-</i>
                                    }
                                </span>
                            );
                        },
                    },
                    {
                        dataField: "created_at",
                        caption: "Fecha",
                        dataType: "datetime",
                        format: "yyyy-MM-dd HH:mm:ss",
                        sortOrder: "desc",
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            if (data.seen) {
                                ReactAppend(
                                    container,
                                    <span className="badge bg-success rounded-pill">
                                        Leído
                                    </span>
                                );
                            } else {
                                ReactAppend(
                                    container,
                                    <span className="badge bg-danger rounded-pill">
                                        No leído
                                    </span>
                                );
                            }
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-dark",
                                    title: "Ver mensaje",
                                    icon: "fa fa-eye",
                                    onClick: () => onModalOpen(data),
                                })
                            );
                            // container.append(DxButton({
                            //   className: 'btn btn-xs btn-light',
                            //   title: data.status === null ? 'Restaurar' : 'Cambiar estado',
                            //   icon: data.status === 1 ? 'fa fa-toggle-on text-success' : data.status === 0 ? 'fa fa-toggle-off text-danger' : 'fas fa-trash-restore',
                            //   onClick: () => onStatusChange(data)
                            // }))
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                })
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal modalRef={modalRef} title="Detalle del Mensaje" hideFooter size="lg">
                <div className="row g-3">
                    {/* Sección: Información del Cliente */}
                    <div className="col-12">
                        <div className="bg-light p-3 rounded">
                            <h6 className="text-primary mb-3">
                                <i className="mdi mdi-account-circle me-2"></i>
                                Información del Cliente
                            </h6>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Nombre:</strong>
                                        <span className="ms-2">{dataLoaded?.name}</span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Correo:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.email || (
                                                <i className="text-muted">- Sin correo -</i>
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Teléfono:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.phone || (
                                                <i className="text-muted">- Sin teléfono -</i>
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Empresa:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.company || (
                                                <i className="text-muted">- Sin empresa -</i>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Detalles de la Solicitud */}
                    <div className="col-12">
                        <div className="bg-light p-3 rounded">
                            <h6 className="text-success mb-3">
                                <i className="mdi mdi-package-variant me-2"></i>
                                Detalles de la Solicitud
                            </h6>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Rubro:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.business_sector || (
                                                <i className="text-muted">- Sin rubro -</i>
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Envíos diarios/mensuales:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.daily_shipments || (
                                                <i className="text-muted">- Sin especificar -</i>
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Ubicación:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.location_type || (
                                                <i className="text-muted">- Sin especificar -</i>
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="mb-2">
                                        <strong>Servicio:</strong>
                                        <span className="ms-2">
                                            {dataLoaded?.service?.title || (
                                                <span className="badge bg-info">Consulta General</span>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Asunto */}
                    {dataLoaded?.subject && (
                        <div className="col-12">
                            <div className="bg-light p-3 rounded">
                                <h6 className="text-warning mb-2">
                                    <i className="mdi mdi-email-outline me-2"></i>
                                    Asunto
                                </h6>
                                <p className="mb-0">{dataLoaded.subject}</p>
                            </div>
                        </div>
                    )}

                    {/* Sección: Mensaje */}
                    <div className="col-12">
                        <div className="bg-light p-3 rounded">
                            <h6 className="text-info mb-2">
                                <i className="mdi mdi-message-text me-2"></i>
                                Mensaje
                            </h6>
                            <div className="p-2 bg-white rounded" style={{ whiteSpace: 'pre-line' }}>
                                {dataLoaded?.description}
                            </div>
                        </div>
                    </div>

                    {/* Sección: Metadata */}
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                            <span>
                                <i className="mdi mdi-clock-outline me-1"></i>
                                Recibido: {dataLoaded?.created_at ? new Date(dataLoaded.created_at).toLocaleString('es-PE') : '-'}
                            </span>
                            <span>
                                {dataLoaded?.seen ? (
                                    <span className="badge bg-success">
                                        <i className="mdi mdi-check-all me-1"></i>Leído
                                    </span>
                                ) : (
                                    <span className="badge bg-danger">
                                        <i className="mdi mdi-email-alert me-1"></i>No leído
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mensajes">
            <Messages {...properties} />
        </BaseAdminto>
    );
});

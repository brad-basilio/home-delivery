import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import QuillFormGroup from '@Adminto/form/QuillFormGroup';
import ImageFormGroup from '@Adminto/form/ImageFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AboutusRest from '../Actions/Admin/AboutusRest';
import Modal from '../Components/Modal';
import Table from '../Components/Table';
import DxButton from '../Components/dx/DxButton';
import InputFormGroup from '../Components/form/InputFormGroup';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';

const aboutusRest = new AboutusRest()

const About = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const correlativeRef = useRef()
  const nameRef = useRef()
  const titleRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    correlativeRef.current.value = data?.correlative ?? ''
    nameRef.current.value = data?.name ?? ''
    titleRef.current.value = data?.title ?? ''
    descriptionRef.editor.root.innerHTML = data?.description ?? ''
    imageRef.image.src = `/api/aboutus/media/${data?.image}`
    imageRef.current.value = null

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      correlative: correlativeRef.current.value,
      name: nameRef.current.value,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
    }

    const formData = new FormData()
    for (const key in request) {
      if (request[key] !== undefined && request[key] !== '') {
        formData.append(key, request[key])
      }
    }
    const file = imageRef.current.files[0]
    if (file) {
      formData.append('image', file)
    }

    const result = await aboutusRest.save(formData)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onStatusChange = async ({ id, status }) => {
    const result = await aboutusRest.status({ id, status })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await aboutusRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Nosotros' rest={aboutusRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        // container.unshift({
        //   widget: 'dxButton', location: 'after',
        //   options: {
        //     icon: 'plus',
        //     text: 'Nuevo about',
        //     hint: 'Nuevo about',
        //     onClick: () => onModalOpen()
        //   }
        // });
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'correlative',
          caption: 'Correlativo',
          visible: false
        },
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '80px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(
              container,
              <img
                src={`/api/aboutus/media/${data.image}`}
                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                style={{
                  width: '60px',
                  height: '40px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '4px',
                }}
              />
            );
          },
        },
        {
          dataField: 'name',
          caption: 'Nombre',
          width: '20%'
        },
        {
          dataField: 'title',
          caption: 'Título',
          width: '40%'
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          width: '10%',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.visible == 1} onChange={() => onVisibleChange({
              id: data.id,
              value: !data.visible
            })} />)
          }
        },
        // {
        //   dataField: 'status',
        //   caption: 'Estado',
        //   dataType: 'boolean',
        //   cellTemplate: (container, { data }) => {
        //     switch (data.status) {
        //       case 1:
        //         ReactAppend(container, <span className='badge bg-success rounded-pill'>Activo</span>)
        //         break
        //       case 0:
        //         ReactAppend(container, <span className='badge bg-danger rounded-pill'>Inactivo</span>)
        //         break
        //       default:
        //         ReactAppend(container, <span className='badge bg-dark rounded-pill'>Eliminado</span>)
        //         break
        //     }
        //   }
        // },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            // container.append(DxButton({
            //   className: 'btn btn-xs btn-soft-danger',
            //   title: 'Eliminar',
            //   icon: 'fa fa-trash',
            //   onClick: () => onDeleteClicked(data.id)
            // }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar Sección' : 'Agregar Sección'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='about-container'>
        <input ref={idRef} type='hidden' />
        <input ref={correlativeRef} type='hidden' />
        <InputFormGroup eRef={nameRef} label='Nombre' col='col-md-6' required />
        <InputFormGroup eRef={titleRef} label='Título' col='col-md-6' required />
        <ImageFormGroup 
          eRef={imageRef} 
          label='Imagen (Opcional)' 
          col='col-md-12'
          aspect={16/9}
          fit='cover'
        />
        <QuillFormGroup eRef={descriptionRef} label='Descripción' col='col-12' />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Nosotros'>
    <About {...properties} />
  </BaseAdminto>);
})
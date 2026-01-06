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
  const videoUrlRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [videoPreviewId, setVideoPreviewId] = useState('')

  // Extraer ID de YouTube de cualquier tipo de URL
  const extractYoutubeId = (url) => {
    if (!url) return '';
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    // Si ya es solo el ID (11 caracteres)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return '';
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    const videoId = extractYoutubeId(url);
    setVideoPreviewId(videoId);
  };

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
    videoUrlRef.current.value = data?.video_youtube_id ? `https://www.youtube.com/watch?v=${data.video_youtube_id}` : ''
    setVideoPreviewId(data?.video_youtube_id || '')

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
      video_youtube_id: extractYoutubeId(videoUrlRef.current.value),
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
          width: '100px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(
              container,
              <img
                src={`/api/aboutus/media/${data.image}`}
                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                style={{
                  width: '80px',
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
          dataField: 'video_youtube_id',
          caption: 'Video',
          width: '100px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            if (data.video_youtube_id) {
              ReactAppend(
                container,
                <a href={`https://www.youtube.com/watch?v=${data.video_youtube_id}`} target='_blank' rel='noopener noreferrer' className='d-flex align-items-center justify-content-center'>
                  <img
                    src={`https://img.youtube.com/vi/${data.video_youtube_id}/default.jpg`}
                    style={{
                      width: '80px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <i className='fab fa-youtube text-danger position-absolute' style={{ fontSize: '20px' }}></i>
                </a>
              );
            } else {
              ReactAppend(container, <span className='text-muted'>-</span>);
            }
          },
        },
        {
          dataField: 'name',
          caption: 'Nombre',
       
        },
        {
          dataField: 'title',
          caption: 'Título',
        
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
        
        {/* Datos principales */}
        <InputFormGroup eRef={nameRef} label='Nombre' col='col-md-6' required />
        <InputFormGroup eRef={titleRef} label='Título' col='col-md-6' required />
        
        {/* Medios: Imagen y Video */}
        <div className='col-md-6'>
          <ImageFormGroup 
            eRef={imageRef} 
            label='Imagen (Opcional)' 
            aspect={16/9}
            fit='cover'
          />
        </div>
        
        <div className='col-md-6'>
          <InputFormGroup 
            eRef={videoUrlRef} 
            label='Video YouTube URL (Opcional)' 
            placeholder='https://www.youtube.com/watch?v=... o short'
            onChange={handleVideoUrlChange}
          />
          {videoPreviewId && (
            <div className='mt-2'>
              <div className='ratio ratio-16x9'>
                <iframe
                  src={`https://www.youtube.com/embed/${videoPreviewId}`}
                  title='Vista previa YouTube'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              </div>
            </div>
          )}
          <small className='text-muted d-block mt-2'>
            <i className='fa fa-info-circle me-1'></i>
            Si agregas un video, se mostrará en lugar de la imagen.
          </small>
        </div>
        
        {/* Descripción */}
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
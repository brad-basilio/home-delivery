import React, { useEffect, useRef, useState } from "react"

const ImageFormGroup = ({ 
  id, 
  col, 
  label, 
  eRef, 
  required = false, 
  onChange = () => { }, 
  aspect = '21/9', 
  fit = 'cover', 
  onError = '/api/cover/thumbnail/null',
  overlayColor = null,
  showColorOverlay = false,
  className = ''
}) => {

  if (!id) id = `ck-${crypto.randomUUID()}`
  if (!eRef) eRef = useRef()

  const imageRef = useRef()
  const [currentOverlayColor, setCurrentOverlayColor] = useState(overlayColor)
  
  // Actualizar el color del overlay cuando cambia
  useEffect(() => {
    setCurrentOverlayColor(overlayColor);
  }, [overlayColor]);

  const onImageChange = async (e) => {
    const file = e.target.files[0]
    const url = await File.toURL(file)
    imageRef.current.src = url
    onChange(e)
  }

  useEffect(() => {
    eRef.image = imageRef.current
  }, [null])

  return <div className={`form-group ${col} mb-1`}>
    <label htmlFor={id} className="mb-1">
      {label} {required && <b className="text-danger">*</b>}
    </label>
    <label htmlFor={id} style={{width: '100%', position: 'relative'}}>
      <img 
        ref={imageRef} 
        className={`d-block bg-secondary ${className}`} 
        src="" 
        alt="aspect-video" 
        onError={e => e.target.src = onError} 
        style={{
          width: '100%',
          borderRadius: '4px',
          cursor: 'pointer',
          aspectRatio: aspect,
          objectFit: fit,
          objectPosition: 'center'
        }} 
      />
      
      {/* Color overlay */}
      {showColorOverlay && currentOverlayColor && currentOverlayColor !== 'transparent' && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: currentOverlayColor,
            opacity: 0.3,
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />
      )}
    </label>
    <input ref={eRef} id={id} type="file" src="" alt="" hidden accept="image/*" onChange={onImageChange} />
  </div>
}

export default ImageFormGroup
import { useEffect, useRef, useState } from 'react'
import reactDom from 'react-dom'
import { useClickAway, useKey } from 'react-use'

const modalRoot = document.getElementById('modal-root')

export default function Modal({
  children,
  isVisible,
  onClose,
  width = 500,
  height = 400,
}) {
  const modalRef = useRef(null)
  const [outer, setOuter] = useState()

  useEffect(() => {
    if (!isVisible) {
      setOuter(null)
      return
    }

    const newOuter = document.createElement('div')
    modalRoot.appendChild(newOuter)
    setOuter(newOuter)

    return () => {
      modalRoot.removeChild(newOuter)
    }
  }, [isVisible, width, height])

  useClickAway(modalRef, onClose)
  useKey('Escape', onClose)

  return outer
    ? reactDom.createPortal(
        <div
          ref={modalRef}
          className='modal'
          style={{ maxWidth: width, maxHeight: height }}
        >
          {children}
        </div>,
        outer
      )
    : null
}

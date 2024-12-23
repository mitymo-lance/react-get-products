import React, { createContext, useContext, useState } from 'react';
import Modal from './Modal';

const ModalContext = createContext();

export const ModalProvider = ({ size, children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('medium');
  
  const showModal = (size, content) => {
    console.log('===> showModal size: ' + size);
    setModalSize(size);
    console.log('=====> modalSize: ' + modalSize);
    setModalContent(content);
    setIsModalOpen(true);
  };
  
  const hideModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };
  
  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      { children }
      <Modal size={modalSize} isOpen={isModalOpen} onClose={hideModal}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext);
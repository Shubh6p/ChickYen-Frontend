import { createContext, useContext, useState, useCallback } from 'react';

const AdminModalContext = createContext();

export const useAdminModal = () => useContext(AdminModalContext);

export const AdminModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'confirm', // 'confirm' or 'alert'
    title: '',
    message: '',
    icon: '',
    confirmText: 'Proceed',
    cancelText: 'Back',
    onConfirm: null,
    onCancel: null,
    confirmColor: 'bg-orange-600',
  });

  const showConfirm = useCallback(({ title, message, icon = '❓', confirmText = 'Proceed', cancelText = 'Back', confirmColor = 'bg-orange-600', onConfirm }) => {
    setModalState({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      icon,
      confirmText,
      cancelText,
      onConfirm,
      onCancel: () => closeModal(),
      confirmColor,
    });
  }, []);

  const showAlert = useCallback(({ title, message, icon = 'ℹ️', confirmText = 'OK', confirmColor = 'bg-gray-900', onConfirm }) => {
    setModalState({
      isOpen: true,
      type: 'alert',
      title,
      message,
      icon,
      confirmText,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closeModal();
      },
      confirmColor,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = () => {
    if (modalState.onConfirm) modalState.onConfirm();
    if (modalState.type !== 'alert') closeModal(); // Don't auto-close if alert provided onConfirm that does it, actually let's auto-close.
    closeModal();
  };

  return (
    <AdminModalContext.Provider value={{ showConfirm, showAlert, closeModal }}>
      {children}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className={`bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl text-center border-b-8 animate-scale-up ${modalState.confirmColor === 'bg-red-600' ? 'border-red-600' : 'border-orange-600'}`}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl bg-orange-50">
                {modalState.icon}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{modalState.title}</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">{modalState.message}</p>
            
            <div className="flex gap-3">
              {modalState.type === 'confirm' && (
                <button 
                  onClick={modalState.onCancel}
                  className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition uppercase text-[10px] tracking-widest"
                >
                  {modalState.cancelText}
                </button>
              )}
              <button 
                onClick={handleConfirm}
                className={`flex-1 text-white font-black py-4 rounded-2xl shadow-lg transition uppercase text-[10px] tracking-widest ${modalState.confirmColor} hover:opacity-90`}
              >
                {modalState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminModalContext.Provider>
  );
};

interface ProcessingModalProps {
  onClose: () => void;
  progress: {
    current: number;
    total: number;
    status: 'idle' | 'processing' | 'completed' | 'error';
  };
}

export function ProcessingModal({  onClose, progress }: ProcessingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Procesando facturas</h2>
          <button
            onClick={onClose}
            disabled={progress.status === 'processing'}
          >
            ✕
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            disabled={progress.status === 'processing'}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
} 
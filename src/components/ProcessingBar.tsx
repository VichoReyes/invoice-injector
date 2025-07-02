interface ProcessingBarProps {
  selectedInvoiceIds: Set<string>;
  onProcessSelected: () => void;
}

export function ProcessingBar({ selectedInvoiceIds, onProcessSelected }: ProcessingBarProps) {
  const selectedCount = selectedInvoiceIds.size;
  
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center">
        <span className="hidden md:block text-sm text-gray-600">
          Has seleccionado {selectedCount} facturas
        </span>
        <button
          onClick={onProcessSelected}
          disabled={selectedCount === 0}
          className="bg-blue-200 text-gray-800 disabled:bg-gray-50"
        >
          Procesar facturas seleccionadas
        </button>
      </div>
    </div>
  );
} 
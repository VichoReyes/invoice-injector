import { Navbar, InvoiceTable, ProcessingBar, ProcessingModal, useInvoiceProcessing } from './components';
import { useState } from 'react';
import { useApi } from './hooks/useApi';

function App() {
  const [initialInvoices, setInjected] = useApi('/invoices');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState(new Set<string>());
  
  const {
    isProcessing,
    processingProgress,
    handleProcessSelected,
    handleCloseModal
  } = useInvoiceProcessing(setInjected);

  const handleInvoiceSelection = (invoiceId: string, isSelected: boolean) => {
    setSelectedInvoiceIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(invoiceId);
      } else {
        newSet.delete(invoiceId);
      }
      return newSet;
    });
  };

  const onProcessSelected = () => {
    handleProcessSelected(selectedInvoiceIds);
  };

  const onCloseModal = () => {
    handleCloseModal(() => setSelectedInvoiceIds(new Set()));
  };

  return (
    <>
      <div className="w-screen h-screen">
        <Navbar />
        
        <div className="p-6 space-y-4">
          <ProcessingBar 
            selectedInvoiceIds={selectedInvoiceIds}
            onProcessSelected={onProcessSelected}
          />
          
          <InvoiceTable 
            apiData={initialInvoices}
            selectedInvoiceIds={selectedInvoiceIds}
            onInvoiceSelection={handleInvoiceSelection}
          />
        </div>
      </div>

      {isProcessing && (
        <ProcessingModal
          onClose={onCloseModal}
          progress={processingProgress}
        />
      )}
    </>
  )
}

export default App;

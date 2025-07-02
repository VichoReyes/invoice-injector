import { Navbar, InvoiceTable, ProcessingBar, ProcessingModal } from './components';
import { useState } from 'react';

function App() {
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState(new Set<string>());
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({
    current: 0,
    total: 0,
    currentInvoiceId: undefined as string | undefined,
    status: 'idle' as 'idle' | 'processing' | 'completed' | 'error'
  });

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

  const processInvoices = async (invoiceIds: string[]) => {
    setIsProcessing(true);
    setProcessingProgress({
      current: 0,
      total: invoiceIds.length,
      currentInvoiceId: undefined,
      status: 'idle'
    });

    try {
      setProcessingProgress(prev => ({ ...prev, status: 'processing' }));

      for (let i = 0; i < invoiceIds.length; i++) {
        const invoiceId = invoiceIds[i];
        
        setProcessingProgress(prev => ({
          ...prev,
          current: i,
          currentInvoiceId: invoiceId
        }));

        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      }

      setProcessingProgress(prev => ({
        ...prev,
        current: invoiceIds.length,
        currentInvoiceId: undefined,
        status: 'completed'
      }));
    } catch (error) {
      console.error('Error processing invoices:', error);
      setProcessingProgress(prev => ({
        ...prev,
        status: 'error'
      }));
    }
  };

  const handleProcessSelected = () => {
    const invoiceIds = Array.from(selectedInvoiceIds);
    processInvoices(invoiceIds);
  };

  const handleCloseModal = () => {
    if (processingProgress.status !== 'processing') {
      setIsProcessing(false);
      setProcessingProgress({
        current: 0,
        total: 0,
        currentInvoiceId: undefined,
        status: 'idle'
      });
    }
  };

  return (
    <>
      <div className="w-screen h-screen">
        <Navbar />
        
        <div className="p-6 space-y-4">
          <ProcessingBar 
            selectedInvoiceIds={selectedInvoiceIds}
            onProcessSelected={handleProcessSelected}
          />
          
          <InvoiceTable 
            selectedInvoiceIds={selectedInvoiceIds}
            onInvoiceSelection={handleInvoiceSelection}
          />
        </div>
      </div>

      {isProcessing && (
        <ProcessingModal
          onClose={handleCloseModal}
          progress={processingProgress}
        />
      )}
    </>
  )
}

export default App;

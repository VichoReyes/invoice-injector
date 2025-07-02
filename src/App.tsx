import { Navbar, InvoiceTable } from './components';
import { useState } from 'react';

function ProcessingBar({ selectedInvoiceIds, onProcessSelected }: {
  selectedInvoiceIds: Set<string>;
  onProcessSelected: () => void;
}) {
  const selectedCount = selectedInvoiceIds.size;
  
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          There are {selectedCount} selected invoices
        </span>
        <button
          onClick={onProcessSelected}
          disabled={selectedCount === 0}
          className="bg-blue-200 text-gray-800 disabled:bg-gray-50"
        >
          Process Selected
        </button>
      </div>
    </div>
  );
}

function App() {
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState(new Set<string>());

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

  const handleProcessSelected = () => {
    // TODO: Implement processing logic
    console.log('Processing invoices:', Array.from(selectedInvoiceIds));
  };

  return (
    <>
      <div className="bg-slate-50 w-screen h-screen">
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
    </>
  )
}

export default App;

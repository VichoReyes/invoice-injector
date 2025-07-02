import { Navbar, InvoiceTable } from './components';
import { useState } from 'react';

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

  return (
    <>
      <div className="bg-slate-50 w-screen h-screen">
        <Navbar />
        
        <div className="p-6">
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

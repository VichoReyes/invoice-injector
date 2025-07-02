import { Navbar, InvoiceTable } from './components';

function App() {
  return (
    <>
      <div className="bg-slate-50 w-screen h-screen">
        <Navbar />
        
        <div className="p-6">
          <InvoiceTable />
        </div>
      </div>
    </>
  )
}

export default App;

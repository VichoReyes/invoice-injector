import { useApi } from './hooks/useApi';
import bemmboLogo from './assets/bemmbo-logo.svg';

function App() {
  return (
    <>
      {/* Build your page here */}
      <div className="bg-slate-50 w-screen h-screen">
        <div className="flex flex-col items-center justify-center gap-4">
          <img src={bemmboLogo} alt="Bemmbo Logo" className="w-1/2 h-1/2" />
          <h1 className="text-3xl font-bold text-blue-600">
            Prueba técnica Bemmbo
          </h1>
        </div>
        <InvoiceTable />
      </div>
    </>
  )
}

function InvoiceTable() {
  const { data, loading, error } = useApi('/invoices');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const invoices = data?.slice(0, 10);

  return (
    <>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Emisor</th>
            <th>Monto</th>
            <th>Moneda</th>
            <th>Inyectado</th>
          </tr>
        </thead>
        <tbody>
          {invoices?.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.receiverName}</td>
              <td>{invoice.amount}</td>
              <td>{invoice.currency}</td>
              <td>{invoice.injected ? 'Si' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;

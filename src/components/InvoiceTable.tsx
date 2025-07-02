import { useApi } from '../hooks/useApi';

export function InvoiceTable() {
  const { data, loading, error } = useApi('/invoices');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const invoices = data?.slice(0, 10);

  const headerClass = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tdClass = "px-6 py-4 whitespace-nowrap";

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerClass} w-12`}>
              </th>
              <th className={headerClass}>
                Emisor
              </th>
              <th className={headerClass}>
                Monto
              </th>
              <th className={headerClass}>
                Moneda
              </th>
              <th className={headerClass}>
                Inyectado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices?.map((invoice, index) => (
              <tr key={invoice.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className={`${tdClass}`}>
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                  />
                </td>
                <td className={`${tdClass} text-sm font-medium text-gray-900`}>
                  {invoice.receiverName}
                </td>
                <td className={`${tdClass} text-sm text-gray-900 font-semibold`}>
                  {invoice.amount.toLocaleString()}
                </td>
                <td className={`${tdClass} text-sm text-gray-500 uppercase`}>
                  {invoice.currency}
                </td>
                <td className={`${tdClass}`}>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    invoice.injected 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {invoice.injected ? 'Sí' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 
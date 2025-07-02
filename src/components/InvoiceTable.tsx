import { useApi } from '../hooks/useApi';
import { useState } from 'react';

function Button({ onClick, disabled, children }: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center p-1 m-1 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export function InvoiceTable() {
  const { data, loading, error } = useApi('/invoices');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const invoices = data?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const headerClass = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tdClass = "px-6 py-4 whitespace-nowrap";

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
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

      {/* Pagination Controls */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        {/* Mobile Controls */}
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">{startIndex + 1}</span>
              {' '}a{' '}
              <span className="font-medium">{Math.min(endIndex, totalItems)}</span>
              {' '}de{' '}
              <span className="font-medium">{totalItems}</span>
              {' '}facturas
            </p>
          </div>
          <div>
            <nav className="inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
              
              {getPageNumbers().map((page, index) => (
                <span key={index}>
                  {page === '...' ? (
                    <span className="inline-flex items-center p-1 m-1 text-gray-700">
                      ...
                    </span>
                  ) : (
                    <Button
                      onClick={currentPage === page ? undefined : () => handlePageChange(page as number)}
                      disabled={currentPage === page}
                    >
                      {page}
                    </Button>
                  )}
                </span>
              ))}
              
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Siguiente</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
} 
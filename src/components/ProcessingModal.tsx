import { useState } from "react";
import { processInvoiceBatch } from "../hooks/useApi";

type BatchStatus =
  | "not started"
  | "in progress"
  | "retrying"
  | "successfully processed";

function showBatchStatus(status: BatchStatus): string {
  switch (status) {
    case "not started":
      return "No iniciado";
    case "in progress":
      return "En progreso";
    case "retrying":
      return "Reintentando";
    case "successfully processed":
      return "Procesado exitosamente";
  }
}

interface BatchInfo {
  id: number;
  invoiceIds: string[];
  status: BatchStatus;
}

interface ProcessingProgress {
  batches: BatchInfo[];
  totalInvoices: number;
  processedInvoices: number;
  overallStatus: "idle" | "processing" | "completed" | "error";
}

export function useInvoiceProcessing(
  setInjected: (invoiceIds: string[]) => void,
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] =
    useState<ProcessingProgress>({
      batches: [],
      totalInvoices: 0,
      processedInvoices: 0,
      overallStatus: "idle",
    });

  const createBatches = (invoiceIds: string[]): BatchInfo[] => {
    const BATCH_SIZE = 25;
    const batches: BatchInfo[] = [];

    for (let i = 0; i < invoiceIds.length; i += BATCH_SIZE) {
      const batchInvoiceIds = invoiceIds.slice(i, i + BATCH_SIZE);
      batches.push({
        id: batches.length + 1,
        invoiceIds: batchInvoiceIds,
        status: "not started",
      });
    }

    return batches;
  };

  const processBatch = async (batch: BatchInfo): Promise<boolean> => {
    try {
      setProcessingProgress((prev) => ({
        ...prev,
        batches: prev.batches.map((b) =>
          b.id === batch.id ? { ...b, status: "in progress" } : b,
        ),
      }));

      for (let i = 0; i < 5; i++) {
        // retry for server errors
        const result = await processInvoiceBatch(batch.invoiceIds);
        if (result !== "server_error") {
          break;
        }
        setProcessingProgress((prev) => ({
          ...prev,
          batches: prev.batches.map((b) =>
            b.id === batch.id ? { ...b, status: "retrying" } : b,
          ),
        }));
        // TODO: switch to exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setProcessingProgress((prev) => ({
        ...prev,
        batches: prev.batches.map((b) =>
          b.id === batch.id ? { ...b, status: "successfully processed" } : b,
        ),
        processedInvoices: prev.processedInvoices + batch.invoiceIds.length,
      }));
      setInjected(batch.invoiceIds);

      return true;
    } catch (error) {
      return false;
    }
  };

  const processInvoices = async (invoiceIds: string[]) => {
    setIsProcessing(true);

    const batches = createBatches(invoiceIds);

    setProcessingProgress({
      batches,
      totalInvoices: invoiceIds.length,
      processedInvoices: 0,
      overallStatus: "processing",
    });

    try {
      for (const batch of batches) {
        const success = await processBatch(batch);
        if (!success) {
          throw new Error(`Failed to process batch ${batch.id}`);
        }
      }

      setProcessingProgress((prev) => ({
        ...prev,
        overallStatus: "completed",
      }));
    } catch (error) {
      console.error("Error processing invoices:", error);
      setProcessingProgress((prev) => ({
        ...prev,
        overallStatus: "error",
      }));
    }
  };

  const handleProcessSelected = (selectedInvoiceIds: Set<string>) => {
    const invoiceIds = Array.from(selectedInvoiceIds);
    processInvoices(invoiceIds);
  };

  const handleCloseModal = (onInvoicesCleared?: () => void) => {
    if (processingProgress.overallStatus !== "processing") {
      setIsProcessing(false);
      setProcessingProgress({
        batches: [],
        totalInvoices: 0,
        processedInvoices: 0,
        overallStatus: "idle",
      });
      onInvoicesCleared?.();
    }
  };

  return {
    isProcessing,
    processingProgress,
    handleProcessSelected,
    handleCloseModal,
  };
}

interface ProcessingModalProps {
  onClose: () => void;
  progress: {
    batches: BatchInfo[];
    totalInvoices: number;
    processedInvoices: number;
    overallStatus: "idle" | "processing" | "completed" | "error";
  };
}

export function ProcessingModal({ onClose, progress }: ProcessingModalProps) {
  const remainingInvoices = progress.totalInvoices - progress.processedInvoices;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Procesando facturas</h2>
          <button
            onClick={onClose}
            disabled={progress.overallStatus === "processing"}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{progress.processedInvoices} procesadas</span>
            <span>{remainingInvoices} restantes</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {progress.batches.map((batch) => (
            <div
              key={batch.id}
              className="flex justify-between items-center text-sm"
            >
              <span>
                Lote {batch.id} ({batch.invoiceIds.length} facturas)
              </span>
              <span
                className={`${
                  batch.status === "successfully processed"
                    ? "text-green-600"
                    : batch.status === "in progress"
                      ? "text-blue-600"
                      : "text-gray-500"
                }`}
              >
                {showBatchStatus(batch.status)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            disabled={progress.overallStatus === "processing"}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {progress.overallStatus === "processing"
              ? "Procesando..."
              : "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

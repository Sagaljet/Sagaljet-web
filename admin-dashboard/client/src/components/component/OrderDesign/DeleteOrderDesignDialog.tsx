// src/components/OrderDesign/DeleteOrderDesignDialog.tsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import type { AppDispatch, RootState } from "@/redux/store";
import type { OrderDesign } from "@/redux/types/orderDesign";
import {
  deleteOrderDesignFn,
  resetDeleteOrderDesign,
} from "@/redux/slices/orderDesign/deleteOrderDesign";

interface DeleteOrderDesignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: OrderDesign | null;
  onSuccess: () => void;
}

const DeleteOrderDesignDialog: React.FC<DeleteOrderDesignDialogProps> = ({
  isOpen,
  onClose,
  data,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.deleteOrderDesign
  );

  // Handle success/error
  useEffect(() => {
    if (isSuccess) {
      toast.success(message || "Order design deleted successfully");
      dispatch(resetDeleteOrderDesign());
      onClose();
      onSuccess();
    }
    if (isError) {
      toast.error(message);
      dispatch(resetDeleteOrderDesign());
    }
  }, [isSuccess, isError, message, dispatch, onSuccess, onClose]);

  const handleConfirmDelete = () => {
    if (data) {
      dispatch(deleteOrderDesignFn(data.id));
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Order Design
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this order design?
          </p>
          {/* Item Details */}
          <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">

              {data.images ? (
                <img
                  src={data.images[0]}
                  alt={data.title}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{data.title}</p>
                <p className="text-sm text-gray-500">ID: {data.id}</p>
                <p className="text-sm font-semibold text-green-600">
                  ${data.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <p className="text-sm text-red-500 mb-6">
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderDesignDialog;
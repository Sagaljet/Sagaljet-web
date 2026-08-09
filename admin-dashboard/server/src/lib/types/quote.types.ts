// lib/types/quote.types.ts

export interface PrintingQuote {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string | null;
  printType: string;
  paperType?: string | null;
  size: string;
  customWidth?: number | null;
  customHeight?: number | null;
  quantity: number;
  colors: string;
  finishType?: string | null;
  binding?: string | null;
  urgent: boolean;
  description?: string | null;
  fileUrl?: string | null;
  notes?: string | null;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export enum QuoteStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  QUOTED = "QUOTED",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CreateQuoteRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  printType: string;
  paperType?: string;
  size: string;
  customWidth?: number;
  customHeight?: number;
  quantity: number;
  colors: string;
  finishType?: string;
  binding?: string;
  urgent?: boolean;
  description?: string;
  fileUrl?: string;
  notes?: string;
}

export interface UpdateQuoteRequest {
  estimatedPrice?: number;
  finalPrice?: number;
  status?: QuoteStatus;
  notes?: string;
}
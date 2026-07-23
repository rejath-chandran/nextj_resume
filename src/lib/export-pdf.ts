/**
 * PDF Export Utility — @react-pdf/renderer strategy
 *
 * Uses the same approach as rejath-chandran/resume-builder-react:
 * Builds the PDF entirely with @react-pdf/renderer primitives,
 * producing a real vector-text PDF (ATS-friendly, selectable, searchable).
 */

import { pdf } from "@react-pdf/renderer";
import React from "react";
import ResumePdfDocument, {
  type ResumePdfProps,
} from "@/components/builder/ResumePdfDocument";

export interface ExportPdfOptions {
  /** Resume data props */
  data: ResumePdfProps;
  /** Filename for the downloaded PDF (without .pdf extension) */
  filename?: string;
}

/**
 * Generates and downloads a PDF resume instantly.
 * Uses @react-pdf/renderer to create real text PDFs (ATS-friendly).
 */
export async function exportResumePdf({
  data,
  filename = "Resume",
}: ExportPdfOptions): Promise<void> {
  // Build the PDF document blob using react-pdf renderer
  const docElement = React.createElement(ResumePdfDocument, data);
  const instance = pdf(docElement as any);
  const blob = await instance.toBlob();

  // Create a download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

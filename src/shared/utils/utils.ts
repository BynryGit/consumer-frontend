export const downloadFile = (blob: Blob, filename = "template.pdf") => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const openPdfInNewTab = (blob: Blob) => {
  const fileURL = window.URL.createObjectURL(blob);
  window.open(fileURL, "_blank", "fullscreen=yes");
};

export const printPDFBlob = (blob: Blob, timeout = 1000) => {
  const blobUrl = URL.createObjectURL(blob);
  const printWindow = window.open(blobUrl, "_blank");

  const printTimeout = setTimeout(() => {
    if (printWindow) {
      printWindow.print();
      URL.revokeObjectURL(blobUrl);
    }
  }, timeout);

  if (!printWindow) {
    alert("Please allow popups for printing");
    URL.revokeObjectURL(blobUrl);
  }
};

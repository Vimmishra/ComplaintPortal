// QRScannerWithOverlay.jsx
import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const QRScannerWithOverlay = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    // Get available cameras
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length === 0) {
          alert("No camera found");
          return;
        }

        // Use the first camera
        selectedDeviceId = videoInputDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              console.log("QR Code detected:", result.getText());
              window.location.href = result.getText(); // redirect
              codeReader.reset(); // stop scanning
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          }
        );
      })
      .catch((err) => console.error(err));

    return () => codeReader.reset(); // cleanup on unmount
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto mt-10">
      {/* Camera video */}
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        style={{ objectFit: "cover" }}
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
        <div className="border-4 border-blue-500 w-64 h-64 rounded-md"></div>
      </div>

      {/* Instructions */}
      <p className="text-center mt-4 text-gray-700">
        Align QR code inside the square to scan and register Complaint
      </p>
    </div>
  );
};

export default QRScannerWithOverlay;

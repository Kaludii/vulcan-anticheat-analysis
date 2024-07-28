import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload, fileType, uploadedFile, onRemoveFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (uploadedFile) {
    return (
      <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <p className="text-sm text-gray-600">Uploaded file: {uploadedFile}</p>
        <button
          onClick={onRemoveFile}
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Remove File
        </button>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors duration-200">
      <div className="space-y-1 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex text-sm text-gray-600">
          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
            <span>Upload {fileType} file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          {fileType === 'punishments' ? 'punishments.txt' : 'violations.txt'} file only
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
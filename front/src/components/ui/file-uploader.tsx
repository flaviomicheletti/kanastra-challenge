import React from 'react';
import axios from 'axios';
import { useFileContext, FileActionType } from './file';

const URL = "http://localhost:8000";

export const uploadFile = async (file: File, state: any, dispatch: any) => {
  dispatch({ type: FileActionType.SET_LOADING, payload: { isLoading: true } });
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(URL + '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const newFileList = [...state.fileList, response.data.file];
    dispatch({ type: FileActionType.SET_FILE_LIST, payload: { fileList: newFileList } });
    dispatch({ type: FileActionType.SET_ERRORS, payload: { errors: [] } });
    alert('File uploaded successfully!');
  } catch (error) {
    if (error instanceof Error) {
      dispatch({ type: FileActionType.SET_ERRORS, payload: { errors: [error.message] } });
    } else {
      dispatch({ type: FileActionType.SET_ERRORS, payload: { errors: ['An unknown error occurred'] } });
    }
  } finally {
    dispatch({ type: FileActionType.SET_LOADING, payload: { isLoading: false } });
  }
};

const FileUploader = () => {
  const { state, dispatch } = useFileContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    dispatch({ type: FileActionType.SET_FILE, payload: { file } });
  };

  const handleUpload = () => {
    if (state.file) {
      uploadFile(state.file, state, dispatch);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="file" className="sr-only">Choose a file</label>
        <input id="file" type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      {state.file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {state.file.name}</li>
            <li>Type: {state.file.type}</li>
            <li>Size: {state.file.size} bytes</li>
          </ul>
        </section>
      )}
      {state.errors && state.errors.length > 0 && (
        <div className="text-red-500">
          {state.errors.map((error, index) => <p key={index}>{error}</p>)}
        </div>
      )}
      {state.file && (
        <button
          onClick={handleUpload}
          className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold"
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Uploading...' : 'Upload the file'}
        </button>
      )}
    </div>
  );
};

export { FileUploader };

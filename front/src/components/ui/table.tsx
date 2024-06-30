import { useEffect } from 'react';
import axios from 'axios';
import { useFileContext, FileActionType } from './file';

const URL = "http://localhost:8000";

export const fetchFiles = async (dispatch: any) => {
  dispatch({ type: FileActionType.SET_LOADING, payload: { isLoading: true } });
  try {
    const response = await axios.get(URL + '/files');
    const files = response.data.files.map((file: string) => ({
      name: file,
      status: 'Uploaded', // Ajustar conforme a resposta do back-end
    }));
    dispatch({ type: FileActionType.SET_FILE_LIST, payload: { fileList: files } });
  } catch (error) {
    dispatch({ type: FileActionType.SET_ERRORS, payload: { errors: [error.message] } });
  } finally {
    dispatch({ type: FileActionType.SET_LOADING, payload: { isLoading: false } });
  }
};

const FileTable = () => {
  const { state, dispatch } = useFileContext();

  useEffect(() => {
    fetchFiles(dispatch);
  }, [dispatch]);

  return (
    <table className="w-full caption-bottom text-sm">
      <thead className="[&_tr]:border-b">
        <tr>
          <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">File Name</th>
          <th className="h-12 px-4 text-left align-middle font-medium text-slate-500">Status</th>
        </tr>
      </thead>
      <tbody className="[&_tr:last-child]:border-0">
        {state.fileList.map((file, index) => (
          <tr key={index} className="border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
            <td className="p-4 align-middle">{file.name}</td>
            <td className="p-4 align-middle">{file.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { FileTable };

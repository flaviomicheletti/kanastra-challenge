import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FileProvider } from './components/ui/file';
import { Layout, NoMatch, FileUploader, FileTable } from './components/ui';

const App = () => {
  // console.log("App Component Rendered");

  return (
    <FileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<FileUploader />} />
            <Route path="files" element={<FileTable />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FileProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

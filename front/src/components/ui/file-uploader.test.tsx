import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileProvider } from './file';
import { FileUploader } from './file-uploader';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FileUploader', () => {
  it('renders correctly', () => {
    render(
      <FileProvider>
        <FileUploader />
      </FileProvider>
    );
    expect(screen.getByLabelText(/choose a file/i)).toBeInTheDocument();
  });

  it('uploads file successfully', async () => {
    const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });

    mockedAxios.post.mockResolvedValue({ data: { file: 'example.csv' } });

    render(
      <FileProvider>
        <FileUploader />
      </FileProvider>
    );

    const input = screen.getByLabelText(/choose a file/i);
    fireEvent.change(input, { target: { files: [file] } });

    const button = screen.getByText(/upload the file/i);
    fireEvent.click(button);

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledWith(expect.stringContaining('/upload'), expect.any(FormData), expect.any(Object));
    expect(window.alert).toHaveBeenCalledWith('File uploaded successfully!');
  });

  it('handles upload error', async () => {
    const file = new File(['dummy content'], 'example.csv', { type: 'text/csv' });

    mockedAxios.post.mockRejectedValue(new Error('Upload failed'));

    render(
      <FileProvider>
        <FileUploader />
      </FileProvider>
    );

    const input = screen.getByLabelText(/choose a file/i);
    fireEvent.change(input, { target: { files: [file] } });

    const button = screen.getByText(/upload the file/i);
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText(/upload failed/i)).toBeInTheDocument());
  });
});

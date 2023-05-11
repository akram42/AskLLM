import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace this with the appropriate API URL
});

interface ModelParams {
  model_name: string;
  api_key: string;
}

interface SelectModelResponse {
  result: string;
}

interface UploadPdfResponse {
  result: string;
}

interface ProcessResponse {
  result: string;
}

export const selectModel = async (modelParams: ModelParams): Promise<SelectModelResponse> => {
  const response: AxiosResponse<SelectModelResponse> = await apiClient.post('/select_model', modelParams);
  return response.data;
};

export const uploadPdf = async (file: File): Promise<UploadPdfResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response: AxiosResponse<UploadPdfResponse> = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const process = async (): Promise<ProcessResponse> => {
  const response: AxiosResponse<ProcessResponse> = await apiClient.get('/process');
  return response.data;
};

export async function getSources(question: string): Promise<string[]> {
  const response = await apiClient.get('/get_sources', { params: { question } });
  return response.data.sources;
}

export async function getAnswer(
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch(`http://localhost:8000/get_answer`);

  if (!response.ok) {
    throw new Error(`Error fetching answer: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (reader) {
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const decodedValue = decoder.decode(value);
      onChunk(decodedValue);
    }
  }
}


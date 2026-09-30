import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const parseResumePdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/api/v1/candidates/parse-resume`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const triggerScrapers = async (keyword) => {
  const response = await axios.post(`${API_BASE_URL}/api/v1/jobs/scrape`, { keyword });
  return response.data;
};

export const getAnalyticsOverview = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/analytics/overview`);
  return response.data;
};
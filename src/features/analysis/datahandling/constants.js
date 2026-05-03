import { getStoredUser } from "../../../services/authStorage";

export const getPatientId = () => getStoredUser()?.id;

export const BASE_URL = 'https://storage-service-yxqy.onrender.com';
export const SCAN_TYPES = ['1D', '2D', '3D'];

export const TYPE_ROUTE_MAP = {
  '1D': '/analysis/1Danalysis',
  '2D': '/analysis/2Danalysis',
  '3D': '/analysis/3Danalysis',
};

export const TYPE_LABEL_MAP = {
  '1D': '1D Scan',
  '2D': '2D Scan',
  '3D': '3D Scan',
};
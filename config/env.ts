import dotenv from 'dotenv';
dotenv.config();

/**
 * Cấu hình theo môi trường — chuyển bằng biến TEST_ENV (local | staging).
 *   TEST_ENV=staging npm run e2e
 * Token & URL đọc từ .env (không commit). Mỗi env có thông số hợp đồng riêng
 * (ngân hàng / ngành nghề) vì masterdata khác nhau.
 */
export type EnvName = 'local' | 'staging';
export const TEST_ENV: EnvName = (process.env.TEST_ENV as EnvName) || 'local';

interface EnvConfig {
  baseURL: string;
  token: string;
  contract: { bank: string; profession: string; signingMethod: string };
}

const MAP: Record<EnvName, EnvConfig> = {
  local: {
    baseURL: process.env.BASE_URL_LOCAL || 'http://192.168.1.4:5174',
    token: process.env.CMS_TOKEN_LOCAL || process.env.CMS_TOKEN || '',
    // masterdata local
    contract: { bank: 'KEB Hana', profession: 'TH06 - CMS- 171', signingMethod: 'Ký tay' },
  },
  staging: {
    baseURL: process.env.BASE_URL_STAGING || 'https://stg-cmspos.gtelpay.vn:8443',
    token: process.env.CMS_TOKEN_STAGING || '',
    // masterdata staging (đại lý Thuý cấp 6 có cấu hình phí cho MAFC + ngành Thuý 8)
    contract: { bank: 'MAFC', profession: 'Thuý 8', signingMethod: 'Ký tay' },
  },
};

export const ENV = MAP[TEST_ENV];
export const BASE_URL = ENV.baseURL;
export const CMS_TOKEN = ENV.token;
export const CONTRACT = ENV.contract;

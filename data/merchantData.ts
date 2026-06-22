import path from 'path';

/**
 * Dữ liệu test cho 1 merchant (đủ dùng cho cả 3 bước: tạo MC → thẩm định → ký HĐ).
 */
export interface MerchantData {
  code: string;        // mã định danh nội bộ của lần tạo (runId + index) — dùng cho tên file hồ sơ
  index: number;       // số thứ tự trong batch (1..N)
  name: string;
  shortName: string;
  gpkd: string;
  taxCode: string;
  phone: string;
  email: string;
  addr: string;
  repName: string;     // người đại diện
  repPhone: string;
  repEmail: string;
  cccd: string;
  seri: string;        // số seri POS
  account: string;     // số tài khoản nhận tiền
  terminalEmail: string;
}

/** Đường dẫn file ảnh giả dùng để upload hồ sơ. */
export const PNG = path.join(__dirname, '..', 'fixtures', 'dummy.png');

/**
 * Sinh data cho 1 merchant.
 * @param runId 7 số cuối timestamp (đảm bảo không trùng giữa các lần chạy)
 * @param i     số thứ tự trong batch
 */
export function buildMerchant(runId: string, i: number): MerchantData {
  const u = `${runId}${i}`;
  return {
    code: u,
    index: i,
    name: `CTY QC AUTO ${runId}-${i}`,
    shortName: `QC${u}`.slice(0, 20),
    gpkd: `9${u}001`,
    taxCode: `9${u}002`,
    phone: `09${u}`.slice(0, 10).padEnd(10, '0'),
    email: `qc.${u}.m@example.com`,
    addr: `${i} Duong QC Test`,
    repName: `NGUYEN VAN ${i}`,
    repPhone: `08${u}`.slice(0, 10).padEnd(10, '0'),
    repEmail: `qc.${u}.r@example.com`,
    cccd: `0${u}`.padEnd(12, '0').slice(0, 12),
    seri: `7${u}55`,
    account: `1${u}88`,
    terminalEmail: `qc.${u}.t@example.com`,
  };
}

/**
 * Sinh 1 batch merchant. runId lấy 7 số cuối timestamp → mỗi lần chạy ra bộ dữ liệu mới.
 */
export function buildMerchants(count: number): MerchantData[] {
  const runId = Date.now().toString().slice(-7);
  return Array.from({ length: count }, (_, k) => buildMerchant(runId, k + 1));
}

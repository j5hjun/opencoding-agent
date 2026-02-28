import { invalidatePackage } from './src/hooks/auto-update/cache';
const result = invalidatePackage();
console.log('캐시 삭제 결과:', result);
if (result) {
  const fs = require('node:fs');
  const path = require('node:path');
  const pkgDir = '/Users/johjun/.cache/opencode/node_modules/opencoding-agent';
  if (!fs.existsSync(pkgDir)) {
    console.log('검증 성공: 캐시 디렉토리가 물리적으로 삭제되었습니다.');
  } else {
    console.log('검증 실패: 디렉토리가 여전히 존재합니다.');
  }
}

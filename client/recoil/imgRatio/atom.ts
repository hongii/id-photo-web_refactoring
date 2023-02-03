import { atom } from 'recoil';

const imgRatioState = atom<{ width: number; height: number }>({
  key: `imgRatioState_${Date.now()}`,
  default: { width: 600, height: 800 },
});

export default imgRatioState;

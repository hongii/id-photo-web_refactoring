import { atom } from 'recoil';

const faceImageState = atom<File | Blob | null>({
  key: `faceImageState_${Date.now()}`,
  default: null,
});

export default faceImageState;

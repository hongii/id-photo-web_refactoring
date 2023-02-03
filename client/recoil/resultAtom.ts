import { atom } from 'recoil';

const resultAtom = atom<File | Blob | null>({
  key: `resultAtom_${Date.now()}`,
  default: null,
});

export default resultAtom;

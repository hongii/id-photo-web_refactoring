import { atom } from 'recoil';

const removeBgResultAtom = atom<string>({
  key: `removeBgResultAtom_${Date.now()}`,
  default: '',
});

export default removeBgResultAtom;

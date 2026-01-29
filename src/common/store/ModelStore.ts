import { atom, useSetAtom, useAtomValue } from 'jotai';
import { type ModalPayloads } from '../type';

const isOpenAtom = atom(false);
const typeAtom = atom<keyof ModalPayloads | null>(null);
const dataAtom = atom<ModalPayloads[keyof ModalPayloads] | null>(null);

export const useModal = () => {
  const isOpen = useAtomValue(isOpenAtom);
  const type = useAtomValue(typeAtom);
  const data = useAtomValue(dataAtom);

  const setIsOpen = useSetAtom(isOpenAtom);
  const setType = useSetAtom(typeAtom);
  const setData = useSetAtom(dataAtom);

  const openModal = <K extends keyof ModalPayloads>(
    modalType: K,
    modalData: ModalPayloads[K],
  ): void => {
    setIsOpen(true);
    setType(modalType);
    setData(modalData);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType(null);
    setData(null);
  };

  return { isOpen, type, data, openModal, closeModal };
};

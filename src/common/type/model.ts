import { type MODAL_TYPE } from '../constants';

type FolderPayload = {
  id: string;
  name: string;
};

type ConfirmDeletePayload = {
  id: string;
  title: string;
  onConfirm: () => void;
};

export type ModalPayloads = {
  [MODAL_TYPE.CREATE_FOLDER]: null;
  [MODAL_TYPE.EDIT_FOLDER]: FolderPayload;
  [MODAL_TYPE.CONFIRM_DELETE_FOLDER]: ConfirmDeletePayload;
  [MODAL_TYPE.CONFIRM_DELETE_STUDY_SET]: null;
  [MODAL_TYPE.REVIEW_COMPLETE]: null;
  [MODAL_TYPE.REVIEW_QUIZ_COMPLETE]: null;
};

import { MODAL_TYPE } from "@/common/constants";
import { useModal } from "@/common/store/ModelStore";

const ModalRoot = () => {
    const { isOpen, type } = useModal();

    if (!isOpen) { return null; }

    switch (type) {
        //trả về component tương ứng với từng modal type
        case MODAL_TYPE.CREATE_FOLDER: {
            return <></>;
        }
        case MODAL_TYPE.EDIT_FOLDER: {
            return <></>;
        }
        case MODAL_TYPE.CONFIRM_DELETE_FOLDER: {
            return <></>;
        }

        default: {
            return null;
        }
    }
};

export default ModalRoot;

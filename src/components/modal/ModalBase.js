import Portal from "./Portal";
import { CSSTransition } from "react-transition-group";

const ModalBase = ({ visible, children, onClose, ...props }) => {
  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames="zoom" unmountOnExit>
        {(status) => (
          <Portal
            visible={visible !== "exited"}
            onClose={onClose}
            // containerStyle={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            // }}
            containerClassName="flex justify-center items-center"
            {...props}
          >
            {children}
          </Portal>
        )}
      </CSSTransition>
    </>
  );
};

export default ModalBase;

import "./Modal.scss";

export default function Modal(props: props) {
  return (
    <>
      {!props.isVisible ? null : (
        <div className="modal" >
          <div className="modal-container">
            <div className="modal-header">
              <span className="close" onClick={() => props.closePopup()}>
                &times;
              </span>
            </div>
            <div className="modal-content">{props.children}</div>
          </div>
          <div className="modal-overlay" onClick={() => props.closePopup()}></div>
        </div>
      )}
    </>
  );
}

interface props {
  children?: React.ReactNode;
  isVisible: boolean;
  closePopup: any;
}

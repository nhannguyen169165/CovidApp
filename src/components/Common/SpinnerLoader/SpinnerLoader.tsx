import "./SpinnerLoader.scss";

export default function SpinnerLoader(props:props) {
  return (
    <>
      {props.isLoading ? (
        <div className="loading-container">
          <div className="fa-3x icon-loading">
            <i className="fas fa-spinner fa-pulse"></i>
          </div>
        </div>
      ) : null}
    </>
  );
}

interface props{
    isLoading:boolean
}

export default function Layout(props: layoutProps) {
    return (
      <>
        <div className="box-content">
          <div className="container main-content layout-body" id="main-content">
                <div className="">{props.children}</div>
              </div>
        </div>
      </>
    );
  }
  
  interface layoutProps {
    children?: React.ReactNode;
  }
export default function Card(props: Props) {
  return <div className="card">{props.children}</div>;
}

interface Props {
  children?: React.ReactNode;
}

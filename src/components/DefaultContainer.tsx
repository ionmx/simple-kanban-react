interface DefaultContainerProps {
  title: string | undefined;
  description: string | undefined;
  children?: JSX.Element | JSX.Element[];
};

const DefaultContainer = (props: DefaultContainerProps) => {
  return (
    <div className="container mx-auto mt-4">
      <h1 className="font-bold text-3xl mb-2">{props.title}</h1>
      { props.description !== ""? <p className="text-sm text-gray-400">{props.description}</p> : <></> }
      {props.children}
    </div>
  )
}

export default DefaultContainer;
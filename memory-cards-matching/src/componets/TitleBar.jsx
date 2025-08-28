function TitleBar(props) {
  return (
    <p className="text-3xl font-bold text-blue-900 capitalize text-center mt-2 mb-4">
      {props.title}
    </p>
  );
}

export default TitleBar;

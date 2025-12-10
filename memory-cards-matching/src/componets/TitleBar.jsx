function TitleBar(props) {
  return (
    <div className="text-center mb-4 animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-2xl flex items-center justify-center gap-3 animate-bounce">
        <p className="animate-spin-slow">🌟</p>
        {props.title}
        <p className="animate-spin-slow">🌟</p>
      </h1>
      <p className="text-white text-md opacity-90">{props.content}</p>
    </div>
  );
}

export default TitleBar;

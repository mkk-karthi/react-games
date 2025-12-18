function TitleBar(props) {
  return (
    <div className="text-center mb-2 animate-fade-in">
      <h1 className="flex flex-row justify-center font-bold text-white mb-2 drop-shadow-2xl gap-3 animate-bounce">
        <span className="text-3xl sm:text-4xl animate-spin-slow my-auto">🌟</span>
        <span className="text-4xl sm:text-5xl align-sub">{props.title}</span>
        <span className="text-3xl sm:text-4xl animate-spin-slow my-auto">🌟</span>
      </h1>
      <p className="text-white text-md opacity-90">{props.content}</p>
    </div>
  );
}

export default TitleBar;

const Button = (props) => {
  return (
    <button
      onClick={props.handleClick}
      className={`rounded-4xl inline-flex group items-center justify-center p-3 cursor-pointer border-b-4 border-l-2 active:border-green-600 active:shadow-none shadow-lg bg-gradient-to-tr from-green-600 to-green-500 border-green-700 text-white ${props.className}`}
    >
      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white group-hover:w-full group-hover:h-full opacity-10 rounded-4xl"></span>
      {props.children}
    </button>
  );
};
export default Button;

function Button({ children, clickHandle }) {
  return (
    <>
      <button
        onClick={clickHandle}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#00ffff] to-[#ff00ff] group-hover:from-[#00ffff] group-hover:to-[#ff00ff] hover:text-white dark:text-white focus:outline-none shadow-[0px_10px_10px_#000] active:shadow-none m-2"
      >
        <span className="relative p-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
          {children}
        </span>
      </button>
    </>
  );
}

export default Button;

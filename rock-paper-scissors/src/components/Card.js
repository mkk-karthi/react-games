function Card({ children, width }) {
  return (
    <>
        <div
          className={
            (width ? `min-w-[${width}] ` : "") +
            "m-2 bg-white p-2 rounded-lg shadow-xl dark:bg-gray-900"
          }
        >
          <div className="w-full inline-flex bg-gradient-to-br from-[#00ffff] to-[#ff00ff] rounded-lg p-0.5">
            <div className="w-full text-xl font-bold text-gray-900 dark:text-white capitalize text-center bg-white dark:bg-gray-900 p-5 rounded-lg">
              {children}
            </div>
          </div>
        </div>
    </>
  );
}

export default Card;

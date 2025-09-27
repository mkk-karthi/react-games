function SideBar(props) {
  return (
    <div className="p-2">
      <div className="text-xl text-blue-900 border-2 border-blue-900 rounded-md m-2 p-2 text-center">
        <p className="font-bold">Time:</p>
        <p className="min-w-[100px]">{props.time}</p>
      </div>
      <div className="text-xl text-blue-900 border-2 border-blue-900 rounded-md m-2 p-2 text-center">
        <p className="font-bold">Score:</p>
        <p className="min-w-[100px]">{props.score}</p>
      </div>
      {!props.gameOver ? (
        <div className="p-2">
          <button
            className="text-xl font-bold capitalize border-0 outline-0 bg-gradient-to-b from-blue-600 to-blue-800 text-white rounded-md p-2 cursor-pointer text-center w-full"
            onClick={props.reset}
          >
            Reset
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SideBar;

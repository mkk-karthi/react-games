import { Building } from "./Building";
import { Cloud } from "./Cloud";
import { Tree } from "./Tree";

export const Background = () => {
  return (
    <div className="h-full w-[100px]">
      <div className="absolute bottom-[50px]">
        <Cloud />
      </div>
      <div className="absolute bottom-0 flex bg-sky-100">
        <Building className="absolute bottom-[25px] left-[25px]" />
        <Tree />
        <Tree />
      </div>
    </div>
  );
};

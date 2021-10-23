import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActionPreviewFiles } from "../scripts/redux/actions/actions";

export const ImagePreview = () => {

  const statePreviewImage = useSelector(state => state.previewImage);
  const dispatch = useDispatch();

  const onClickHidden = () => {
    dispatch(setActionPreviewFiles(null));
  }

  const imageRef = useRef();
  
  useEffect(() => {
    if (statePreviewImage) {
      const reader = new FileReader();
      reader.onloadend = function(){
        const result = this.result;
        if (imageRef && imageRef.current) {
          imageRef.current.src = result;
        }
      }
      reader.readAsDataURL(statePreviewImage)
    } else {
      imageRef.current.src = "";
    }
    return;
  }, [imageRef, statePreviewImage]);

  return (
    <div className="relative">
      <div className={"absolute w-full h-screen z-10 bg-gray-900 bg-opacity-30 justify-center " + (statePreviewImage ? "flex":"hidden")}
      onClick={onClickHidden}>
        <img srcSet="" alt="preview" ref={imageRef} />
      </div>
    </div>
  )
};

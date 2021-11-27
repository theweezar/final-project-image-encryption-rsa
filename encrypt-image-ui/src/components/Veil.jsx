import { useSelector } from "react-redux";

export const Veil = () => {

  const isUploadToProcess = useSelector(state => state.isUploadToProcess);

  return isUploadToProcess ? (
    <div className="box-border spinner-container element">
      <div className="spinner"></div>
    </div>
  ) : (
    <></>
  );
};

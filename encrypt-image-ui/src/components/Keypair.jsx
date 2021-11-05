import { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setActionUploadPublicKey, setActionUploadPrivateKey } from '../scripts/redux/actions/actions';

const KeySection = ({ title, id, action, keyfile }) => {

  const dispatch = useDispatch();
  const [keyField, setKeyField] = useState();
  const [keyFileName, setKeyFileName] = useState();

  const onUploadKey = (e) => {
    const uploadKey = e.target.files[0];
    if (uploadKey && typeof(action) === "function") {
      dispatch(action(uploadKey))
    }
  }

  // Read key file everytime render this component
  useEffect(() => {
    if (keyfile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = function(){
        setKeyField(this.result);
        setKeyFileName(keyfile.name);
      }
      reader.readAsText(keyfile, "utf-8");
    }
  }, [keyfile]);

  const keyEmptyContent = () => {
    return (
      <>
        <span>
          <FiUpload />
        </span>
        <span className="ml-2">Upload key</span>
      </>
    )
  }

  return (
    <>
      <h1>{title}</h1>
      <div className="w-full h-2/3 overflow-auto break-words mt-4">
        {keyField}
      </div>
      <div className="flex items-center">
        <label htmlFor={id}
        className="bg-gray-500 text-white mt-4 px-4 py-1.5 rounded border border-solid border-gray-600 truncate
        flex items-center justify-center w-full mr-1 hover:bg-gray-600 transition duration-200 cursor-pointer">
          {!keyFileName ? keyEmptyContent() : keyFileName}
        </label>
        {/* <button className="bg-green-500 text-white mt-4 px-4 py-1.5 rounded border border-solid border-green-600
        flex items-center justify-center w-1/2 ml-1 hover:bg-green-600 transition duration-200 cursor-pointer">
          Download key
        </button> */}
      </div>
      

      <input type="file" name={id} id={id} className="hidden"
      accept="*" onChange={onUploadKey} />
    </>
  )
}

export const Keypair = () => {

  const statePublicKeyFile = useSelector(state => state.publicKeyFile);
  const statePrivateKeyFile = useSelector(state => state.privateKeyFile);

  return (
    <div className="body flex h-full">
      <div className="w-1/2 h-full px-2">
        <KeySection title="Public key" id="public-key" action={setActionUploadPublicKey} keyfile={statePublicKeyFile}/>
      </div>
      <div className="w-1/2 h-full px-2">
        <KeySection title="Private key" id="private-key" action={setActionUploadPrivateKey} keyfile={statePrivateKeyFile}/>
      </div>
    </div>
  );
}

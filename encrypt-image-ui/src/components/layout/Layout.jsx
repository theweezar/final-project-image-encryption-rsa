import { Header } from "../Header"
import { ImagePreview } from "../ImagePreview";
import { Veil } from "../Veil";

export const Layout = ({ children }) => {
  return (
    <>
      <ImagePreview />
      <div className="max-w-screen-xl mx-auto px-5">
        <Veil />
        <Header />
        {children}
      </div>
    </>
  );
}
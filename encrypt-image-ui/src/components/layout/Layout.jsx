import { Header } from "../Header"
import { ImagePreview } from "../ImagePreview";
import { Veil } from "../Veil";

export const Layout = ({ children }) => {
  return (
    <>
      <ImagePreview />
      <Veil />
      <div className="max-w-screen-xl mx-auto px-5">
        <Header />
        {children}
      </div>
    </>
  );
}

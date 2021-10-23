import { Header } from "../Header"
import { ImagePreview } from "../ImagePreview";

export const Layout = ({ children }) => {
  return (
    <>
      <ImagePreview />
      <div className="max-w-screen-lg mx-auto px-5 shadow-lg">
        <Header />
        {children}
      </div>
    </>
  );
}
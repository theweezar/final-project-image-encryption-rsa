import { Header } from "../Header"

export const Layout = ({ children }) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />
      {children}
    </div>
  )
}
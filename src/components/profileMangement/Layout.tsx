import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Siderbar from "./Siderbar"

const Layout = () => {
  return (
    <main className="relative">
    <Navbar  />
    <div className="flex"> {/* Add flex container to align sidebar and outlet */}
      <Siderbar />
      <section className="flex flex-col flex-1 min-h-screen px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
        <div className="w-full">
          <Outlet /> {/* Outlet will render nested routes here */}
        </div>
      </section>
    </div>
  </main>
  )
}

export default Layout
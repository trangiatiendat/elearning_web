import Header from "../components/Header";
import Footer from "../components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default HomeLayout;

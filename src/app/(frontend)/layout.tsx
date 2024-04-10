import Header from "@/components/Header";

export const dynamic = "force-dynamic";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[92%]">
      <Header></Header>
      <div className="container my-6">{children}</div>
    </div>
  );
};
export default MainLayout;

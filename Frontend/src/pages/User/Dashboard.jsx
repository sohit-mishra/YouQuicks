import ImportVideo from "@/pages/User/Component/DashboardComponent/ImportVideo";
import AllVideo from "@/pages/User/Component/DashboardComponent/AllVideo";
import AllOrder from "@/pages/User/Component/DashboardComponent/AllOrder";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start gap-6 px-4">
        <div className="w-full md:w-1/2">
          <ImportVideo />
        </div>
        <div className="w-full md:w-1/2">
          <AllVideo />
        </div>
      </div>
      <AllOrder />
    </>
  );
}

import { Loader2 } from "lucide-react";

const AdminLoading = () => {
  return (
    <div className="flex items-center justify-center h-40 lg:h-96">
      <Loader2 className="w-10 h-10 animate-spin"></Loader2>
    </div>
  );
};
export default AdminLoading;

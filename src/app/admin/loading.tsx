import { SymbolIcon } from "@radix-ui/react-icons";

const AdminLoading = () => {
  return (
    <div className="flex items-center justify-center h-40 lg:h-96">
      <SymbolIcon className="w-10 h-10 animate-spin"></SymbolIcon>
    </div>
  );
};
export default AdminLoading;

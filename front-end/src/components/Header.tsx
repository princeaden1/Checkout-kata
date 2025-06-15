import { ShoppingCartIcon } from "./icons";

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 text-xl font-bold">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <ShoppingCartIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-white">
              Checkout System
            </h1>
            <p className="text-xs text-gray-200  mt-1">
              Enterprise-grade checkout solution
            </p>
          </div>
        </div>
        
      </div>
    </header>
  );
}

export default Header;

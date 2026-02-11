import { Link } from "react-router";
import { FileSearchCorner } from "lucide-react";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="bg-primary-dark text-primary-dark-foreground border-b">
      <div className="mx-auto flex w-full items-center justify-between p-4 xl:container">
        <Link to="/" className="text-lg font-bold">
          方塊模擬器
        </Link>
        <Link to="/probability-search">
          <Button variant="ghost" className="hover:bg-transparent">
            機率查詢
            <FileSearchCorner />
          </Button>
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="relative mb-8">
        <div className="bg-primary-lightest/50 dark:bg-primary-dark/10 absolute -inset-4 rounded-full blur-2xl" />
        <FileQuestion className="text-primary-main relative size-24 md:size-32" />
      </div>

      <h1 className="text-secondary-darker dark:text-secondary-lightest mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        404
      </h1>

      <h2 className="text-secondary-deep dark:text-secondary-dark mb-4 text-2xl font-bold">
        頁面不存在
      </h2>

      <p className="text-secondary-main-foreground/70 dark:text-secondary-darker-foreground/70 mb-8 max-w-md">
        抱歉，我們找不到您要查看的頁面。
        <br />
        這可能是因為網址輸入錯誤，或者該頁面已被移動。
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="primary" size="lg">
          <Link to="/">
            <Home className="mr-2" />
            回到首頁
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/probability-search">查看機率查詢</Link>
        </Button>
      </div>
    </div>
  );
}

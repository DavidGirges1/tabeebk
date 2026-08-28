import Link from "next/link";
import { SearchX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl border bg-card shadow-lg space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <SearchX className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-foreground">
          الصفحة المطلوبة غير موجودة
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
        </p>

        <div className="pt-2">
          <Button asChild className="gap-2 rounded-xl h-11 px-6 font-semibold">
            <Link href="/">
              <Home className="w-4 h-4" />
              العودة إلى الصفحة الرئيسية
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DISCLAIMER_KEY = "disclaimer_accepted";

export default function DisclaimerDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(DISCLAIMER_KEY);
    if (hasAccepted !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(DISCLAIMER_KEY, "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-current underline">
          免責聲明
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>免責聲明 (Disclaimer)</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm">
          <p>
            本模擬器提供理論機率參考，所有數據與計算結果均基於公開資訊與社群研究，並非官方數據，不保證與實際遊戲機率完全一致。
          </p>
          <p>
            實際遊戲結果可能受到遊戲版本更新、伺服器設定、未公開機制等因素影響而有所差異。
          </p>
          <p>詳細機率數據可於「機率查詢」頁面查詢。</p>
          <p>
            本網站僅作為遊戲輔助工具使用，不對任何遊戲內的損失或決策結果負責。
          </p>
          <p>請理性使用，所有遊戲決策風險請自行評估。</p>
          <p>使用本網站即表示您已理解並同意上述聲明。</p>
        </div>
        <DialogFooter>
          <Button onClick={handleAccept}>我已了解並同意</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

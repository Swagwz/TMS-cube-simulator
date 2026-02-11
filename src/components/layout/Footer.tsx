import { useState } from "react";
import DisclaimerDialog from "./DisclaimerDialog";
import { CopyCheck, Mail } from "lucide-react";

const EMAIL_ADDRESS = "support@maplestorycube.org";

export default function Footer() {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <footer className="bg-primary-dark text-primary-dark-foreground border-t">
      <div className="container mx-auto flex w-full max-w-4xl items-center justify-between gap-8 p-4 text-sm">
        <div>
          <DisclaimerDialog />
        </div>
        <div className="flex flex-col items-end gap-1">
          <p
            className="flex cursor-pointer items-center gap-1 font-bold"
            onClick={handleCopy}
          >
            聯絡資料
            <Mail className="h-4 w-4" />:<span>{EMAIL_ADDRESS}</span>
            {isCopied && <CopyCheck className="h-4 w-4" />}
          </p>
        </div>
      </div>
    </footer>
  );
}

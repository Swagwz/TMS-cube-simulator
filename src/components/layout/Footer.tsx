import { useRef, useState } from "react";
import DisclaimerDialog from "./DisclaimerDialog";
import { CopyCheck, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL_ADDRESS = "support@maplestorycube.org";

export default function Footer() {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setIsCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <footer className="bg-primary-dark text-primary-dark-foreground border-t">
      <div className="container mx-auto flex w-full flex-wrap items-center justify-center gap-8 p-4 text-sm">
        <DisclaimerDialog />
        <div
          className="flex cursor-pointer flex-col gap-1"
          onClick={handleCopy}
        >
          <div className="flex items-center gap-1 font-bold">
            聯絡資料
            <div className="relative h-4 w-4">
              <AnimatePresence mode="wait" initial={false}>
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <CopyCheck className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mail"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Mail className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            :
          </div>
          <div className="relative w-fit">
            <motion.div
              className="flex items-center gap-1"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: -10 }}
            >
              {EMAIL_ADDRESS}
            </motion.div>
            <motion.div
              className="absolute -bottom-0.5 left-0 h-[1px] w-full bg-current"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isCopied ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ originX: isCopied ? 0 : 1 }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useCallback, useState } from "react";

export default function useDialogState() {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);
  const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);

  return { open, openDialog, closeDialog, toggleDialog, setOpen };
}

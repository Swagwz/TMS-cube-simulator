import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DialogContent, DialogTrigger } from "./ui/dialog";

// --- Context ---
type MultiStepContextType = {
  currentStep: number;
  totalSteps: number;
  setTotalSteps: (n: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStep: () => void;
};

const MultiStepContext = React.createContext<MultiStepContextType | undefined>(
  undefined,
);

function useMultiStep() {
  const context = React.useContext(MultiStepContext);
  if (!context)
    throw new Error("useMultiStep must be used within MultiStepDialog");
  return context;
}

// --- Components ---

const MultiStepDialog = ({
  children,
  resetOnOpen = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
  resetOnOpen?: boolean;
}) => {
  const [currentStep, setStep] = React.useState(1);
  const [totalSteps, setTotalSteps] = React.useState(0);

  const nextStep = () => setStep((p) => Math.min(p + 1, totalSteps));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));
  const resetStep = () => setStep(1);

  React.useEffect(() => {
    if (props.open && resetOnOpen) {
      resetStep();
    }
  }, [props.open]);

  return (
    <MultiStepContext.Provider
      value={{
        currentStep,
        totalSteps,
        setTotalSteps,
        nextStep,
        prevStep,
        resetStep,
      }}
    >
      <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
    </MultiStepContext.Provider>
  );
};

const MultiStepDialogTrigger = DialogTrigger;

const MultiStepDialogContent = DialogContent;

const MultiStepDialogHeader = ({
  children,
  className,
  showProgress = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showProgress?: boolean }) => {
  const { currentStep, totalSteps } = useMultiStep();
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    >
      {children}
      {showProgress && (
        <div className="pt-4">
          <Progress value={progress} className="h-2 w-full transition-all" />
        </div>
      )}
    </div>
  );
};

const MultiStepDialogSteps = ({ children }: { children: React.ReactNode }) => {
  const { currentStep, setTotalSteps } = useMultiStep();
  const steps = React.Children.toArray(children);

  // Update total count once when steps mount
  React.useEffect(() => {
    setTotalSteps(steps.length);
  }, [steps.length, setTotalSteps]);

  return (
    <div className="relative min-h-[200px] overflow-hidden py-4">
      {steps[currentStep - 1]}
    </div>
  );
};

const MultiStepDialogStep = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 ease-in-out">
      {children}
    </div>
  );
};

const MultiStepDialogFooter = ({
  onFinish,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  finishLabel = "Complete",
}: {
  onFinish?: () => void;
  onNext?: (currentStep: number) => void;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
}) => {
  const { currentStep, totalSteps, nextStep, prevStep, resetStep } =
    useMultiStep();
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    onNext?.(currentStep);
    nextStep();
  };

  const handleFinish = () => {
    onFinish?.();
    resetStep();
  };

  return (
    <div className="flex flex-row items-center justify-between border-t pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1}
      >
        {backLabel}
      </Button>

      <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
        Step {currentStep} / {totalSteps}
      </div>

      {isLastStep ? (
        <Button type="button" onClick={handleFinish} variant={"secondary"}>
          {finishLabel}
        </Button>
      ) : (
        <Button type="button" onClick={handleNext} variant={"secondary"}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
};

export {
  MultiStepDialog,
  MultiStepDialogTrigger,
  MultiStepDialogContent,
  MultiStepDialogHeader,
  MultiStepDialogSteps,
  MultiStepDialogStep,
  MultiStepDialogFooter,
};

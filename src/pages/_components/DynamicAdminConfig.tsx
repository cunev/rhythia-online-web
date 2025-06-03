import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { useToast } from "@/shadcn/ui/use-toast";
import { getJwt } from "@/supabase";
import { useState } from "react";
import { executeAdminOperation } from "rhythia-api";

export interface AdminOperationConfig {
  operation: string;
  title: string;
  description: string;
  inputs: {
    name: string;
    label: string;
    placeholder: string;
    type?: "text" | "number" | "email";
    required?: boolean;
  }[];
  confirmationText?: string;
  successMessage?: string;
  buttonText?: string;
}

interface AdminOperationWrapperProps {
  playerId: number;
  isLoading: boolean;
  children: React.ReactNode;
  config: AdminOperationConfig;
}

export function AdminOperationWrapper({
  playerId,
  isLoading,
  children,
  config,
}: AdminOperationWrapperProps) {
  const [open, setOpen] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [confirmInput, setConfirmInput] = useState("");
  const { toast } = useToast();

  const confirmationText = config.confirmationText || "i confirm";
  const buttonText = config.buttonText || "Execute";

  const handleInputChange = (name: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setInputValues({});
    setConfirmInput("");
  };

  const handleConfirm = async () => {
    if (confirmInput.toLowerCase() !== confirmationText.toLowerCase()) {
      toast({
        title: "Confirmation failed",
        description: `You must type "${confirmationText}" to proceed with this action.`,
        variant: "destructive",
      });
      return;
    }

    // Validate required inputs
    const missingFields = config.inputs
      .filter(
        (input) => input.required !== false && !inputValues[input.name]?.trim()
      )
      .map((input) => input.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert input values to appropriate types and build params
      const params: Record<string, any> = {
        userId: playerId,
      };

      config.inputs.forEach((input) => {
        const value = inputValues[input.name];
        if (value !== undefined && value !== "") {
          params[input.name] = input.type === "number" ? Number(value) : value;
        }
      });

      const result = await executeAdminOperation({
        data: {
          operation: config.operation as any,
          params: params as any,
        },
        session: await getJwt(),
      });

      if (result?.success) {
        const successMessage =
          config.successMessage || `${config.title} completed successfully`;

        toast({
          title: "Success",
          description: successMessage,
        });
      } else {
        toast({
          title: "Error",
          description: result?.error || `Failed to ${config.operation}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setOpen(false);
    resetForm();
  };

  const isFormValid = () => {
    const requiredFieldsFilled = config.inputs
      .filter((input) => input.required !== false)
      .every((input) => inputValues[input.name]?.trim());

    const confirmationValid =
      confirmInput.toLowerCase() === confirmationText.toLowerCase();

    return requiredFieldsFilled && confirmationValid;
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <AlertDialogTrigger asChild disabled={isLoading}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>{config.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-4">
          {config.inputs.map((input) => (
            <div key={input.name}>
              <Label
                htmlFor={`${input.name}-input`}
                className="text-sm font-medium"
              >
                {input.label}
                {input.required !== false && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Input
                id={`${input.name}-input`}
                type={input.type || "text"}
                value={inputValues[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                className="mt-2"
                placeholder={input.placeholder}
              />
            </div>
          ))}

          <div>
            <Label htmlFor="confirm-input" className="text-sm font-medium">
              Type "{confirmationText}" to proceed:
            </Label>
            <Input
              id="confirm-input"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="mt-2"
              placeholder={confirmationText}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!isFormValid()}>
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

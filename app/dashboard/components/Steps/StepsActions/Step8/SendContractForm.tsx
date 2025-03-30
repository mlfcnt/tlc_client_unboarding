"use client";

import React, {useState, useRef, useEffect, Suspense} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {toast} from "sonner";
import {useUserRequest} from "@/app/dashboard/api/useUserRequest";
import {ContractDocument} from "./ContractDocument";
import {Loader2, Maximize2, Minimize2} from "lucide-react";
import {
  getKeyFromValue,
  OnboardingStatuses,
} from "@/app/constants/OnboardingStatuses";
import {useUpdateStatusAndInvalidateCache} from "@/app/dashboard/api/updateStatus";
import {PDFViewer} from "@react-pdf/renderer";

// Loading component for the PDF viewer
const PDFViewerWithFallback = ({children, ...props}: any) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="ml-2">Loading Preview...</p>
        </div>
      }
    >
      <PDFViewer {...props}>{children}</PDFViewer>
    </Suspense>
  );
};

interface SendContractFormProps {
  user: OnboardingRequest;
  show: boolean;
  setShow: (show: boolean) => void;
}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const contractDataSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  documentId: z.string().min(1, "ID document is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  courseType: z.string().min(1, "Course type is required"),
  days: z.array(z.string()).min(1, "At least one day must be selected"),
  schedule: z.string().min(1, "Schedule is required"),
  modality: z.string().min(1, "Modality is required"),
  totalValue: z.string().min(1, "Total value is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentDates: z.string().min(1, "Payment dates are required"),
  startDate: z.string().min(1, "Start date is required"),
});

type ContractData = z.infer<typeof contractDataSchema>;

// FullScreen PDF Viewer Component
const FullScreenPDFViewer = ({
  data,
  onClose,
  onConfirm,
}: {
  data: ContractData;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-white z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-semibold">Preview Contract</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullScreen}
            className="rounded-full"
          >
            {isFullScreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-grow relative min-h-0">
        <PDFViewerWithFallback
          width="100%"
          height="100%"
          style={{
            border: "none",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <ContractDocument data={data} showHighlights={true} />
        </PDFViewerWithFallback>
      </div>

      <div className="flex justify-end gap-4 p-4 border-t bg-white cursor-pointer">
        <Button variant="outline" onClick={onClose} className="px-6">
          Edit Details
        </Button>
        <Button
          onClick={onConfirm}
          className="px-6 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        >
          Confirm and Send
        </Button>
      </div>
    </div>
  );
};

export const SendContractForm = ({
  user,
  show,
  setShow,
}: SendContractFormProps) => {
  const [isManual, setIsManual] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [contractData, setContractData] = useState<ContractData | null>(null);

  const {data: userRequest, isLoading: isUserRequestLoading} = useUserRequest(
    user.id
  );

  const {updateStatus} = useUpdateStatusAndInvalidateCache();

  const form = useForm<ContractData>({
    resolver: zodResolver(contractDataSchema),
    values: {
      studentName: "",
      documentId: "",
      email: "",
      phone: "",
      courseType: "",
      days: [],
      schedule: "",
      modality: "",
      totalValue: "",
      paymentMethod: "",
      paymentDates: "",
      startDate: "",
    },
    resetOptions: {
      keepValues: false,
    },
  });

  React.useEffect(() => {
    if (userRequest) {
      form.reset({
        studentName: userRequest.first_name + " " + userRequest.last_name,
        documentId: userRequest.id_number.toString(),
        email: userRequest.email,
        phone: userRequest.phone_number,
        courseType: form.getValues("courseType") || "",
        days: form.getValues("days") || [],
        schedule: form.getValues("schedule") || "",
        modality: form.getValues("modality") || "",
        totalValue: form.getValues("totalValue") || "",
        paymentMethod: form.getValues("paymentMethod") || "",
        paymentDates: form.getValues("paymentDates") || "",
        startDate: userRequest.start_date
          ? new Date(userRequest.start_date).toLocaleDateString()
          : "",
      });
    }
  }, [userRequest, form]);

  const onSubmit = async (data: ContractData) => {
    setContractData(data);
    setShowPreview(true);
    setShow(false);
  };

  const handleConfirm = async () => {
    if (contractData) {
      try {
        const response = await fetch("/api/send-contract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...contractData,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send contract");
        }

        await updateStatus({
          userId: user.id,
          newStatus: getKeyFromValue(OnboardingStatuses.contract_sent),
        });

        toast.success("Contract sent successfully");
        setShowPreview(false);
        setContractData(null);
      } catch (error) {
        console.error("Error sending contract:", error);
        toast.error("Failed to send contract");
      }
    } else {
      toast.error("Error: No contract data found to confirm.");
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setShow(true);
  };

  const handleFormDialogClose = (open: boolean) => {
    if (!open) {
      setIsManual(false);
    }
    setShow(open);
  };

  const handleManualSubmit = async () => {
    await updateStatus({
      userId: user.id,
      newStatus: getKeyFromValue(OnboardingStatuses.contract_sent),
    });
    toast.success("Contract marked as sent manually.");
    setShow(false);
    setIsManual(false);
  };

  if (isUserRequestLoading && show) {
    return (
      <Dialog open={show} onOpenChange={handleFormDialogClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={show} onOpenChange={handleFormDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Contract</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="manual"
              checked={isManual}
              onCheckedChange={(checked) => setIsManual(checked as boolean)}
            />
            <Label htmlFor="manual">Contract has been sent manually</Label>
          </div>

          {isManual ? (
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm text-gray-600">
                Click confirm if the contract for {userRequest?.first_name}{" "}
                {userRequest?.last_name} was already sent.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleFormDialogClose(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleManualSubmit}
                  className="bg-blue-600 hover:bg-blue-800 text-white"
                >
                  Confirm Manual Sending
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Student Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="documentId"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>ID Document</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="courseType"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Course Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select course type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="group">Group</SelectItem>
                            <SelectItem value="private">
                              Private Classes
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="days"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Day(s)</FormLabel>
                        <div className="flex flex-col gap-2">
                          {WEEKDAYS.map((day) => (
                            <div
                              key={day}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={day}
                                checked={field.value.includes(day)}
                                onCheckedChange={(checked) => {
                                  const updatedDays = checked
                                    ? [...field.value, day]
                                    : field.value.filter((d) => d !== day);
                                  field.onChange(updatedDays);
                                }}
                              />
                              <Label htmlFor={day}>{day}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Hour</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modality"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Modality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select modality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="in-person">In-person</SelectItem>
                            <SelectItem value="virtual">Virtual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalValue"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Total Course Value ($COP)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">
                              Single Payment
                            </SelectItem>
                            <SelectItem value="monthly">
                              Monthly Installments
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentDates"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Payment Date(s)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleFormDialogClose(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="cursor-pointer hover:bg-blue-900 bg-blue-600 text-white"
                  >
                    {form.formState.isSubmitting
                      ? "Generating..."
                      : "Preview Contract"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {showPreview && contractData && (
        <FullScreenPDFViewer
          data={contractData}
          onClose={handleCancelPreview}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

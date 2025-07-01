"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CalendarIcon,
  Clock,
  Mail,
  Link2,
  Save,
  CheckCircle,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CapsuleData {
  // Step 1
  name: string;
  message: string;
  mediaFiles: File[];
  fundAmount: string;
  fundCurrency: string;

  // Step 2
  openDate: Date | undefined;
  openTime: string;
  expiryDate: Date | undefined;
  expiryTime: string;
  timezone: string;

  // Step 3
  deliveryMethod: string;
  recipientEmails: string[];
  shareableLink: boolean;
  passwordProtection: boolean;
  password: string;
  accessLimit: string;
}

const initialData: CapsuleData = {
  name: "",
  message: "",
  mediaFiles: [],
  fundAmount: "",
  fundCurrency: "USD",
  openDate: undefined,
  openTime: "12:00",
  expiryDate: undefined,
  expiryTime: "12:00",
  timezone: "UTC",
  deliveryMethod: "email",
  recipientEmails: [],
  shareableLink: false,
  passwordProtection: false,
  password: "",
  accessLimit: "unlimited",
};

export default function CapsuleWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [capsuleData, setCapsuleData] = useState<CapsuleData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("capsule-draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setCapsuleData({
          ...parsed,
          openDate: parsed.openDate ? new Date(parsed.openDate) : undefined,
          expiryDate: parsed.expiryDate
            ? new Date(parsed.expiryDate)
            : undefined,
          mediaFiles: [], // Files can't be serialized
        });
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const saveDraft = () => {
    const draftData = {
      ...capsuleData,
      openDate: capsuleData.openDate?.toISOString(),
      expiryDate: capsuleData.expiryDate?.toISOString(),
      mediaFiles: [], // Don't save files
    };
    localStorage.setItem("capsule-draft", JSON.stringify(draftData));
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!capsuleData.name.trim()) {
          newErrors.name = "Capsule name is required";
        }
        if (!capsuleData.message.trim()) {
          newErrors.message = "Message is required";
        }
        break;

      case 2:
        if (!capsuleData.openDate) {
          newErrors.openDate = "Opening date is required";
        }
        if (!capsuleData.openTime) {
          newErrors.openTime = "Opening time is required";
        }
        break;

      case 3:
        if (
          capsuleData.deliveryMethod === "email" &&
          capsuleData.recipientEmails.length === 0
        ) {
          newErrors.recipientEmails =
            "At least one recipient email is required";
        }
        if (capsuleData.passwordProtection && !capsuleData.password) {
          newErrors.password =
            "Password is required when protection is enabled";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setCapsuleData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setCapsuleData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  const addEmail = () => {
    if (newEmail && !capsuleData.recipientEmails.includes(newEmail)) {
      setCapsuleData((prev) => ({
        ...prev,
        recipientEmails: [...prev.recipientEmails, newEmail],
      }));
      setNewEmail("");
    }
  };

  const removeEmail = (email: string) => {
    setCapsuleData((prev) => ({
      ...prev,
      recipientEmails: prev.recipientEmails.filter((e) => e !== email),
    }));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Here you would submit the capsule data
      console.log("Submitting capsule:", capsuleData);
      alert("Capsule created successfully!");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Capsule Name *</Label>
        <Input
          id="name"
          placeholder="Give your time capsule a memorable name"
          value={capsuleData.name}
          onChange={(e) =>
            setCapsuleData((prev) => ({ ...prev, name: e.target.value }))
          }
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Write your message to the future..."
          value={capsuleData.message}
          onChange={(e) =>
            setCapsuleData((prev) => ({ ...prev, message: e.target.value }))
          }
          className={cn(
            "min-h-[120px]",
            errors.message ? "border-red-500" : ""
          )}
        />
        {errors.message && (
          <p className="text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Media Files</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Upload photos, videos, or documents
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Choose Files</span>
              </Button>
            </Label>
          </div>
        </div>

        {capsuleData.mediaFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            <div className="space-y-2">
              {capsuleData.mediaFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    {file.type.startsWith("image/") && (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    {file.type.startsWith("video/") && (
                      <Video className="h-4 w-4" />
                    )}
                    {!file.type.startsWith("image/") &&
                      !file.type.startsWith("video/") && (
                        <FileText className="h-4 w-4" />
                      )}
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Funds (Optional)</Label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Amount"
              value={capsuleData.fundAmount}
              onChange={(e) =>
                setCapsuleData((prev) => ({
                  ...prev,
                  fundAmount: e.target.value,
                }))
              }
            />
          </div>
          <Select
            value={capsuleData.fundCurrency}
            onValueChange={(value) =>
              setCapsuleData((prev) => ({ ...prev, fundCurrency: value }))
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500">
          Add funds that will be released with your capsule
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Opening Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !capsuleData.openDate && "text-muted-foreground",
                  errors.openDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {capsuleData.openDate
                  ? format(capsuleData.openDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={capsuleData.openDate}
                onSelect={(date) =>
                  setCapsuleData((prev) => ({ ...prev, openDate: date }))
                }
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.openDate && (
            <p className="text-sm text-red-500">{errors.openDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Opening Time *</Label>
          <Input
            type="time"
            value={capsuleData.openTime}
            onChange={(e) =>
              setCapsuleData((prev) => ({ ...prev, openTime: e.target.value }))
            }
            className={errors.openTime ? "border-red-500" : ""}
          />
          {errors.openTime && (
            <p className="text-sm text-red-500">{errors.openTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Expiry Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !capsuleData.expiryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {capsuleData.expiryDate
                  ? format(capsuleData.expiryDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={capsuleData.expiryDate}
                onSelect={(date) =>
                  setCapsuleData((prev) => ({ ...prev, expiryDate: date }))
                }
                disabled={(date) => date < (capsuleData.openDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500">
            When should the capsule become inaccessible?
          </p>
        </div>

        <div className="space-y-2">
          <Label>Expiry Time</Label>
          <Input
            type="time"
            value={capsuleData.expiryTime}
            onChange={(e) =>
              setCapsuleData((prev) => ({
                ...prev,
                expiryTime: e.target.value,
              }))
            }
            disabled={!capsuleData.expiryDate}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Timezone</Label>
        <Select
          value={capsuleData.timezone}
          onValueChange={(value) =>
            setCapsuleData((prev) => ({ ...prev, timezone: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">Eastern Time</SelectItem>
            <SelectItem value="America/Chicago">Central Time</SelectItem>
            <SelectItem value="America/Denver">Mountain Time</SelectItem>
            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
            <SelectItem value="Europe/London">London</SelectItem>
            <SelectItem value="Europe/Paris">Paris</SelectItem>
            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Your capsule will be automatically opened on{" "}
          {capsuleData.openDate
            ? format(capsuleData.openDate, "PPP")
            : "the selected date"}{" "}
          at {capsuleData.openTime} ({capsuleData.timezone}).
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Delivery Method</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className={cn(
              "cursor-pointer transition-colors",
              capsuleData.deliveryMethod === "email" && "ring-2 ring-blue-500"
            )}
            onClick={() =>
              setCapsuleData((prev) => ({ ...prev, deliveryMethod: "email" }))
            }
          >
            <CardContent className="p-4 text-center">
              <Mail className="mx-auto h-8 w-8 mb-2" />
              <h3 className="font-medium">Email Delivery</h3>
              <p className="text-sm text-gray-500">
                Send to specific recipients
              </p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-colors",
              capsuleData.deliveryMethod === "link" && "ring-2 ring-blue-500"
            )}
            onClick={() =>
              setCapsuleData((prev) => ({ ...prev, deliveryMethod: "link" }))
            }
          >
            <CardContent className="p-4 text-center">
              <Link2 className="mx-auto h-8 w-8 mb-2" />
              <h3 className="font-medium">Shareable Link</h3>
              <p className="text-sm text-gray-500">
                Anyone with the link can access
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {capsuleData.deliveryMethod === "email" && (
        <div className="space-y-4">
          <Label>Recipient Emails *</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addEmail()}
            />
            <Button onClick={addEmail} variant="outline">
              Add
            </Button>
          </div>
          {errors.recipientEmails && (
            <p className="text-sm text-red-500">{errors.recipientEmails}</p>
          )}

          {capsuleData.recipientEmails.length > 0 && (
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex flex-wrap gap-2">
                {capsuleData.recipientEmails.map((email) => (
                  <Badge key={email} variant="secondary" className="px-3 py-1">
                    {email}
                    <button
                      onClick={() => removeEmail(email)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Password Protection</Label>
            <p className="text-sm text-gray-500">
              Require a password to access the capsule
            </p>
          </div>
          <Switch
            checked={capsuleData.passwordProtection}
            onCheckedChange={(checked) =>
              setCapsuleData((prev) => ({
                ...prev,
                passwordProtection: checked,
              }))
            }
          />
        </div>

        {capsuleData.passwordProtection && (
          <div className="space-y-2">
            <Label>Password *</Label>
            <Input
              type="password"
              placeholder="Enter a secure password"
              value={capsuleData.password}
              onChange={(e) =>
                setCapsuleData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Access Limit</Label>
        <Select
          value={capsuleData.accessLimit}
          onValueChange={(value) =>
            setCapsuleData((prev) => ({ ...prev, accessLimit: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unlimited">Unlimited</SelectItem>
            <SelectItem value="1">One-time access</SelectItem>
            <SelectItem value="5">5 times</SelectItem>
            <SelectItem value="10">10 times</SelectItem>
            <SelectItem value="50">50 times</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          How many times can the capsule be accessed?
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Time Capsule
          </h1>
          <p className="text-gray-600">
            Preserve your memories and messages for the future
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={saveDraft}
                className="flex items-center space-x-2 bg-transparent"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-xs text-gray-500">
              <span
                className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}
              >
                Content
              </span>
              <span
                className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}
              >
                Timing
              </span>
              <span
                className={currentStep >= 3 ? "text-blue-600 font-medium" : ""}
              >
                Delivery
              </span>
            </div>
          </CardContent>
        </Card>

        {isDraftSaved && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Draft saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Content & Media"}
              {currentStep === 2 && "Time & Expiry Settings"}
              {currentStep === 3 && "Delivery Options"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 &&
                "Add your message, media files, and optional funds"}
              {currentStep === 2 &&
                "Set when your capsule should open and expire"}
              {currentStep === 3 && "Choose how your capsule will be delivered"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Create Capsule</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

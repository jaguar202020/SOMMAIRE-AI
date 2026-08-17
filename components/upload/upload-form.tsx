"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {},
    onUploadError: (err) => {
      console.error("Error occurred while uploading", err);
      toast("Error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: () => {},
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const validatedFields = schema.safeParse({ file });

      if (!validatedFields.success) {
        toast("Something went wrong", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file.",
          style: { color: "red" },
        });
        setIsLoading(false);
        return;
      }

      toast("Uploading PDF...", {
        description: "We are uploading your PDF.",
      });

      const uploadResponse = await startUpload([file]);
      if (!uploadResponse) {
        toast("Something went wrong", {
          description: "Please use a different file",
          style: { color: "red" },
        });
        setIsLoading(false);
        return;
      }

      toast("Processing PDF...", {
        description: "Hang tight! Our AI is reading through your document.",
      });

      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

      const result = await generatePdfSummary({
        fileUrl: uploadFileUrl,
        fileName: file.name,
      });

      const { data = null } = result || {};

      if (!result?.success || !data?.summary) {
        toast("Unable to generate summary", {
          description:
            result?.message || "Please try again with a different PDF.",
          style: { color: "red" },
        });
        return;
      }

      if (data?.summary) {
        toast("Saving PDF...", {
          description: "Hang tight! We are saving your summary.",
        });

        const storeResult = await storePdfSummaryAction({
          summary: data.summary,
          fileUrl: uploadFileUrl,
          title: data.title,
          fileName: file.name,
        });

        if (!storeResult?.success || !storeResult?.data?.id) {
          toast("Unable to save summary", {
            description: storeResult?.message || "Please try again.",
            style: { color: "red" },
          });
          return;
        }

        toast("Summary generated!", {
          description: "Your summary has been successfully saved.",
        });

        formRef.current?.reset();
        router.push(`/summaries/${storeResult.data.id}`);
      }
    } catch (error) {
      console.error("Error occurred", error);
      toast("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again.",
        style: { color: "red" },
      });
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-sm text-muted-foreground">
            Upload PDF
          </span>
        </div>
      </div>

      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-sm text-muted-foreground">
                Processing
              </span>
            </div>
          </div>

          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}

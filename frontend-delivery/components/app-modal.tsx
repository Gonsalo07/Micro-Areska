"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
} from "@nextui-org/react";

import { cn } from "@/lib/utils";

export const appModalClassNames = {
  wrapper: "py-4 sm:py-6",
  base: "my-auto flex max-h-[calc(100dvh-2rem)] flex-col sm:max-h-[90dvh]",
  header: "shrink-0 pr-12",
  body: "min-h-0 overflow-y-auto",
  footer: "shrink-0",
  closeButton:
    "top-3 right-3 z-10 flex h-8 w-8 min-w-8 items-center justify-center p-0",
} as const;

type AppModalProps = ModalProps;

function mergeModalClassNames(classNames?: ModalProps["classNames"]) {
  return {
    base: cn(appModalClassNames.base, classNames?.base),
    backdrop: cn(classNames?.backdrop),
    wrapper: cn(appModalClassNames.wrapper, classNames?.wrapper),
    header: cn(appModalClassNames.header, classNames?.header),
    body: cn(appModalClassNames.body, classNames?.body),
    footer: cn(appModalClassNames.footer, classNames?.footer),
    closeButton: cn(appModalClassNames.closeButton, classNames?.closeButton),
  };
}

export function AppModal({ classNames, ...props }: AppModalProps) {
  return <Modal classNames={mergeModalClassNames(classNames)} {...props} />;
}

export { ModalContent, ModalHeader, ModalBody, ModalFooter };

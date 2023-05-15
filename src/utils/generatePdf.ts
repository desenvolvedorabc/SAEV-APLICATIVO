import { MutableRefObject, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function useGenearePdf() {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return {
    componentRef,
    handlePrint,
  }
}
import { useCallback } from "react";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

const useReceiptCapture = () => {
  const captureReceipt = useCallback(async (ref) => {
    if (!ref.current) return;

    const element = ref.current;
    const originalTransform = element.style.transform;
    const originalMargin = element.style.marginBottom;
    const loadingToast = toast.loading("이미지 생성 중... 📸");

    try {
      element.style.transform = "none";
      element.style.marginBottom = "0";
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        toast.dismiss(loadingToast);

        if (!blob) {
          toast.error("이미지 생성 실패!");
          return;
        }

        const fileName = `거래명세서_${Date.now()}.png`;
        const file = new File([blob], fileName, { type: "image/png" });
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (
          isMobile &&
          navigator.share &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: "거래명세서",
              text: "요청하신 거래명세서입니다.",
            });
            toast.success("공유창을 열었습니다!");
          } catch (e) {
            console.log("공유 취소됨:", e);
          }
        } else {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = fileName;
          link.click();
          toast.success("이미지가 저장되었습니다! 📂");
        }
      }, "image/png");
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("캡처 에러:", err);
      toast.error("캡처 중 오류가 발생했습니다.");
    } finally {
      element.style.transform = originalTransform;
      element.style.marginBottom = originalMargin;
    }
  }, []);

  return { captureReceipt };
};

export default useReceiptCapture;

import ChatWithPdf from "@/components/ChatWithPdf";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebase/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function ChatToFilePage({
  params,
}: {
  params: { id: string };
}) {
  const awaitedParams = await params;
  const { id: docId } = awaitedParams;

  const { userId } = await auth();

  if (!userId || !docId) {
    return notFound();
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const url = ref.data()?.downloadUrl;
  const fileDataRaw = ref.data();
  const fileData = fileDataRaw
    ? {
        ...fileDataRaw,
        createdAt: fileDataRaw.createdAt?.toDate
          ? fileDataRaw.createdAt.toDate().toISOString()
          : null,
      }
    : null;

  if (!url) {
    return notFound();
  }

  return (
    <div className="h-full px-2 sm:px-0 ">
      <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] overflow-hidden">
        {/* PDF Viewer Section - Left */}
        <div className="w-full lg:w-1/2  flex flex-col bg-white/95 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-gray-200/50 shadow-sm lg:shadow-lg">
          <PdfView url={url} fileData={fileData} />
        </div>

        {/* Chat Section - Right */}
        <div className="w-full lg:w-1/2  flex flex-col bg-white/95 lg:bg-white/90 backdrop-blur-sm shadow-sm lg:shadow-lg overflow-hidden">
          <ChatWithPdf id={docId} />
        </div>
      </div>
    </div>
  );
}

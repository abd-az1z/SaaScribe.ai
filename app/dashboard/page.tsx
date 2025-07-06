import Documents from "@/components/Documents"
import Link from "next/link"

export const dynamic = "force-dynamic" 

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto flex md:pt-28 pt-28 flex-col items-center justify-center pb-2 px-4 sm:py-8  lg:px-8">
      <h1  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
        My Documents
      </h1>
      {/* Map all the documents */}
      <div className="w-full flex flex-col items-center justify-center flex-1 space-y-6 sm:space-y-8">
        <div className="w-full max-w-4xl">
          <Documents />
        </div>
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {/* <PlaceholderDocument /> */}
           {/* CTA Section */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] border border-white/20 shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
                Ready to unlock more features?
              </h2>
              <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
                Upgrade to Pro for unlimited documents, advanced analytics, and priority support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pricing"
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] transition-all shadow-md hover:shadow-lg"
                >
                  Upgrade to Pro
                </Link>
                <Link
                  href="/features"
                  className="px-6 py-3 rounded-lg font-medium text-gray-800 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

        </div> 
      </div>
    </div>
  )
}
export default Dashboard
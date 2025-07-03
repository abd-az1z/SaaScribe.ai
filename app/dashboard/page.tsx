import Documents from "@/components/Documents"
import PlaceholderDocument from "@/components/PlaceholderDocument"

export const dynamic = "force-dynamic" // for interactive elements

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto flex  flex-col items-center justify-center py-6 px-4 sm:py-8 md:py-12 lg:px-8">
      <h1  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#00f2fe] via-[#4facfe] to-[#00f2fe] bg-clip-text text-transparent">
        My Documents
      </h1>
      {/* Map all the documents */}
      <div className="w-full flex flex-col items-center justify-center flex-1 space-y-6 sm:space-y-8">
        <div className="w-full max-w-4xl">
          <Documents />
        </div>
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <PlaceholderDocument />
        </div>
      </div>
    </div>
  )
}
export default Dashboard
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex justify-center items-center">
      {/* Full Page Chatbot */}
      <div className="w-full h-full max-w-4xl">
        <Chatbot />
      </div>
    </div>
  );
}

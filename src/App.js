import "./App.css";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-3xl font-bold text-richblack-5 sm:text-5xl">
          Empower Your Future with{" "}
          <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text">
            Coding Skills
          </span>
        </h1>
        <p className="mt-4 max-w-[600px] text-base text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources, including
          hands-on projects, quizzes, and personalized feedback from instructors.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

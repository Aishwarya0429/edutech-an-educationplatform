import "./App.css";

function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-richblack-5 sm:text-5xl">
          Welcome to <span className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text">StudyNotion</span>
        </h1>
        <p className="mt-4 max-w-[500px] text-richblack-200">
          A modern online education platform empowering students to learn and instructors to teach globally.
        </p>
      </div>
    </div>
  );
}

export default App;

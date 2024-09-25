export default function Swifty() {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="p-4 text-5xl font-extrabold text-center">Swifty</h1>
          <p className="underline font-light text-lg text-center">
            Welcome to Swifty, the best comic collection.
          </p>

          <div className="mt-10 bg-gray-800 text-white p-4 rounded-sm"><a href="/login">signup or login</a></div>
        </div>
      </>
    );
  }
  
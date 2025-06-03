import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as Error;
  return (
    <div className="p-4 text-center text-red-600">
      <h1 className="text-xl font-bold">Oops! Something went wrong.</h1>
      <p>{error?.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 mt-4 text-white bg-orange-500 rounded hover:bg-orange-600"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default ErrorPage;
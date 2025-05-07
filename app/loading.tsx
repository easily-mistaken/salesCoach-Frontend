import {LoadingCircle} from "@/components/LoadingCircle"
const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <LoadingCircle />
    </div>
  );
};

export default LoadingPage;
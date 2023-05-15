import ReactLoading from 'react-loading';
const LoadingScreen = () => {
  return (
    <main className="d-flex col-12" style={{ height: "100vh" }}>
      <div className="m-auto">
        <ReactLoading type={"spin"} color={'#5EC2B1'} height={70} width={70} />
      </div>
    </main>
  );
};

export default LoadingScreen;
import './loader.css'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-700 bg-opacity-50 z-50">
      <div className="loader">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Loader;

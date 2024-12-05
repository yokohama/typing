export const Modal = ({
  isShowModal,
  setIsShowModal,
  children,
} : {
  isShowModal: boolean,
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  children: React.ReactNode,
}) => {

  return (
    <>
      {isShowModal && (
        <div className="
          fixed inset-0 
          bg-black bg-opacity-50 
          flex items-center justify-center
          z-50
        ">
          <div className="
            relative
            bg-white 
            p-6 
            rounded-lg 
            shadow-lg 
            w-11/12 max-w-md
          ">
            <button
            onClick={() => setIsShowModal(false)}
            className="
              absolute
              top-2
              right-4
              text-gray-500
              hover:text-gray-700
              text-3xl
              font-bold
              focus:outline-none
            ">×</button>
            {children}
          </div>
        </div>
      )}  
    </>
  );
};

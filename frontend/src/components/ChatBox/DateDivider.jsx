/* eslint-disable react/prop-types */
const DateDivider = ({ date }) => {
  return (
    <div className="text-center text-sm text-gray-600 my-3 sticky top-2 z-10">
      <span className="bg-gray-300 px-3 py-1 rounded-full text-xs">{date}</span>
    </div>
  );
};

export default DateDivider;
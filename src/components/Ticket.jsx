import PropTypes from "prop-types";

const Ticket = ({ data }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden max-w-lg mx-auto"
      role="article"
      aria-label="Conference Ticket"
    >
      <div className="bg-primary text-white p-4 text-center">
        <h2 className="text-2xl font-bold">Conference Ticket</h2>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
            <img
              src={data.avatarUrl}
              alt={`${data.fullName}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-semibold">Name:</span>
            <span>{data.fullName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-semibold">Email:</span>
            <span className="break-all">{data.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
Ticket.propTypes = {
  data: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
};
export default Ticket;

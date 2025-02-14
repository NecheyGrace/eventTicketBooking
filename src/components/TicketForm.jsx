import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("conferenceFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          ticketType: "",
          ticketPrice: "", // Add this new field
          ticketCount: "",
          name: "",
          email: "",
          specialRequest: "",
          profileImage: "",
        };
  });
  const [errors, setErrors] = useState({});
  // const [imagePreview, setImagePreview] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    localStorage.setItem("conferenceFormData", JSON.stringify(formData));
  }, [formData]);

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.ticketType)
        newErrors.ticketType = "Ticket type is required";
      if (!formData.ticketCount)
        newErrors.ticketCount = "Ticket count is required";
    } else if (step === 2) {
      if (!formData.profileImage)
        newErrors.profileImage = "Profile image is required";
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Profile image is required",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, profileImage: "" }));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Pictures"); // Replace with your upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dpptabkay/image/upload", // Replace with your Cloudinary cloud name
        formData
      );
      setFormData((prev) => ({
        ...prev,
        profileImage: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors((prev) => ({
        ...prev,
        profileImage: "Image upload failed. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const downloadTicket = () => {
    const ticketElement = document.getElementById("ticket");

    html2canvas(ticketElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save("ticket.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const handleCreateNewTicket = () => {
    // Reset form data
    setFormData({
      ticketType: "",
      ticketCount: "",
      name: "",
      email: "",
      specialRequest: "",
      profileImage: "",
    });
    // Navigate back to Step 1
    setStep(1);
  };
  return (
    <form className="max-w-[700px] mx-auto p-12 border border-solid border-[#0E464F] rounded-[50px]  bg-[#041E23] shadow-md mt-[46px]">
      <div className="flex justify-between items-center text-[#fff]">
        <h2 className="text-[32px] font-['JejuMyeongjo'] font-normal ">
          Ticket Selection
        </h2>

        <p className="text-[16px] font-normal">Step 1/3</p>
      </div>

      <div className="flex  rounded-full bg-[#0E464F]  items-center justify-between mb-4 overflow-hidden">
        {step >= 1 && (
          <span className={`h-1 w-[36%] rounded-full bg-[#24A0B5]`} />
        )}
        {step >= 2 && (
          <span className={`h-1 w-[68%] rounded-full bg-[#24A0B5]`} />
        )}
        {step >= 3 && (
          <span className={`h-1 w-[100%] rounded-full bg-[#24A0B5]`} />
        )}
      </div>

      {step === 1 && (
        <div className=" w-[604px] flex flex-col gap-3 self-stretch p-6 rounded-[32px]  mt-7 border border-[#0E464F] bg-[#08252B]">
          <div className="flex p-6 flex-col items-center gap-2 self-stretch text-center rounded-[24px] border-r-2 border-b-2 border-l-2 text-grey-98 border-[#07373F] bg-[#0A0C11]/10 bg-[radial-gradient(57.42%_106.59%_at_14.02%_32.06%,_rgba(36,_160,_181,_0.20)_0%,_rgba(36,_160,_181,_0)_100%)] backdrop-blur-[7px]">
            <h2 className=" text-center font-road-rage text-[62px] font-normal leading-none ">
              Techember Fest ”25
            </h2>
            <p className="text-[16px] text-center py-[8px]">
              Join us for an unforgettable experience at <br /> [Event Name]!
              Secure your spot now.
            </p>
            <p className="text-[16px]">
              📍 [Event Location] | | March 15, 2025 | 7:00 PM
            </p>
          </div>
          <div className="bg-[#07373F] h-1 my-[18px] w-full" />
          <p className="text-grey-98 text-[16px] ml-1">Select Ticket Type:</p>
          <div>
            <div className="custom-cont mb-4  ">
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    ticketType: "Basic",
                    ticketPrice: "Free",
                  })
                }
                className={`custom-card p-12 cursor-pointer rounded-lg border-2 ${
                  formData.ticketType === "Basic"
                    ? "border-[#24A0B5] bg-[#12464E]"
                    : "border-[#0E464F]"
                }`}
              >
                <p className="text-xl font-normal text-[#fff] text-[24px]">
                  Free
                </p>
                <p className="text-[#FAFAFA] text-[16px] font-normal uppercase">
                  Regular Access <br />{" "}
                  <p className="text-[#D9D9D9] text-sm">20/52</p>
                </p>
              </div>

              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    ticketType: "Standard",
                    ticketPrice: "$150",
                  })
                }
                className={` custom-card cursor-pointer p-4 rounded-lg border-2 ${
                  formData.ticketType === "Standard"
                    ? "border-[#24A0B5] bg-[#12464E]"
                    : "border-[#0E464F]"
                }`}
              >
                <p className="text-[#fff] text-base font-normal uppercase text-[24px]">
                  $150
                </p>
                <p className="text-[#FAFAFA] text-base font-normal uppercase">
                  VIP Access <br />{" "}
                  <p className="text-[#D9D9D9] text-sm">20/52</p>
                </p>
              </div>

              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    ticketType: "Premium",
                    ticketPrice: "$300",
                  })
                }
                className={` custom-card cursor-pointer p-4 rounded-lg border-2 ${
                  formData.ticketType === "Premium"
                    ? "border-[#24A0B5] bg-[#12464E]"
                    : "border-[#0E464F]"
                }`}
              >
                <p className="text-[#fff] text-base font-normal  uppercase text-[24px]">
                  $300
                </p>
                <p className="text-[#FAFAFA] text-base font-normal  uppercase">
                  VVIP Access <br />{" "}
                  <p className="text-[#D9D9D9] text-sm">20/52</p>
                </p>
              </div>
            </div>

            {errors.ticketType && (
              <p className="text-[#FF4D4D] text-sm">{errors.ticketType}</p>
            )}
            <p className="text-white">Number of Tickets</p>
            <select
              name="ticketCount"
              value={formData.ticketCount}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-white p-2 border border-[#0E464F] rounded-lg  mt-3"
            >
              <option value="">select the number of tickets</option>
              <option value="">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
            </select>
            {errors.ticketCount && (
              <p className="text-red-500">{errors.ticketCount}</p>
            )}
            <div className="flex justify-between mt-8 gap-4">
              <button
                type="button"
                onClick={handleNext}
                className="bg-transparent w-full border border-[#24A0B5] text-[#24A0B5] px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#24A0B5] w-full text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Upload Profile & Enter Details
          </h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {errors.profileImage && (
            <p className="text-red-500">{errors.profileImage}</p>
          )}
          {uploading && <p>Uploading image...</p>}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded mt-3"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 border rounded mt-3"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <textarea
            name="specialRequest"
            placeholder="Special Request?"
            value={formData.specialRequest}
            onChange={(e) =>
              setFormData({ ...formData, specialRequest: e.target.value })
            }
            className="w-full p-2 border rounded mt-3"
          ></textarea>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={uploading}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Conference Ticket</h2>
          <div id="ticket" className="border p-4 rounded-lg">
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <p className="text-center text-lg font-medium">{formData.name}</p>
            <p className="text-center text-sm text-gray-600">
              {formData.email}
            </p>
            <p className="text-center mt-2">
              <strong>Ticket Type:</strong> {formData.ticketType}
            </p>
            <p className="text-center">
              <strong>Number of Tickets:</strong> {formData.ticketCount}
            </p>
            {formData.specialRequest && (
              <p className="text-center mt-2">
                <strong>Special Request:</strong> {formData.specialRequest}
              </p>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleCreateNewTicket}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Create New Ticket
            </button>
            <button
              type="button"
              onClick={downloadTicket}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download Ticket
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default MultiStepForm;

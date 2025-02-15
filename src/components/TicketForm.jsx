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
    <form className="max-w-[700px] mx-auto p-12 border border-solid border-[#0E464F] rounded-[50px] bg-[#08252B]  xl:bg-[#041E23] shadow-md mt-8 xl:mt-[46px]">
      <div>
        {step === 1 && (
          <div className=" xl:flex xl:justify-between xl:items-center text-[#fff]">
            <h2 className="text-[32px] font-['JejuMyeongjo'] font-normal ">
              Ticket Selection
            </h2>
            <p className="text-[16px] font-normal my-2 xl:my-0">Step 1/3</p>
          </div>
        )}
        {step === 2 && (
          <div className=" xl:flex xl:justify-between xl:items-center text-[#fff]">
            <h2 className="text-[32px] font-['JejuMyeongjo'] font-normal ">
              Attendee Details
            </h2>
            <p className="text-[16px] font-normal">Step 2/3</p>
          </div>
        )}
        {step === 3 && (
          <div className=" xl:flex xl:justify-between xl:items-center text-[#fff]">
            <h2 className="text-[32px] font-['JejuMyeongjo'] font-normal ">
              Ready
            </h2>
            <p className="text-[16px] font-normal">Step 1/3</p>
          </div>
        )}
      </div>

      <div className="flex  rounded-full bg-[#0E464F]  items-center justify-between mb-4 overflow-hidden">
        {step === 1 && (
          <span className={`h-1 w-[36%] rounded-full bg-[#24A0B5]`} />
        )}
        {step === 2 && (
          <span className={`h-1 w-[50%] rounded-full bg-[#24A0B5]`} />
        )}
        {step === 3 && (
          <span className={`h-1 w-[100%] rounded-full bg-[#24A0B5]`} />
        )}
      </div>

      {step === 1 && (
        <div className=" xl:w-[604px] flex flex-col gap-3 self-stretch xl:p-6 rounded-[32px]  mt-7 xl:border xl:border-[#0E464F] xl:bg-[#08252B]">
          <div className="flex p-6 flex-col items-center gap-2 self-stretch text-center rounded-[24px] border-r-2 border-b-2 border-l-2 text-grey-98 border-[#07373F] bg-[#0A0C11]/10 bg-[radial-gradient(57.42%_106.59%_at_14.02%_32.06%,_rgba(36,_160,_181,_0.20)_0%,_rgba(36,_160,_181,_0)_100%)] backdrop-blur-[7px]">
            <h2 className=" text-center font-road-rage text-[48px] xl:text-[62px] font-normal leading-none ">
              Techember Fest ”25
            </h2>
            <p className="text-[14px] xl:text-[16px] text-center py-[8px]">
              Join us for an unforgettable <br className="lg:hidden " />{" "}
              experience at <br className="hidden xl:flex" /> [Event Name]!
              Secure
              <br className="lg:hidden" /> your spot now.
            </p>
            <p className="text-[16px] flex">
              📍 [Event Location] <br className="lg:hidden" />
              <span className="lg:flex hidden mx-2"> | | </span> March 15, 2025
              | 7:00 PM
            </p>
          </div>
          <div className="bg-[#07373F] h-1 my-[18px] w-full" />
          <p className="text-grey-98 text-[16px] ml-1">Select Ticket Type:</p>
          <div>
            <div className="custom-cont mb-4 gap-4 xl:gap-0 flex flex-col   lg:flex-row">
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    ticketType: "Basic",
                    ticketPrice: "Free",
                  })
                }
                className={`custom-card xl:w-[158px] w-full p-12 cursor-pointer rounded-lg border-2 ${
                  formData.ticketType === "Basic"
                    ? "border-[#24A0B5] bg-[#12464E]"
                    : "border-[#0E464F]"
                }`}
              >
                <p className="text-[24px] font-semibold xl:text-xl  xl:font-normal text-[#fff] ">
                  Free
                </p>
                <p className="text-[#FAFAFA] text-[16px] font-normal -mt-1 uppercase">
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
                className={`xl:w-[158px] w-full custom-card cursor-pointer p-4 rounded-lg border-2 ${
                  formData.ticketType === "Standard"
                    ? "border-[#24A0B5] bg-[#12464E]"
                    : "border-[#0E464F]"
                }`}
              >
                <p className="text-[24px] font-semibold xl:text-xl  xl:font-normal text-[#fff]">
                  $150
                </p>
                <p className="text-[#FAFAFA] text-base font-normal -mt-1 uppercase">
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
                className={`xl:w-[158px] w-full custom-card cursor-pointer p-4 rounded-lg border-2 ${
                  formData.ticketType === "Premium"
                    ? "border-[#24A0B5] bg-[#12464E]"
                    : "border-[#0E464F]"
                }`}
              >
                <p className="text-[24px] font-semibold xl:text-xl  xl:font-normal text-[#fff]">
                  $300
                </p>
                <p className="text-[#FAFAFA] text-base font-normal -mt-1 uppercase">
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
              className="w-full outline-none bg-transparent text-[#24A0B5] p-2 border border-[#0E464F] rounded-lg  mt-3"
            >
              <option value="">select the number of tickets</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            {errors.ticketCount && (
              <p className="text-red-500">{errors.ticketCount}</p>
            )}
            <div className="flex flex-col-reverse lg:flex-row   justify-between mt-8 lg:gap-4">
              <button
                type="button"
                onClick={handleNext}
                className="bg-transparent w-full border border-[#24A0B5] text-[#24A0B5] px-4 py-3 lg:py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#24A0B5] w-full text-white px-4 mb-4 lg:mb-0  py-3 lg:py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col justify-center items-start gap-8 pt-4  lg:p-6 rounded-[32px] lg:border lg:border-[#0E464F] bg-[#08252B]">
          <div className="flex p-6 flex-col pb-10  gap-2 w-full rounded-[24px] border-r-2 border-b-2 border text-grey-98 border-[#07373F] bg-[#052228]">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Upload Profile Photo
            </h2>

            <div className="w-full relative  items-center justify-center flex mt-3">
              <div className="absolute  h-[240px]  flex w-full items-center justify-center">
                <div className="lg:h-[240px] w-full h-full lg:w-[240px] bg-[#0E464F] flex text-center gap-4 flex-col items-center justify-center rounded-[32px] border-4 border-[#24A0B580]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M25.2639 14.816C24.6812 10.2267 20.7505 6.66669 16.0052 6.66669C12.3305 6.66669 9.13854 8.81469 7.68121 12.2C4.81721 13.056 2.67188 15.76 2.67188 18.6667C2.67188 22.3427 5.66254 25.3334 9.33854 25.3334H10.6719V22.6667H9.33854C7.13321 22.6667 5.33854 20.872 5.33854 18.6667C5.33854 16.7947 6.93721 14.9907 8.90254 14.6454L9.67721 14.5094L9.93321 13.7654C10.8705 11.0307 13.1972 9.33335 16.0052 9.33335C19.6812 9.33335 22.6719 12.324 22.6719 16V17.3334H24.0052C25.4759 17.3334 26.6719 18.5294 26.6719 20C26.6719 21.4707 25.4759 22.6667 24.0052 22.6667H21.3385V25.3334H24.0052C26.9465 25.3334 29.3385 22.9414 29.3385 20C29.337 18.8047 28.9347 17.6444 28.196 16.7047C27.4574 15.7649 26.425 15.0999 25.2639 14.816Z"
                      fill="#FAFAFA"
                    />
                    <path
                      d="M17.3385 18.6667V13.3334H14.6719V18.6667H10.6719L16.0052 25.3334L21.3385 18.6667H17.3385Z"
                      fill="#FAFAFA"
                    />
                  </svg>
                  <p>
                    Drag & drop or click to
                    <br /> upload
                  </p>
                </div>

                <input
                  type="file"
                  id="image-upload"
                  onChange={handleFileChange}
                  className="opacity-0 absolute h-[240px] rounded-[32px]"
                />
              </div>
              <div className="w-full bg-transparent lg:bg-black/20 h-[200px]"></div>
            </div>
            {errors.profileImage && (
              <p className="text-red-500 mt-3">{errors.profileImage}</p>
            )}
            {uploading && <p>Uploading image...</p>}
          </div>
          <div className="bg-[#07373F] h-1 mt-[10px] w-full" />
          <div className="w-full">
            <p className="text-white ml-1">Enter your name</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border h-12 rounded-xl text-white outline-none bg-transparent mt-[10px] border-[#07373F]"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="w-full">
            <p className="text-white ml-1">Enter your email *</p>
            <div className="flex items-center rounded-xl pl-2 gap-2 mt-[10px] border border-[#07373F]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM20 6V6.511L12 12.734L4 6.512V6H20ZM4 18V9.044L11.386 14.789C11.5611 14.9265 11.7773 15.0013 12 15.0013C12.2227 15.0013 12.4389 14.9265 12.614 14.789L20 9.044L20.002 18H4Z"
                  fill="white"
                />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="hello@avioflagos.io"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full  h-12  bg-transparent  outline-none text-white placeholder:text-white/80"
              />
            </div>
            {errors.name && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="w-full">
            <p className="text-white ml-1">Special request?</p>
            <textarea
              name="specialRequest"
              placeholder="Textarea"
              value={formData.specialRequest}
              onChange={(e) =>
                setFormData({ ...formData, specialRequest: e.target.value })
              }
              className="w-full p-[14px] resize-none outline-none rounded-xl mt-[10px] h-[127px] bg-transparent border border-[#07373F] placeholder:text-white/80 text-white"
            />
          </div>
          <div className="flex flex-col-reverse lg:flex-row w-full   justify-between  lg:mt-0 gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-transparent w-full border border-[#24A0B5] text-[#24A0B5] px-4 py-3 lg:py-2 rounded-lg"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={uploading}
              className="bg-[#24A0B5] w-full text-white px-4 py-3 lg:py-2 rounded-lg"
            >
              Get My Free Ticket
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center">
          <div className="text-white w-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4 text-[32px]">
              Your Ticket is Booked!
            </h2>
            <p className="text-white/80 text-[16px]">
              Check your email for a copy or you can{" "}
              <span className="font-bold">download</span>
            </p>
          </div>
          <div id="ticket" className="border p-4 mt-4 w-1/2 rounded-lg ">
            <h2 className=" text-center font-road-rage text-[34px] text-white font-normal leading-none ">
              Techember Fest ”25
            </h2>
            <p className="text-[10px] text-white text-center">
              📍 04 Rumens road, Ikoyi, Lagos
            </p>
            <p className="text-[10px] text-white text-center">
              📅 March 15, 2025 | 7:00 PM
            </p>
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-[140px] h-[140px] rounded-lg border-4 border-[#24A0B5] mx-auto mb-4"
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

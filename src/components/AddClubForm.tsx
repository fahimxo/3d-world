import { useCallback, useRef, useState } from "react";
import { LocationsModal } from "../assets/icons/LocationsModal";
import { Accordion } from "./Accordion";
import { Button } from "./button";
import Combobox from "./combobox";
import { Checkbox } from "./Checkbox";
import { FileUpload } from "./FileUpload";
import Input from "./input";
import ClubList from "./ClubList";

const countryOptions = [
  { value: "usa", label: "United States" },
  { value: "jp", label: "Japan" },
  { value: "uk", label: "United Kingdom" },
];

const AddClubForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    coordinates: "",
    city: "",
    reimaginedName: "",
    country: "",
    sportType: "",
    tecnoSector: "",
    currentName: "",
    clubAnthem: "",
    description: "",
    clubKitVideo: "",
    clubLogo: null,
    lockClub: false,
    hideClub: true,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollPosition = useCallback((clientY: number) => {
    const scrollEl = scrollRef.current;
    const thumbEl = thumbRef.current;
    if (!scrollEl || !thumbEl) return;

    const { top, height } = scrollEl.getBoundingClientRect();
    const thumbHeight = 69;
    const clickPosition = clientY - top - thumbHeight / 2;
    const maxTop = height - thumbHeight;
    const newTop = Math.max(0, Math.min(maxTop, clickPosition));

    const scrollHeight = scrollEl.scrollHeight;
    const maxScroll = scrollHeight - height;
    const scrollPosition = (newTop / maxTop) * maxScroll;

    setThumbTop(newTop);
    scrollEl.scrollTo(0, scrollPosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateScrollPosition(e.clientY);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleComboboxChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, clubLogo: file }));
  };

  return (
    <div
      className=" inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 "
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LocationsModal>
          {/* inner Scroll */}
          <div className=" space-y-6 text-white h-full  ">
            <div className="flex justify-center items-center  border-b border-cyan-400/20">
              <div className="flex gap-20 mb-5">
                <button
                  // onClick={}
                  className="relative flex items-center justify-center cursor-pointer"
                >
                  <svg
                    width="202"
                    height="46"
                    viewBox="0 0 202 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M195.094 1H1V39.5618L8.48031 45H201V8.41573L195.094 1Z"
                      fill="#00FFA6"
                      stroke="#00FFA6"
                    />
                    <path
                      d="M47.104 28V19.866C47.104 19.5113 47.1927 19.1893 47.37 18.9C47.5473 18.6013 47.7807 18.3633 48.07 18.186C48.3687 18.0087 48.6953 17.92 49.05 17.92H55.224C55.5787 17.92 55.9053 18.0087 56.204 18.186C56.5027 18.3633 56.7407 18.6013 56.918 18.9C57.0953 19.1893 57.184 19.5113 57.184 19.866V28H55.322V24.612H48.952V28H47.104ZM48.952 22.764H55.322V19.95C55.322 19.9033 55.3033 19.866 55.266 19.838C55.2287 19.8007 55.1867 19.782 55.14 19.782H49.12C49.0733 19.782 49.0313 19.8007 48.994 19.838C48.966 19.866 48.952 19.9033 48.952 19.95V22.764ZM60.2491 28C59.8851 28 59.5585 27.9113 59.2691 27.734C58.9798 27.5567 58.7465 27.3233 58.5691 27.034C58.4011 26.7447 58.3171 26.4227 58.3171 26.068V21.812C58.3171 21.4573 58.4011 21.1353 58.5691 20.846C58.7465 20.5567 58.9798 20.3233 59.2691 20.146C59.5585 19.9687 59.8851 19.88 60.2491 19.88H64.7431V17.22H66.5771V28H60.2491ZM60.3331 26.166H64.5751C64.6218 26.166 64.6591 26.152 64.6871 26.124C64.7245 26.0867 64.7431 26.0447 64.7431 25.998V21.882C64.7431 21.8353 64.7245 21.798 64.6871 21.77C64.6591 21.7327 64.6218 21.714 64.5751 21.714H60.3331C60.2865 21.714 60.2445 21.7327 60.2071 21.77C60.1791 21.798 60.1651 21.8353 60.1651 21.882V25.998C60.1651 26.0447 60.1791 26.0867 60.2071 26.124C60.2445 26.152 60.2865 26.166 60.3331 26.166ZM69.587 28C69.223 28 68.8963 27.9113 68.607 27.734C68.3177 27.5567 68.0843 27.3233 67.907 27.034C67.739 26.7447 67.655 26.4227 67.655 26.068V21.812C67.655 21.4573 67.739 21.1353 67.907 20.846C68.0843 20.5567 68.3177 20.3233 68.607 20.146C68.8963 19.9687 69.223 19.88 69.587 19.88H74.081V17.22H75.915V28H69.587ZM69.671 26.166H73.913C73.9597 26.166 73.997 26.152 74.025 26.124C74.0623 26.0867 74.081 26.0447 74.081 25.998V21.882C74.081 21.8353 74.0623 21.798 74.025 21.77C73.997 21.7327 73.9597 21.714 73.913 21.714H69.671C69.6243 21.714 69.5823 21.7327 69.545 21.77C69.517 21.798 69.503 21.8353 69.503 21.882V25.998C69.503 26.0447 69.517 26.0867 69.545 26.124C69.5823 26.152 69.6243 26.166 69.671 26.166ZM81.7342 28V17.92H83.7642L89.9522 25.284V17.92H91.8142V28H89.7842L83.5822 20.622V28H81.7342ZM95.1489 28C94.7943 28 94.4723 27.9113 94.1829 27.734C93.8936 27.5567 93.6603 27.3233 93.4829 27.034C93.3056 26.7447 93.2169 26.4227 93.2169 26.068V21.812C93.2169 21.4573 93.3056 21.1353 93.4829 20.846C93.6603 20.5567 93.8936 20.3233 94.1829 20.146C94.4723 19.9687 94.7943 19.88 95.1489 19.88H99.5309C99.8856 19.88 100.208 19.9687 100.497 20.146C100.796 20.3233 101.029 20.5567 101.197 20.846C101.374 21.1353 101.463 21.4573 101.463 21.812V24.864H95.0509V25.998C95.0509 26.0447 95.0649 26.0867 95.0929 26.124C95.1303 26.152 95.1723 26.166 95.2189 26.166H101.463V28H95.1489ZM95.0509 23.212H99.6289V21.882C99.6289 21.8353 99.6103 21.798 99.5729 21.77C99.5449 21.7327 99.5076 21.714 99.4609 21.714H95.2189C95.1723 21.714 95.1303 21.7327 95.0929 21.77C95.0649 21.798 95.0509 21.8353 95.0509 21.882V23.212ZM105.345 28L102.153 19.88H104.099L106.073 24.668L108.145 19.88H110.049L112.261 24.696L114.095 19.88H116.041L112.989 28H111.561L109.111 22.582L106.773 28H105.345ZM123.493 28C123.138 28 122.811 27.9113 122.513 27.734C122.223 27.5567 121.99 27.3233 121.813 27.034C121.635 26.7353 121.547 26.4087 121.547 26.054V19.866C121.547 19.5113 121.635 19.1893 121.813 18.9C121.99 18.6013 122.223 18.3633 122.513 18.186C122.811 18.0087 123.138 17.92 123.493 17.92H131.599V19.782H123.885C123.735 19.782 123.614 19.824 123.521 19.908C123.437 19.992 123.395 20.1133 123.395 20.272V25.648C123.395 25.7973 123.437 25.9187 123.521 26.012C123.614 26.096 123.735 26.138 123.885 26.138H131.599V28H123.493ZM134.934 28C134.58 28 134.258 27.9113 133.968 27.734C133.679 27.5567 133.446 27.3233 133.268 27.034C133.091 26.7447 133.002 26.4227 133.002 26.068V17.206H134.85V25.998C134.85 26.0447 134.864 26.0867 134.892 26.124C134.93 26.152 134.972 26.166 135.018 26.166H136.572V28H134.934ZM139.624 28C139.27 28 138.943 27.9113 138.644 27.734C138.355 27.5567 138.122 27.3233 137.944 27.034C137.776 26.7447 137.692 26.4227 137.692 26.068V19.88H139.526V25.998C139.526 26.0447 139.54 26.0867 139.568 26.124C139.606 26.152 139.648 26.166 139.694 26.166H143.936C143.983 26.166 144.02 26.152 144.048 26.124C144.086 26.0867 144.104 26.0447 144.104 25.998V19.88H145.938V26.068C145.938 26.4227 145.85 26.7447 145.672 27.034C145.504 27.3233 145.276 27.5567 144.986 27.734C144.697 27.9113 144.37 28 144.006 28H139.624ZM147.126 28V17.22H148.96V19.88H153.44C153.795 19.88 154.117 19.9687 154.406 20.146C154.705 20.3233 154.938 20.5567 155.106 20.846C155.283 21.1353 155.372 21.4573 155.372 21.812V26.068C155.372 26.4227 155.283 26.7447 155.106 27.034C154.938 27.3233 154.705 27.5567 154.406 27.734C154.117 27.9113 153.795 28 153.44 28H147.126ZM149.128 26.166H153.37C153.417 26.166 153.454 26.152 153.482 26.124C153.519 26.0867 153.538 26.0447 153.538 25.998V21.882C153.538 21.8353 153.519 21.798 153.482 21.77C153.454 21.7327 153.417 21.714 153.37 21.714H149.128C149.081 21.714 149.039 21.7327 149.002 21.77C148.974 21.798 148.96 21.8353 148.96 21.882V25.998C148.96 26.0447 148.974 26.0867 149.002 26.124C149.039 26.152 149.081 26.166 149.128 26.166Z"
                      fill="#011231"
                    />
                  </svg>
                </button>

                <button
                  // onClick={}
                  className="relative flex items-center justify-center cursor-pointer"
                >
                  <svg
                    width="202"
                    height="46"
                    viewBox="0 0 202 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M195.094 1H1V39.5618L8.48031 45H201V8.41573L195.094 1Z"
                      fill="#00FFA6"
                      fill-opacity="0.1"
                      stroke="#00FFA6"
                    />
                    <path
                      d="M64.8237 28V17.92H74.0637V19.432H66.3497V22.204H72.5517V23.716H66.3497V26.488H74.0637V28H64.8237ZM76.8725 28C76.5365 28 76.2285 27.9207 75.9485 27.762C75.6778 27.594 75.4585 27.37 75.2905 27.09C75.1318 26.81 75.0525 26.5067 75.0525 26.18V21.7C75.0525 21.364 75.1318 21.0607 75.2905 20.79C75.4585 20.5193 75.6778 20.3 75.9485 20.132C76.2285 19.964 76.5365 19.88 76.8725 19.88H81.8005V17.22H83.3125V28H76.8725ZM76.9285 26.488H81.4645C81.5578 26.488 81.6371 26.4553 81.7025 26.39C81.7678 26.3153 81.8005 26.2313 81.8005 26.138V21.742C81.8005 21.6487 81.7678 21.5693 81.7025 21.504C81.6371 21.4293 81.5578 21.392 81.4645 21.392H76.9285C76.8351 21.392 76.7511 21.4293 76.6765 21.504C76.6111 21.5693 76.5785 21.6487 76.5785 21.742V26.138C76.5785 26.2313 76.6111 26.3153 76.6765 26.39C76.7511 26.4553 76.8351 26.488 76.9285 26.488ZM84.7964 28V19.88H86.3084V28H84.7964ZM84.7964 18.732V17.22H86.3084V18.732H84.7964ZM89.7475 28C89.4115 28 89.1035 27.916 88.8235 27.748C88.5529 27.58 88.3335 27.3607 88.1655 27.09C88.0069 26.8193 87.9275 26.516 87.9275 26.18V17.318H89.4395V19.88H92.7715V21.392H89.4395V26.138C89.4395 26.2313 89.4722 26.3153 89.5375 26.39C89.6122 26.4553 89.6962 26.488 89.7895 26.488H92.7715V28H89.7475ZM99.7974 28C99.4614 28 99.1534 27.9207 98.8734 27.762C98.6027 27.594 98.3834 27.3747 98.2154 27.104C98.0567 26.824 97.9774 26.516 97.9774 26.18V19.74C97.9774 19.404 98.0567 19.1007 98.2154 18.83C98.3834 18.55 98.6027 18.3307 98.8734 18.172C99.1534 18.004 99.4614 17.92 99.7974 17.92H108.029V19.432H100.007C99.858 19.432 99.732 19.4833 99.6294 19.586C99.536 19.6793 99.4894 19.8007 99.4894 19.95V25.97C99.4894 26.1193 99.536 26.2453 99.6294 26.348C99.732 26.4413 99.858 26.488 100.007 26.488H108.029V28H99.7974ZM111.253 28C110.917 28 110.614 27.916 110.343 27.748C110.072 27.58 109.853 27.3607 109.685 27.09C109.517 26.8193 109.433 26.516 109.433 26.18V17.22H110.945V26.138C110.945 26.2313 110.978 26.3153 111.043 26.39C111.118 26.4553 111.202 26.488 111.295 26.488H112.765V28H111.253ZM115.738 28C115.402 28 115.094 27.916 114.814 27.748C114.543 27.58 114.324 27.3607 114.156 27.09C113.997 26.8193 113.918 26.516 113.918 26.18V19.88H115.43V26.138C115.43 26.2313 115.462 26.3153 115.528 26.39C115.602 26.4553 115.686 26.488 115.78 26.488H120.316C120.409 26.488 120.488 26.4553 120.554 26.39C120.628 26.3153 120.666 26.2313 120.666 26.138V19.88H122.178V26.18C122.178 26.516 122.094 26.8193 121.926 27.09C121.767 27.3607 121.548 27.58 121.268 27.748C120.997 27.916 120.694 28 120.358 28H115.738ZM123.406 28V17.22H124.918V19.88H129.846C130.182 19.88 130.486 19.964 130.756 20.132C131.036 20.3 131.256 20.5193 131.414 20.79C131.582 21.0607 131.666 21.364 131.666 21.7V26.18C131.666 26.516 131.582 26.8193 131.414 27.09C131.256 27.3607 131.036 27.58 130.756 27.748C130.486 27.916 130.182 28 129.846 28H123.406ZM125.268 26.488H129.804C129.898 26.488 129.977 26.4553 130.042 26.39C130.117 26.3153 130.154 26.2313 130.154 26.138V21.742C130.154 21.6487 130.117 21.5693 130.042 21.504C129.977 21.4293 129.898 21.392 129.804 21.392H125.268C125.175 21.392 125.091 21.4293 125.016 21.504C124.951 21.5693 124.918 21.6487 124.918 21.742V26.138C124.918 26.2313 124.951 26.3153 125.016 26.39C125.091 26.4553 125.175 26.488 125.268 26.488Z"
                      fill="#00FFA6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <ClubList />

            <Accordion title="Club Info">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                {/* ستون چپ */}
                <div className="col-span-2">
                  <Input
                    label="Coordinates"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleInputChange}
                    placeholder="Example: 50.510281, 4.719585"
                    addClub="true"
                  />
                </div>

                <Combobox
                  label="Country"
                  name="country"
                  options={countryOptions}
                  placeholder="Select Country"
                  value={formData.country}
                  onChange={(value) => handleComboboxChange("country", value)}
                  addClub="true"
                />
                <Combobox
                  label="City"
                  name="city"
                  options={[]}
                  placeholder="Select City"
                  value={formData.city}
                  onChange={(value) => handleComboboxChange("city", value)}
                  addClub="true"
                />
                <Combobox
                  label="Tecno Sector"
                  name="TecnoSector"
                  options={[]}
                  placeholder="Select Tecno Sector"
                  value={formData.tecnoSector}
                  onChange={(value) =>
                    handleComboboxChange("tecnoSector", value)
                  }
                  addClub="true"
                />
                <Combobox
                  label="Sport Type"
                  name="sportType"
                  options={[]}
                  placeholder="Select Sport Type"
                  value={formData.sportType}
                  onChange={(value) => handleComboboxChange("sportType", value)}
                />
                <Input
                  label="Reimagined Name"
                  name="reimaginedName"
                  value={formData.reimaginedName}
                  onChange={handleInputChange}
                  placeholder="Example: Galactic Crown"
                  addClub="true"
                />
                <Input
                  label="Current Name"
                  name="currentName"
                  value={formData.currentName}
                  onChange={handleInputChange}
                  placeholder="Example: Real Madrid"
                  addClub="true"
                />
                <Input
                  label="Club anthem"
                  name="clubAnthem"
                  value={formData.clubAnthem}
                  onChange={handleInputChange}
                  placeholder="Enter youtube link"
                  addClub="true"
                />

                {/* ستون راست */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6"> */}
                <div className="col-span-2">
                  <Input
                    label="Club anthem"
                    name="clubAnthem"
                    value={formData.clubAnthem}
                    onChange={handleInputChange}
                    placeholder="Enter youtube link"
                    area="true"
                    addClub="true"
                  />
                </div>
                <FileUpload
                  label="Club Logo"
                  name="clubLogo"
                  onChange={handleFileChange}
                />
              </div>
            </Accordion>

            <div className="space-y-4">
              <Accordion title="Club kit">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  {/* ستون چپ */}

                  <Input
                    label="Video"
                    name="clubKitVideo"
                    value={formData.clubKitVideo}
                    onChange={handleInputChange}
                    placeholder="Example:url.com"
                    addClub="true"
                  />

                  <div className="col-span-2">
                    <Input
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter youtube link"
                      area="true"
                      addClub="true"
                    />
                  </div>
                </div>
              </Accordion>
              <Accordion title="Club stadium">
                <p className="text-cyan-200/80">
                  Stadium form elements go here...
                </p>
              </Accordion>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-cyan-400/20">
              <div className="flex gap-4">
                <Checkbox
                  name="lockClub"
                  label="Lock Club"
                  checked={formData.lockClub}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  name="hideClub"
                  label="Hide Club"
                  checked={formData.hideClub}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="flex gap-4">
                {/* button */}
                <div className="relative z-20 flex justify-center py-8 ">
                  <button
                    onClick={onClose}
                    className="relative flex items-center justify-center cursor-pointer"
                    style={{ width: 114, height: 36 }}
                  >
                    <svg
                      width="114"
                      height="36"
                      viewBox="0 0 114 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0"
                    >
                      <path
                        d="M0 0H107.5L114 7.75385V36H6L0 29.3538V0Z"
                        fill="#00C9FF"
                      />
                    </svg>
                    <span className="text-black font-bold relative z-20">
                      Close
                    </span>
                  </button>
                </div>
                {/* button */}

                <div className="relative z-20 flex justify-center py-8 ">
                  <button
                    onClick={onClose}
                    className="relative flex items-center justify-center cursor-pointer"
                    style={{ width: 114, height: 36 }}
                  >
                    <svg
                      width="114"
                      height="36"
                      viewBox="0 0 114 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0"
                    >
                      <path
                        d="M0 0H107.5L114 7.75385V36H6L0 29.3538V0Z"
                        fill="#00C9FF"
                      />
                    </svg>
                    <span className="text-black font-bold relative z-20">
                      Add
                    </span>
                  </button>
                </div>
                {/* <Button onClick={onClose}>Close</Button>
                <Button>Add</Button> */}
              </div>
            </div>
          </div>

          {/* scroll */}
          <div
            ref={thumbRef}
            className="absolute right-4 top-0 z-20 cursor-pointer"
            style={{
              transform: `translateY(${thumbTop}px)`,
              transition: isDragging ? "none" : "transform 0.05s linear",
            }}
            onMouseDown={handleMouseDown}
          >
            <svg
              width="7"
              height="69"
              viewBox="0 0 7 69"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0V63.0432L7 69V7.44604L0 0Z" fill="#00784E" />
            </svg>
          </div>
          {/* scroll */}
        </LocationsModal>
      </div>
    </div>
  );
};

export default AddClubForm;

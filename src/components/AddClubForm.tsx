import { useState } from "react";
import { LocationsModal } from "../assets/icons/LocationsModal";
import { Accordion } from "./Accordion";
import { Button } from "./button";
import Combobox from "./combobox";
import { Checkbox } from "./Checkbox";
import { FileUpload } from "./FileUpload";
import Input from "./input";

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
    currentName: "",
    clubAnthem: "",
    clubLogo: null,
    lockClub: false,
    hideClub: true,
  });

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LocationsModal>
          <div className="p-8 space-y-6 text-white h-full overflow-y-auto">
            <Accordion title="Club Info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* ستون چپ */}
                <div className="space-y-6">
                  <Input
                    label="Coordinates"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleInputChange}
                    placeholder="Example: 50.510281, 4.719585"
                  />
                  <Combobox
                    label="City"
                    name="city"
                    options={[]}
                    placeholder="Select City"
                    value={formData.city}
                    onChange={(value) => handleComboboxChange("city", value)}
                  />
                  <Input
                    label="Reimagined Name"
                    name="reimaginedName"
                    value={formData.reimaginedName}
                    onChange={handleInputChange}
                    placeholder="Example: Galactic Crown"
                  />
                </div>

                {/* ستون راست */}
                <div className="space-y-6">
                  <Combobox
                    label="Country"
                    name="country"
                    options={countryOptions}
                    placeholder="Select Country"
                    value={formData.country}
                    onChange={(value) => handleComboboxChange("country", value)}
                  />
                  <Combobox
                    label="Sport Type"
                    name="sportType"
                    options={[]}
                    placeholder="Select Sport Type"
                    value={formData.sportType}
                    onChange={(value) =>
                      handleComboboxChange("sportType", value)
                    }
                  />
                  <Input
                    label="Current Name"
                    name="currentName"
                    value={formData.currentName}
                    onChange={handleInputChange}
                    placeholder="Example: Real Madrid"
                  />
                  <Input
                    label="Club anthem"
                    name="clubAnthem"
                    value={formData.clubAnthem}
                    onChange={handleInputChange}
                    placeholder="Enter youtube link"
                  />
                  <FileUpload
                    label="Club Logo"
                    name="clubLogo"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </Accordion>

            <div className="space-y-4">
              <Accordion title="Club kit">
                <p className="text-cyan-200/80">Kit form elements go here...</p>
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
                <Button onClick={onClose}>Close</Button>
                <Button>Add</Button>
              </div>
            </div>
          </div>
        </LocationsModal>
      </div>
    </div>
  );
};

export default AddClubForm;

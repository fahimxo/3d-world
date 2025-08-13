import { useCallback, useEffect, useRef, useState } from "react";
import { LocationsModal } from "../assets/icons/LocationsModal";
import { Accordion } from "./Accordion";
import { Button } from "./button";
import Combobox, { ComboboxOption } from "./combobox";
import { Checkbox } from "./Checkbox";
import { FileUpload } from "./FileUpload";
import Input from "./input";
import ClubList from "./ClubList";
import { API_ENDPOINTS } from "../config/endpoint";
import api from "../config/axios";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



// The getOptionsFor function remains unchanged.
const getOptionsFor = async (
  endpoint: string,
  listName: string
): Promise<ComboboxOption[]> => {
  console.log(`[DEBUG] Fetching data for: ${listName} from ${endpoint}`);
  try {
    const response = await api.post(endpoint, {
      filter: { searchTerm: "" },
    });
    const responseData = response.data ? response.data : response;
    if (
      responseData &&
      responseData.code === 0 &&
      Array.isArray(responseData.result)
    ) {
      return responseData.result.map((item: any) => ({
        value: item?.id?.toString() || item?.name,
        label: item?.name,
      }));
    }
    console.warn(`[DEBUG] Could not parse a valid result for ${listName}.`);
    return [];
  } catch (error: any) {
    console.error(`[DEBUG] Error fetching ${listName}:`, error.message);
    return [];
  }
};

// Schema for form validation (City removed).
const filterSchema = z.object({
  sportType: z.string().optional(),
  technoSector: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  reimaginedName: z.string().optional(),
  currentName: z.string().optional(),
});
type FilterFormValues = z.infer<typeof filterSchema>;


const ClubInfo = ({ onClose, prevData }) => {
  const [formData, setFormData] = useState({
    coordinates: "",
    city: "",
    reimaginedName: "",
    country: "",
    countries: "",
    technoSectorOptions: "",
    currentName: "",
    clubAnthem: "",
    description: "",
    clubKitVideo: "",
    clubLogo: null,
    lockClub: false,
    hideClub: true,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [sportOptions, setSportOptions] = useState<ComboboxOption[]>([]);
  const [cityOptions, setCityOptions] = useState<ComboboxOption[]>([]);
  const [technoSectorOptions, setTechnoSectorOptions] = useState<
    ComboboxOption[]
  >([]);
  const [countryOptions, setCountryOptions] = useState<ComboboxOption[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    sports: false,
    technoSectors: false,
    countries: false,
    cities: false,
  });


  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      sportType: "",
      technoSector: "",
      country: "",
      city: "",
      reimaginedName: "",
      currentName: "",
    },
  });

  useEffect(() => {
    if (sportOptions.length === 0) {
      setLoadingStates((prev) => ({ ...prev, sports: true }));
      getOptionsFor(API_ENDPOINTS.WORLD_MAP.GET_SPORTS_LIST, "Sports").then(
        (data) => {
          setSportOptions(data);
          setLoadingStates((prev) => ({ ...prev, sports: false }));
        }
      );
    }
    if (technoSectorOptions.length === 0) {
      setLoadingStates((prev) => ({ ...prev, technoSectors: true }));
      getOptionsFor(
        API_ENDPOINTS.WORLD_MAP.GET_TECHNO_SECTORS_LIST,
        "Techno Sectors"
      ).then((data) => {
        setTechnoSectorOptions(data);
        setLoadingStates((prev) => ({ ...prev, technoSectors: false }));
      });
    }
    if (countryOptions.length === 0) {
      setLoadingStates((prev) => ({ ...prev, countries: true }));
      getOptionsFor(
        API_ENDPOINTS.WORLD_MAP.GET_COUNTRIES_LIST,
        "Countries"
      ).then((data) => {
        setCountryOptions(data);
        setLoadingStates((prev) => ({ ...prev, countries: false }));
      });
    }
    if (cityOptions.length === 0) {
      setLoadingStates((prev) => ({ ...prev, cities: true }));
      getOptionsFor(API_ENDPOINTS.WORLD_MAP.GET_CITIES_LIST, "Cities").then(
        (data) => {
          setCityOptions(data);
          setLoadingStates((prev) => ({ ...prev, cities: false }));
        }
      );
    }
  }, []);


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
  const handleCheckboxChange = (checked, name) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleComboboxChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, clubLogo: file }));
  };


  const submit = () => {
    const a = {
      createClub_VM: {
        reImaginedName: "string",
        originalClubName: "string",
        lore: "string",
        city: "string",
        latitude: 90,
        longitude: 180,
        logoUrl: "string",
        videoUrl: "string",
        status: 1,
        lockStatus: 1,
        sportId: 0,
        sectorId: 0,
        countryId: 0,
        displayOrder: 0,
        anthemUrl: "string",
        kitImageUrl: "string",
        kitVideoUrl: "string",
        kitDiscription: "string",
        stadiumImageUrl: "string",
        stadiumVideoUrl: "string",
        staduimDiscription: "string",
        bestPlayerImageUrl: "string",
        bestPlayerVideoUrl: "string",
        bestPlayerDiscription: "string",
        coachImageUrl: "string",
        coachVideoUrl: "string",
        coachDiscription: "string",
        vehicleImageUrl: "string",
        vehicleVideoUrl: "string",
        vehicleDiscription: "string",
        symbolImageUrl: "string",
        symbolVideoUrl: "string",
        symbolDiscription: "string",
      },
    };
  };
  return (
    <div onClick={onClose}>
      <div className="grid grid-cols-1 h-full ">
        <Accordion title="Club Info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
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

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={countryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    loadingStates.countries ? "Loading..." : "Select"
                  }
                  label="Country"
                  error={errors.country?.message}
                  addClub="true"
                  salt={true}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={cityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={loadingStates.cities ? "Loading..." : "Select"}
                  label="City"
                  error={errors.city?.message}
                  addClub="true"
                  salt={true}
                />
              )}
            />

            <Controller
              name="technoSector"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={technoSectorOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    loadingStates.technoSectors ? "Loading..." : "Select"
                  }
                  label="Techno Sector"
                  error={errors.technoSector?.message}
                   addClub="true"
                  salt={true}
                />
              )}
            />
            <Controller
              name="sportType"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sportOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={loadingStates.sports ? "Loading..." : "Select"}
                  label="Sport Type"
                  error={errors.sportType?.message}
                   addClub="true"
                  salt={true}
                />
              )}
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
        <RepeatedItem
          title="Club Kit"
          desName="kitVideoUrl"
          urlName="kitImageUrl"
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <RepeatedItem
          title="Club Stadium"
          desName="kitVideoUrl"
          urlName="kitImageUrl"
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <RepeatedItem
          title="Club Best Player"
          desName="staduimDiscription"
          urlName="stadiumVideoUrl"
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <RepeatedItem
          title="Club Manager"
          desName="bestPlayerDiscription"
          urlName="bestPlayerVideoUrl"
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <RepeatedItem
          title="Club Transport"
          desName="kitVideoUrl" //
          urlName="kitImageUrl" //
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <RepeatedItem
          title="Club Mascot"
          desName="kitVideoUrl" //
          urlName="kitImageUrl" //
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* <div className="space-y-4"> */}

        {/* <Accordion title="Club stadium">
            <p className="text-cyan-200/80">Stadium form elements go here...</p>
          </Accordion> */}
        {/* </div> */}

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
            <div className="relative z-20 flex justify-center py-8 ">
              <button
                onClick={submit}
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
                <span className="text-black font-bold relative z-20">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ClubInfo;

const RepeatedItem = ({
  title,
  desName,
  urlName,
  formData,
  handleInputChange,
}) => {
  return (
    <Accordion title={title}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        <Input
          label="Video"
          name={name}
          value={formData.clubKitVideo}
          onChange={handleInputChange}
          placeholder="Example:url.com"
          addClub="true"
        />

        <div className="col-span-2">
          <Input
            label="Description"
            name={urlName}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter youtube link"
            area="true"
            addClub="true"
          />
        </div>
      </div>
    </Accordion>
  );
};

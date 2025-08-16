import { useCallback, useEffect, useRef, useState } from "react";
import { Accordion } from "./Accordion";
import { Button } from "./button";
import Combobox, { ComboboxOption } from "./combobox";
import { Checkbox } from "./Checkbox";
import { FileUpload } from "./FileUpload";
import Input from "./input";
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
  coordinates: z.string(),
  clubAnthem: z.string(),
  clubLore: z.string(),
});
type FilterFormValues = z.infer<typeof filterSchema>;

const ClubInfo = ({ onClose, prevData }: { onClose: any; prevData?: any }) => {
  const [isLoading, setIsLoading] = useState(false);
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
  // const [isDragging, setIsDragging] = useState(false);
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
      coordinates: "",
      clubAnthem: "",
      clubLore: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (checked, name) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, clubLogo: file }));
  };

  const onSubmit = async (data: FilterFormValues) => {
    setIsLoading(true);

    const coords = data.coordinates.split(",").map((c) => c.trim());
    const latitude = coords[0] || "";
    const longitude = coords[1] || "";

    const apiPayload = {
      createClub_VM: {            
        reImaginedName: data.reimaginedName,
        originalClubName: data.currentName,
        lore: data.clubLore,
        city: data.city,
        latitude: latitude,
        longitude: longitude,
        logoUrl: "temp_logo.jpg",
        videoUrl: "",
        status: 1,
        lockStatus: formData.lockClub ? 1 : 0,
        sportId: parseInt(data.sportType, 10) || 0,
        sectorId: parseInt(data.technoSector, 10) || 0,
        countryId: parseInt(data.country, 10) || 0,
        displayOrder: 0,
        anthemUrl: data.clubAnthem,
        kitImageUrl: "",
        kitVideoUrl: "",
        kitDiscription: "",
        stadiumImageUrl: "",
        stadiumVideoUrl: "",
        staduimDiscription: "",
        bestPlayerImageUrl: "",
        bestPlayerVideoUrl: "",
        bestPlayerDiscription: "",
        coachImageUrl: "",
        coachVideoUrl: "",
        coachDiscription: "",
        vehicleImageUrl: "",
        vehicleVideoUrl: "",
        vehicleDiscription: "",
        symbolImageUrl: "",
        symbolVideoUrl: "",
        symbolDiscription: "",
      },
    };

    console.log("Payload to be sent:", JSON.stringify(apiPayload, null, 2));

    try {
      const response = await api.post(
        API_ENDPOINTS.ADMIN.CREATE_CLUB,
        apiPayload
      );

      if (response.data && response.data.code === 0) {
        onClose();
      } else {
        alert(
          "serer error: " +
            (response.data?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 h-full ">
        <Accordion title="Club Info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div className="col-span-2">
              <Controller
                name="coordinates"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Coordinates"
                    {...field}
                    placeholder="Example: 50.510281, 4.719585"
                    addClub="true"
                  />
                )}
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

            <Controller
              name="reimaginedName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Reimagined Name"
                  name="reimaginedName"
                  {...field}
                  placeholder="Example: Galactic Crown"
                  addClub="true"
                />
              )}
            />
            <Controller
              name="currentName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Current Name"
                  name="currentName"
                  {...field}
                  placeholder="Example: Real Madrid"
                  addClub="true"
                />
              )}
            />
            <Controller
              name="clubAnthem"
              control={control}
              render={({ field }) => (
                <Input
                  label="Club anthem"
                  name="clubAnthem"
                  {...field}
                  placeholder="Enter youtube link"
                  addClub="true"
                />
              )}
            />
            <div className="col-span-2">
              <Controller
                name="clubLore"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Club lore"
                    name="clubLore"
                    {...field}
                    placeholder="Enter youtube link"
                    addClub="true"
                    area="true"
                  />
                )}
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
          desName="kitVideoUrl"
          urlName="kitImageUrl"
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <RepeatedItem
          title="Club Mascot"
          desName="kitVideoUrl"
          urlName="kitImageUrl"
          formData={formData}
          handleInputChange={handleInputChange}
        />

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
            <div className="relative flex justify-center py-8 ">
              <Button
                onClick={onClose}
                className="relative flex items-center justify-center cursor-pointer"
              >
                Close
              </Button>
            </div>
            <div className="relative z-20 flex justify-center py-8 ">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="relative flex items-center justify-center cursor-pointer"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
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

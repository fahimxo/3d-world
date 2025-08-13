import { useEffect, useState } from "react";
import api from "../config/axios";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./button";
import Combobox, { ComboboxOption } from "./combobox";
import { FilterButton } from "./filterButton";
import { Modal } from "./modal";
import Input from "./input";
import { API_ENDPOINTS } from "../config/endpoint";

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

interface FiltersProps {
  onFilterSubmit: (payload: object) => void;
  loading: boolean;
  cityOptions: ComboboxOption[];
  setCityOptions: React.Dispatch<React.SetStateAction<ComboboxOption[]>>;
  filterModalVisible: boolean;
  setFilterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Filters: React.FC<FiltersProps> = ({
  onFilterSubmit,
  loading,
  cityOptions,
  setCityOptions,
  filterModalVisible,
  setFilterModalVisible,
}) => {
  const [sportOptions, setSportOptions] = useState<ComboboxOption[]>([]);
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
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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

  const onSubmit: SubmitHandler<FilterFormValues> = async (data) => {
    setIsFormSubmitting(true);

    const filterPayload: Record<string, string | number> = {
      city: data.city,
      reimaginedName: data.reimaginedName,
      currentName: data.currentName,
      sportId: data.sportType ? +data.sportType : undefined,
      sectorId: data.technoSector ? +data.technoSector : undefined,
      countryId: data.country ? +data.country : undefined,
    };

    try {
      onFilterSubmit(filterPayload);
      setFilterModalVisible(false);
    } catch (error) {
      console.error("Failed to submit filters:", error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const areAnyComboboxesLoading = Object.values(loadingStates).some(Boolean);

  return (
    <div className="absolute top-44 md:top-30 left-5 md:left-10 max-w-sm space-y-8 z-40">
      <FilterButton
        onClick={() => setFilterModalVisible((prev) => !prev)}
        className="hidden md:block mb-2"
        filterModalVisible={filterModalVisible}
      />

      {filterModalVisible && (
        <Modal>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* The rest of the form remains unchanged */}
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
                />
              )}
            />
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
                />
              )}
            />
            <Controller
              name="reimaginedName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Write reimagined name"
                  label="Reimagined Name"
                />
              )}
            />
            <Controller
              name="currentName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Write current name"
                  label="Current Name"
                />
              )}
            />
            <div className="w-1/2 mx-auto">
              <Button
                type="submit"
                disabled={
                  areAnyComboboxesLoading || isFormSubmitting || loading
                }
              >
                {isFormSubmitting || loading ? "Submitting..." : "Filter"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

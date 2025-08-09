import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../config/axios";
import { Button } from "./button";
import Combobox, { ComboboxOption } from "./combobox";
import { FilterButton } from "./filterButton";
import { Modal } from "./modal";
import Input from "./input";
import { API_ENDPOINTS } from "../config/endpoint";

const getSportsList = async (): Promise<ComboboxOption[]> => {
  const response = await api.post(API_ENDPOINTS.WORLD_MAP.GET_SPORTS_LIST, {
    filter: { searchTerm: "" },
  });

  if (response && response.code === 0 && Array.isArray(response.result)) {
    return response.result.map((sport: any) => ({
      value: sport.id.toString(),
      label: sport.name,
    }));
  }

  console.warn(
    "Sports list response was not in the expected format:",
    response
  );
  return [];
};

const filterSchema = z.object({
  sportType: z.string().optional(),
  technoSector: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  reimaginedName: z.string().optional(),
  currentName: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export const Filters: React.FC = () => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sportOptions, setSportOptions] = useState<ComboboxOption[]>([]);
  const [isComboboxLoading, setIsComboboxLoading] = useState(false);
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
    if (filterModalVisible && sportOptions.length === 0) {
      setIsComboboxLoading(true);
      getSportsList().then((data) => {
        setSportOptions(data);
        setIsComboboxLoading(false);
      });
    }
  }, [filterModalVisible]);

  const onSubmit: SubmitHandler<FilterFormValues> = (data) => {
    setIsFormSubmitting(true);
    console.log("Submitting final filter data:", data);

    // Simulating a network request for form submission
    setTimeout(() => {
      setIsFormSubmitting(false);
      setFilterModalVisible(false);
    }, 1000);
  };

  return (
    <div className="absolute top-30 left-8 w-full max-w-sm space-y-8 z-40">
      <FilterButton onClick={() => setFilterModalVisible((prev) => !prev)} />

      {filterModalVisible && (
        <Modal>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="sportType"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sportOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={isComboboxLoading ? "Loading..." : "Select..."}
                  label="Sport Type"
                  error={errors.sportType?.message}
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

            <Button
              type="submit"
              disabled={isComboboxLoading || isFormSubmitting}
            >
              {isFormSubmitting ? "Submitting..." : "Apply Filters"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

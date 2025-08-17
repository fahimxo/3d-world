import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Accordion } from './Accordion';
import { Button } from './button';
import Combobox, { ComboboxOption } from './combobox';
import { Checkbox } from './Checkbox';
import { FileUpload } from './FileUpload';
import Input from './input';
import { API_ENDPOINTS } from '../config/endpoint';
import api from '../config/axios';
import { Controller, useForm } from 'react-hook-form';
import z, { url } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import tr from 'zod/v4/locales/tr.cjs';
import { showToast } from '../config/toastService';

enum hideClub {
  hide = 1,
  show = 2,
}
enum lockClub {
  lock = 1,
  unLock = 2,
}
// The getOptionsFor function remains unchanged.
const getOptionsFor = async (
  endpoint: string,
  listName: string
): Promise<ComboboxOption[]> => {
  try {
    const response = await api.post(endpoint, {
      filter: { searchTerm: '' },
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
    return [];
  } catch (error: any) {
    return [];
  }
};

// Schema for form validation (City removed).
const filterSchema = z.object({
  sportType: z.string().optional(),
  technoSector: z.string().optional(),
  country: z.union([z.string(), z.number()]).optional().transform(String),
  city: z.union([z.string(), z.number()]).optional().transform(String),
  reimaginedName: z.string().optional(),
  originalClubName: z.string().optional(),
  coordinates: z.string().min(1, 'Coordinates field is required.'),
  clubAnthem: z.string().url('Club anthem must be a URL.').optional(),
  lore: z.string().optional(),
  kitVideoUrl: z.string().url('Club Kit url must be a URL.').optional(),
  kitDiscription: z.string().optional(),
  stadiumVideoUrl: z.string().url('Club Stadium url must be a URL.').optional(),
  staduimDiscription: z.string().optional(),
  bestPlayerDiscription: z.string().optional(),
  bestPlayerVideoUrl: z
    .string()
    .url('Club Best Player url must be a URL.')
    .optional(),
  coachDiscription: z.string().optional(),
  coachVideoUrl: z.string().url('Club Manager url must be a URL.').optional(),
  vehicleDiscription: z.string().optional(),
  vehicleVideoUrl: z
    .string()
    .url('Club Transport url must be a URL.')
    .optional(),
  symbolDiscription: z.string().optional(),
  symbolVideoUrl: z.string().url('Club Mascot url must be a URL.').optional(),
});
type FilterFormValues = z.infer<typeof filterSchema>;

const ClubInfo = ({ onClose, prevData }: { onClose: any; prevData?: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    logoUrl: null,
    lockClub: prevData?.lockClub === lockClub.lock ? true : false,
    hideClub: prevData?.status === hideClub.hide ? true : false,
  });

  const [sportOptions, setSportOptions] = useState<ComboboxOption[]>([]);
  const [technoSectorOptions, setTechnoSectorOptions] = useState<
    ComboboxOption[]
  >([]);
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
    setValue,
    trigger,
    watch,
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: prevData
      ? {
          ...prevData,
          coordinates: `${prevData.latitude},${prevData.longitude}`,
          sportType: prevData.sportId,
          technoSector: prevData.sectorId,
          country: prevData.countryId,
          clubAnthem: prevData.anthemUrl,
        }
      : {
          sportType: '',
          technoSector: '',
          country: '',
          city: '',
          reimaginedName: '',
          originalClubName: '',
          coordinates: '',
          clubAnthem: '',
          lore: '',
          kitVideoUrl: '',
          kitDiscription: '',
          stadiumVideoUrl: '',
          staduimDiscription: '',
          bestPlayerDiscription: '',
          bestPlayerVideoUrl: '',
          coachDiscription: '',
          coachVideoUrl: '',
          vehicleDiscription: '',
          vehicleVideoUrl: '',
          symbolDiscription: '',
          symbolVideoUrl: '',
        },
  });
  console.log(formData, 'formData', watch('sportType'), watch('technoSector'));

  useEffect(() => {
    if (sportOptions.length === 0) {
      setLoadingStates((prev) => ({ ...prev, sports: true }));
      getOptionsFor(API_ENDPOINTS.WORLD_MAP.GET_SPORTS_LIST, 'Sports').then(
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
        'Techno Sectors'
      ).then((data) => {
        setTechnoSectorOptions(data);
        setLoadingStates((prev) => ({ ...prev, technoSectors: false }));
      });
    }

    // reset(defaultValues);
    // if (countryOptions.length === 0) {
    //   setLoadingStates((prev) => ({ ...prev, countries: true }));
    //   getOptionsFor(
    //     API_ENDPOINTS.WORLD_MAP.GET_COUNTRIES_LIST,
    //     'Countries'
    //   ).then((data) => {
    //     setCountryOptions(data);
    //     setLoadingStates((prev) => ({ ...prev, countries: false }));
    //   });
    // }
    // if (cityOptions.length === 0) {
    //   setLoadingStates((prev) => ({ ...prev, cities: true }));
    //   getOptionsFor(API_ENDPOINTS.WORLD_MAP.GET_CITIES_LIST, 'Cities').then(
    //     (data) => {
    //       setCityOptions(data);
    //       setLoadingStates((prev) => ({ ...prev, cities: false }));
    //     }
    //   );
    // }
  }, []);

  const handleCheckboxChange = (checked, name) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, logoUrl: file }));
  };

  console.log(formData, 'formData');

  const onSubmit = async (data: FilterFormValues) => {
    console.log('herrrrrrrrrrrrrrrrrrrrrrrrreeeeeeeeeeeeeeeee', errors);
    setIsLoading(true);

    const coords = data.coordinates.split(',').map((c) => c.trim());
    const latitude = coords[0] || '';
    const longitude = coords[1] || '';

    const apiPayload = {
      createClub_VM: {
        reImaginedName: data.reimaginedName,
        originalClubName: data.originalClubName,
        lore: data.lore,
        city: data.city,
        latitude: latitude,
        longitude: longitude,
        logoUrl:
          formData?.logoUrl && formData?.logoUrl?.length > 0
            ? formData?.logoUrl.replace('data:image/png;base64,', '')
            : '',
        // videoUrl: '',
        status: formData.hideClub ? hideClub.hide : hideClub.show,
        lockStatus: formData.lockClub ? lockClub.lock : lockClub.unLock,
        sportId: parseInt(data.sportType, 10) || 0,
        sectorId: parseInt(data.technoSector, 10) || 0,
        countryId: parseInt(data.country, 10) || 0,
        // displayOrder: 0, //
        anthemUrl: data.clubAnthem,
        // kitImageUrl: '',
        kitVideoUrl: data.kitVideoUrl,
        kitDiscription: data.kitDiscription,
        // stadiumImageUrl: '',
        stadiumVideoUrl: data.stadiumVideoUrl,
        staduimDiscription: data.staduimDiscription,
        // bestPlayerImageUrl: '',
        bestPlayerVideoUrl: data.bestPlayerVideoUrl,
        bestPlayerDiscription: data.bestPlayerDiscription,
        // coachImageUrl: '',
        coachVideoUrl: data.coachVideoUrl,
        coachDiscription: data.coachDiscription,
        // vehicleImageUrl: '',
        vehicleVideoUrl: data.vehicleVideoUrl,
        vehicleDiscription: data.vehicleDiscription,
        // symbolImageUrl: '',
        symbolVideoUrl: data.symbolVideoUrl,
        symbolDiscription: data.symbolDiscription,
      },
    };

    console.log('Payload to be sent:', JSON.stringify(apiPayload, null, 2));

    try {
      let response;
      if (prevData) {
        response = await api.put(API_ENDPOINTS.ADMIN.UPDATE_CLUB, apiPayload);
      } else {
        response = await api.post(API_ENDPOINTS.ADMIN.CREATE_CLUB, apiPayload);
      }
      console.log(
        'ressssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
        response
      );
      if (response.data && response.data.code === 0) {
        onClose();
        showToast(response.data?.message, 'success');
      } else {
        alert('serer error: ' + (response.data?.message || 'Unknown error'));
        showToast(response.data?.message, 'failed');
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryAndCityNameWithCoordinates = async (data: string) => {
    setIsLoading(true);
    const coordinates = data.replace(/"/g, ' ').trim();

    if (coordinates.replace(/ /g, '').length > 0) {
      try {
        const response: any = await api.post(
          API_ENDPOINTS.WORLD_MAP.GET_COUNTRY_AND_CITY_NAME_WITH_COORDINATES,
          { coordinates }
        );

        if (response?.result && response?.code === 0) {
          setFormData((prev) => ({
            ...prev,
            city: response.result?.cityName,
            country: response.result?.countryName,
          }));
          setValue('city', response.result?.cityName);
          setValue('country', response.result?.countryName);
        } else {
          showToast(response?.message, 'failed');
          // alert('server error: ' + (response.data?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
        console.log('API Error:');
      }
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
                render={({ field }) => {
                  const timeoutRef = useRef<any>(null);

                  const handleChange = (e: any) => {
                    field.onChange(e);

                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                      getCountryAndCityNameWithCoordinates(e.target.value);
                      trigger(['city', 'country']);
                    }, 1000);
                  };

                  return (
                    <Input
                      label="Coordinates"
                      {...field}
                      placeholder="Example: 50.510281, 4.719585"
                      addClub="true"
                      onChange={handleChange}
                    />
                  );
                }}
              />
              {/* <Controller
                name="coordinates"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Coordinates"
                    {...field}
                    placeholder="Example: 50.510281, 4.719585"
                    addClub="true"
                    rules={{
                      onChange: () => {
                        if (
                          ((getValues("currency") as CurrencyItem)
                            ?.id as string) === "IRR"
                        ) {
                          setValue("equivalentWithRial", "1");
                        } else {
                          setValue("equivalentWithRial", "");
                        }
                        trigger(["equivalentWithRial"]);
                      },
                    }}
                  />
                )}
              /> */}
            </div>

            <Controller
              name="country"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    label="Country"
                    name="country"
                    disabled={true}
                    value={field.value}
                    placeholder="Country"
                    addClub="true"
                  />
                  // <Combobox
                  //   options={countryOptions}
                  //   value={field.value}
                  //   onChange={field.onChange}
                  //   placeholder={
                  //     loadingStates.countries ? 'Loading...' : 'Select'
                  //   }
                  //   label="Country"
                  //   error={errors.country?.message}
                  //   addClub="true"
                  //   salt={true}
                  // />
                );
              }}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  label="City"
                  name="city"
                  disabled={true}
                  value={field.value}
                  placeholder="City"
                  addClub="true"
                />
                // <Combobox
                //   options={cityOptions}
                //   value={field.value}
                //   onChange={field.onChange}
                //   placeholder={loadingStates.cities ? 'Loading...' : 'Select'}
                //   label="City"
                //   error={errors.city?.message}
                //   addClub="true"
                //   salt={true}
                // />
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
                    loadingStates.technoSectors ? 'Loading...' : 'Select'
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
                  placeholder={loadingStates.sports ? 'Loading...' : 'Select'}
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
              name="originalClubName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Current Name"
                  name="originalClubName"
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
                name="lore"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Club lore"
                    name="lore"
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
              name="logoUrl"
              onChange={handleFileChange}
            />
          </div>
        </Accordion>
        <RepeatedItem
          title="Club Kit"
          desName="kitDiscription"
          urlName="kitVideoUrl"
          control={control}
        />
        <RepeatedItem
          title="Club Stadium"
          desName="staduimDiscription"
          urlName="stadiumVideoUrl"
          control={control}
        />
        <RepeatedItem
          title="Club Best Player"
          desName="bestPlayerDiscription"
          urlName="bestPlayerVideoUrl"
          control={control}
        />
        <RepeatedItem
          title="Club Manager"
          desName="coachDiscription"
          urlName="coachVideoUrl"
          control={control}
        />
        <RepeatedItem
          title="Club Transport"
          desName="vehicleDiscription"
          urlName="vehicleVideoUrl"
          control={control}
        />
        <RepeatedItem
          title="Club Mascot"
          desName="symbolDiscription"
          urlName="symbolVideoUrl"
          control={control}
        />

        <div className="flex justify-between items-center pt-6 border-t border-cyan-400/20 flex-wrap">
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
                onClick={async () => {
                  setIsLoading(true);
                  await trigger();
                  setTimeout(() => {
                    trigger().then((isValid) => {
                      if (!isValid) {
                        console.log(errors);
                        const errorArray = Object.entries(errors).map(
                          ([field, error]) => ({
                            field,
                            message: error.message,
                            type: error.type,
                          })
                        );

                        errorArray.map(({ message }) =>
                          showToast(message, 'failed')
                        );
                        setIsLoading(true);
                      } else {
                        handleSubmit(onSubmit)();
                      }
                    });
                  }, 500);
                }}
                disabled={isLoading}
                className="relative flex items-center justify-center cursor-pointer"
              >
                {isLoading ? '...Loading' : prevData ? 'Save' : 'Add'}
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

  control,
}) => {
  return (
    <Accordion title={title}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        <Controller
          name={urlName}
          control={control}
          render={({ field }) => (
            <Input
              label="Video"
              name={urlName}
              placeholder="Example:url.com"
              addClub="true"
              {...field}
            />
          )}
        />

        <div className="col-span-2">
          <Controller
            name={desName}
            control={control}
            render={({ field }) => (
              <Input
                label="Description"
                name={desName}
                placeholder="Enter youtube link"
                area="true"
                addClub="true"
                {...field}
              />
            )}
          />
        </div>
      </div>
    </Accordion>
  );
};

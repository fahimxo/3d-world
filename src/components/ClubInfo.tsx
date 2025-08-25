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
import { Loading } from '../assets/icons/Loading';

enum hideClub {
  show = 1,
  hide = 2,
}
export enum lockClub {
  lock = 1,
  unLock = 2,
}

function getFileNameFromBase64(base64String) {
  if (base64String == null) return null;
  // Check if it's a data URL with filename
  const matches = base64String.match(/^data:.+\/(.+);base64,(.*)$/);

  if (matches && matches.length === 3) {
    // Some implementations include filename in the content type
    const filenameMatch = base64String.match(/filename="(.+)"/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }

    // Otherwise try to extract from the content type
    return matches[1] || null;
  }

  return null; // Default if no filename found
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
// const filterSchema = z.object({
//   sportType: z.string().optional(),
//   technoSector: z.string().optional(),
//   country: z.union([z.string(), z.number()]).optional().transform(String),
//   city: z.union([z.string(), z.number()]).optional().transform(String),
//   reImaginedName: z.string().optional(),
//   originalClubName: z.string().optional(),
//   coordinates: z.string().optional(),
//   clubAnthem: z.string().optional(),
//   lore: z.string().optional(),
//   kitVideoUrl: z.string().optional(),
//   kitDiscription: z.string().optional(),
//   stadiumVideoUrl: z.string().optional(),
//   staduimDiscription: z.string().optional(),
//   bestPlayerDiscription: z.string().optional(),
//   bestPlayerVideoUrl: z.string().optional(),
//   coachDiscription: z.string().optional(),
//   coachVideoUrl: z.string().optional(),
//   vehicleDiscription: z.string().optional(),
//   vehicleVideoUrl: z.string().optional(),
//   symbolDiscription: z.string().optional(),
//   symbolVideoUrl: z.string().optional(),
// });
type FilterFormValues = any;

const ClubInfo = ({
  onClose,
  prevData,
  onClubCreated,
}: //   ={
//     "id": 26,
//     "reImaginedName": "Barsaaa",
//     "originalClubName": "string",
//     "lore": "string",
//     "city": "Barcelona",
//     "latitude": "41.379153251657016",
//     "longitude": "2.1199965261722316",
//     "logoUrl": "",
//     "videoUrl": "http://example.com",
//     "status": 1,
//     "lockStatus": 1,
//     "isActive": true,
//     "displayOrder": 0,
//     "sportId": 1,
//     "sportName": "FootBall",
//     "sectorId": 1,
//     "sectorName": "Eurovia",
//     "sectorColorCode": "test",
//     "countryId": 1,
//     "countryName": "Spain",
//     "anthemUrl": "http://example.com",
//     "kitImageUrl": "http://example.com",
//     "kitVideoUrl": "http://example.com",
//     "kitDiscription": "string",
//     "stadiumImageUrl": "http://example.com",
//     "stadiumVideoUrl": "http://example.com",
//     "staduimDiscription": "string",
//     "bestPlayerImageUrl": "http://example.com",
//     "bestPlayerVideoUrl": "http://example.com",
//     "bestPlayerDiscription": "string",
//     "coachImageUrl": "http://example.com",
//     "coachVideoUrl": "http://example.com",
//     "coachDiscription": "string",
//     "vehicleImageUrl": "http://example.com",
//     "vehicleVideoUrl": "http://example.com",
//     "vehicleDiscription": "string",
//     "symbolImageUrl": "http://example.com",
//     "symbolVideoUrl": "http://example.com",
//     "symbolDiscription": "string",
//     "averageRating": 0,
//     "totalRatings": 0,
//     "created": "0001-01-01T00:00:00",
//     "lastModified": null,
//     "logoImage": null
// },
{
  onClose: any;
  prevData?: any;
  onClubCreated?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    logoUrl: `;base64,${prevData?.logoUrl || ''}`,
    lockClub: prevData?.lockStatus === lockClub.lock ? true : false,
    hideClub: prevData?.status === hideClub.hide ? true : false,
  });

  const [sportOptions, setSportOptions] = useState<ComboboxOption[]>([]);
  const [isCoordinatesLoading, setIsCoordinatesLoading] = useState(false);
  const [technoSectorOptions, setTechnoSectorOptions] = useState<
    ComboboxOption[]
  >([]);
  const [loadingStates, setLoadingStates] = useState({
    sports: false,
    technoSectors: false,
    countries: false,
    cities: false,
  });

  const { control, handleSubmit, setValue, trigger } =
    useForm<FilterFormValues>({
      // resolver: zodResolver(filterSchema),
      defaultValues: prevData
        ? {
            ...prevData,
            coordinates: `${prevData.latitude},${prevData.longitude}`,
            sportType: prevData.sportId.toString(),
            technoSector: prevData.sectorId.toString(),
            country: prevData.countryName,
            clubAnthem: prevData.anthemUrl,
            reImaginedName: prevData.reImaginedName,
          }
        : {
            sportType: null,
            technoSector: null,
            country: null,
            city: null,
            reImaginedName: null,
            originalClubName: null,
            coordinates: null,
            clubAnthem: null,
            lore: null,
            kitVideoUrl: null,
            kitDiscription: null,
            stadiumVideoUrl: null,
            staduimDiscription: null,
            bestPlayerDiscription: null,
            bestPlayerVideoUrl: null,
            coachDiscription: null,
            coachVideoUrl: null,
            vehicleDiscription: null,
            vehicleVideoUrl: null,
            symbolDiscription: null,
            symbolVideoUrl: null,
          },
    });

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
    // setIsLoading(true);
    // trigger().then((isValid) => {

    //   setIsLoading(false);
    // });
  }, []);

  const handleCheckboxChange = (checked, name) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, logoUrl: file }));
  };

  const onSubmit = async (data: FilterFormValues) => {
    setIsLoading(true);

    const coords = data?.coordinates
      ? data.coordinates.split(',').map((c) => c.trim())
      : [];
    const latitude = coords?.[0] || '';
    const longitude = coords?.[1] || '';

    const inputClass = prevData ? 'updateClub_VM' : 'createClub_VM';

    const apiPayload = {
      [inputClass]: {
        reImaginedName: data.reImaginedName,
        originalClubName: data.originalClubName,
        lore: data.lore,
        city: data.city,
        latitude: latitude,
        longitude: longitude,
        logoUrl:
          formData?.logoUrl &&
          formData?.logoUrl?.length > 0 &&
          formData?.logoUrl?.split(';base64,')[1]
            ? formData?.logoUrl?.split(';base64,')[1]
            : null,
        // videoUrl: '',
        status: formData.hideClub ? hideClub.hide : hideClub.show,
        lockStatus: formData.lockClub ? lockClub.lock : lockClub.unLock,
        sportId: parseInt(data.sportType, 10) || 0,
        sectorId: parseInt(data.technoSector, 10) || 0,
        countryId: parseInt(data.country, 10) || 0,
        // displayOrder: 0, //
        anthemUrl: data.clubAnthem || null,
        // kitImageUrl: '',
        kitVideoUrl: data.kitVideoUrl || null,
        kitDiscription: data.kitDiscription || null,
        // stadiumImageUrl: '',
        stadiumVideoUrl: data.stadiumVideoUrl || null,
        staduimDiscription: data.staduimDiscription || null,
        // bestPlayerImageUrl: '',
        bestPlayerVideoUrl: data.bestPlayerVideoUrl || null,
        bestPlayerDiscription: data.bestPlayerDiscription || null,
        // coachImageUrl: '',
        coachVideoUrl: data.coachVideoUrl || null,
        coachDiscription: data.coachDiscription || null,
        // vehicleImageUrl: '',
        vehicleVideoUrl: data.vehicleVideoUrl || null,
        vehicleDiscription: data.vehicleDiscription || null,
        // symbolImageUrl: '',
        symbolVideoUrl: data.symbolVideoUrl || null,
        symbolDiscription: data.symbolDiscription || null,
      },
    };

    try {
      let response;
      if (prevData) {
        response = await api.put(API_ENDPOINTS.ADMIN.UPDATE_CLUB, apiPayload);
      } else {
        response = await api.post(API_ENDPOINTS.ADMIN.CREATE_CLUB, apiPayload);
      }
      if (response?.code === 0) {
        showToast(response?.message, 'success');
        if (onClubCreated) {
          onClubCreated();
        } else {
          onClose();
        }
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
      setIsCoordinatesLoading(true);
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
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsCoordinatesLoading(false);
        setIsLoading(false);
        console.log('API Error:');
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 h-full ">
        <Accordion title="Club Info">
          <div className="grid md:grid-cols-3 gap-x-6 gap-y-6 my-2.5">
            <div className="col-span-2">
              <Controller
                name="coordinates"
                control={control}
                rules={{
                  required: 'Coordinates is required',
                }}
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
                    }, 150);
                  };

                  return (
                    <div className="relative">
                      <Input
                        label="Coordinates"
                        {...field}
                        placeholder="Example: 50.510281, 4.719585"
                        addClub="true"
                        onChange={handleChange}
                      />
                      {isCoordinatesLoading && (
                        <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 pointer-events-none">
                          <>
                            <Loading />
                          </>
                        </div>
                      )}
                    </div>
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
                  // error={errors.technoSector?.message}
                  addClub="true"
                  salt={true}
                />
              )}
              rules={{
                required: 'Techno sector is required',
              }}
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
                  // error={errors.sportType?.message}
                  addClub="true"
                  salt={true}
                />
              )}
            />

            <Controller
              name="reImaginedName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Reimagined Name"
                  name="reImaginedName"
                  {...field}
                  value={field.value}
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
              rules={{
                required: 'Current Name is required',
              }}
            />
            <div className="col-span-2 md:col-span-1">
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
                rules={{
                  pattern: {
                    value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
                    message: 'Please enter a valid URL on club anthem field',
                  },
                }}
              />
            </div>
            <div className="col-span-2">
              <Controller
                name="lore"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Club lore"
                    name="lore"
                    {...field}
                    placeholder="Example: Born from Earth’s last unified monarchic alliance during the Age of Collapse..."
                    addClub="true"
                    area="true"
                  />
                )}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <FileUpload
                label="Club Logo"
                name="logoUrl"
                onChange={handleFileChange}
              />
            </div>
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

        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 pt-6 mt-auto border-t border-cyan-400/20">
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
          <div className="flex gap-4 mb-3">
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
                onClick={() => {
                  setIsLoading(true);

                  handleSubmit(
                    (data) => {
                      onSubmit(data);
                      // setIsLoading(false);
                    },
                    (errors) => {
                      const errorArray = Object.entries(errors).map(
                        ([field, error]) => ({
                          field,
                          message: error?.message,
                          type: error?.type,
                        })
                      );

                      errorArray.forEach(({ message }) => {
                        showToast(
                          (message as unknown as string) ?? 'Form error',
                          'failed'
                        );
                      });

                      setIsLoading(false);
                    }
                  )();
                }}
                disabled={isLoading}
                className="relative flex items-center justify-center cursor-pointer"
              >
                {isLoading ? '... Loading' : prevData ? 'Save' : 'Add'}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 my-2">
        <Controller
          name={urlName}
          control={control}
          rules={{
            pattern: {
              value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
              message: `Please enter a valid URL on ${title} Video field`,
            },
          }}
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

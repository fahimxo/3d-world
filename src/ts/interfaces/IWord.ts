import { ComboboxOption } from 'src/components';
import { DataType } from 'src/lib/usePublicClubs';

export interface IWord {
  dom: HTMLElement;
  onPointClick?: (data: any) => void;
  data: DataType[];
  cityList: ComboboxOption[];
  countryList: ComboboxOption[];
  onLoaded?: () => void;
}

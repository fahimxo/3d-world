import { DataType } from "src/app";

export interface IWord {
  dom: HTMLElement;
  onPointClick?: (data: any) => void;
  data: DataType;
}

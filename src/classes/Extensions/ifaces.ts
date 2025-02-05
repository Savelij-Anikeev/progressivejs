export interface Extension {
  name: string;

  getInstance: () => Extension;
}
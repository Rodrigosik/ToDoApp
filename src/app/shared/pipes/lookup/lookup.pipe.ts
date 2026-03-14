import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lookup',
})
export class LookupPipe implements PipeTransform {
  transform(
    value: any,
    catalog: any[],
    idKey: string = 'id',
    displayKey: string = 'name'
  ): string {
    if (!catalog || !Array.isArray(catalog)) {
      return value;
    }
    const item = catalog.find(el => el[idKey] === value);
    return item ? item[displayKey] : value;
  }
}

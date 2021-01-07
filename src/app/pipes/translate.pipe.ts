import { Pipe, PipeTransform } from '@angular/core';
import DICTIONARY from '../constants/dictionary';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  transform(value: string) {
    return value && value != '' && DICTIONARY.find(d => d.en == value.toLowerCase()) && DICTIONARY.find(d => d.en == value.toLowerCase()).es != undefined ? DICTIONARY.find(d => d.en == value.toLowerCase()).es : value;
  }

}

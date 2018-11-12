import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

  fixedHeader = true;

  ReturnFixedHeader() {
    return this.fixedHeader;
  }
}

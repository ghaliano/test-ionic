import { Injectable } from '@angular/core';
import { PartialCollectionView, IriTemplateMapping, hydraIriTemplate } from '../models/hydra.model';

import {
  Store,
  Stock,
  Bait,
  User } from '../models';
@Injectable()

export class ObjectService{
    hydrateFromApi(rootClass: Object, json: string) {
      let dictClass = [];
      return Object.assign(rootClass, JSON.parse(json, (key, value) => {
        if (value
          && value['@type']
          && (!Array.isArray(value))
          && (typeof value == 'object')
          && (value['@type'] != 'hydra:Collection')) {
            if (dictClass.indexOf(value['@type']) !== -1){ 
              return Object.assign(this.createClass('Dict'), value);
            } 
            else if (value['@type'] == 'hydra:IriTemplate'){ 
              return Object.assign(new hydraIriTemplate(), value);
            } 
            else if (value['@type'] == 'hydra:PartialCollectionView'){ 
              return Object.assign(new PartialCollectionView(), value);
            } else if (value['@type'] == 'IriTemplateMapping'){ 
              return Object.assign(new IriTemplateMapping(), value);
            }
            else {
              return Object.assign(
                this.createClass(value['@type']), 
                value
              );
            }
          }
          
        return value;
    }));
  }

  createClass(className: string){
      let theObject:any;

      switch (className) {   
        //case 'Dict': theObject = new Dict(); break;
        case 'User': theObject = new User(); break;
        case 'Store': theObject = new Store(); break;
        case 'Stock': theObject = new Stock(); break;
        case 'Bait': theObject = new Bait(); break;
      }

      return theObject;
    }
}
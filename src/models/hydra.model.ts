export class HydraCollection {
    '@context': string;
    '@id': string;
    '@type': string = "hydra:Collection";
    'hydra:member': Array<any> = [];
    'hydra:search': Array<any> = [];
    'hydra:totalItems': number;
    
    getTotalItem() { 
      return this['hydra:totalItems'];
    }

    getMember() {
      return this['hydra:member'];
    }

    getHydraView() {
      return this['hydra:view'];
    }

    getContext() {
      return this['@context'];
    }

    getId() {
      return this['@id'];
    }

    getType() {
      return this['@type'];
    }
}

export class HydraView {
    '@id': string;
    '@type': string;

    getId() { return this['@id'];}
    getType() { return this['@type'];}
}

export class PartialCollectionView { 
    '@id': string;
    '@type': string;

    getId() { return this['@id'];}
    getType() { return this['@type'];}
}

export class hydraIriTemplate {
    '@type': string;
    'hydra:mapping': Array<IriTemplateMapping>;
    'hydra:template': string;
    'hydra:variableRepresentation': string;
}

export class IriTemplateMapping {
    '@type': string;
    '@property': string;
    '@variable': string;
    required: Boolean;
}
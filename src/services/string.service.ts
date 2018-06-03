import { Injectable } from '@angular/core';

@Injectable()

export class StringService{
  httpBuildQuery(queryData, numericPrefix='', argSeparator='&', tempKey='') {
    numericPrefix = numericPrefix || null;
    argSeparator = argSeparator || '&';
    tempKey = tempKey || null;

    var query = Object.keys(queryData).map(k => {
      var res;
      var key = k;

      if (tempKey) {
        key = tempKey + '[' + key + ']';
      }

      if (typeof queryData[k] === 'object') {
        res = this.httpBuildQuery(queryData[k], null, argSeparator, key);
      } else {
        if (numericPrefix) {
          key = this.isNumeric(key) ? numericPrefix + Number(key) : key;
        }
        res = this.esc(key) + '=' + this.esc(queryData[k]);
      }

      return res;
    });

    return query.join(argSeparator).replace(/[!'()*]/g, '');
  };
  

  esc(param) {
    return encodeURIComponent(param)
      .replace(/[!'()*]/g, 'escape')
      .replace(/%20/g, '+');
  };

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  ucfirst(str: string){
    return  str.charAt(0).toUpperCase() + str.slice(1);
  }

  uniqid() {
    var ts=String(new Date().getTime()), i = 0, out = '';
    for(i=0;i<ts.length;i+=2) {        
       out+=Number(ts.substr(i, 2)).toString(36);    
    }
    
    return ('d'+out);
  }
}
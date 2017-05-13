import * as React from 'react'

export const matchPath = (pathHash, options) => {
  const { exact = false, path } = options

  var pathname = pathHash.substr(2);

  if(!pathname && path=="/"){
    return {
      path, 
      url: path,
      isExact: true,
      id: null
    }
  }

  if (!path || path=="*") {
    return {
      path: null,
      url: pathname,
      isExact: false,
      id: null
    }
  }


  var testPath = path;
  
  var hasID = testPath.indexOf(":") > -1;
  var id = null;

  if(hasID){
    testPath = path.substr(0, path.indexOf(":") );
    id = pathname.substr(path.indexOf(":"));
  } 

  const match = new RegExp(`^${testPath}`).exec(pathname)

  if (!match)
    return null

  const url = match[0]
  const isExact = pathname === url

  if (exact && (!isExact && !hasID )){
      return null;
  }
    

  return {
    path,
    url,
    isExact,
    id
  }
}
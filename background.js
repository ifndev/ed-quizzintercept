var res = "";

function logURL(requestDetails) {
  
  let filter = browser.webRequest.filterResponseData(requestDetails.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: false});
    
    res = res + str
    filter.write(encoder.encode(str));
  }

  filter.onstop = event => {
    filter.close();

    var creating = browser.tabs.create(
      {url: "https://ifndev.software/QuizzParse/#" + btoa(res)}
    )
    res = "";
  }
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["https://api.ecoledirecte.com/*/qcms/*/associations/*.awp?verbe=get&"]}, 
  ["blocking"]
);

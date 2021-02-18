let tell_me_where_to_look= async function() {
    function getResourceRequests(e) {
        let filtered_requests = [];
        let resourcePerformanceEntries = performance.getEntriesByType(`resource`);
        for (let i = 0; i < resourcePerformanceEntries.length; i++) {
            if (resourcePerformanceEntries[i].initiatorType == `img` || resourcePerformanceEntries[i].initiatorType == `script` || resourcePerformanceEntries[i].initiatorType == `xmlhttprequest`) {
                filtered_requests.push(resourcePerformanceEntries[i].name)
            }
        };
        return filtered_requests
    };

    //JSON P funktion siehe https://gist.github.com/walsh9/c4722c5f3c90e1cc0a5b
    function jsonp(uri) {
        return new Promise(function(resolve, reject) {
            let id = `_` + Math.round(10000 * Math.random());
            let callbackName = `jsonp_callback_` + id;
            window[callbackName] = function(data) {
                delete window[callbackName];
                let ele = document.getElementById(id);
                ele.parentNode.removeChild(ele);
                resolve(data)
            };
            let src = uri + `&callback=` + callbackName;
            let script = document.createElement(`script`);
            script.src = src;
            script.id = id;
            script.addEventListener(`error`, reject);
            (document.getElementsByTagName(`head`)[0] || document.body || document.documentElement).appendChild(script)
        })
    };
    await jsonp(getResourceRequests().filter(url => {
        return url.includes(`GeoPhoto`)
    })[0]).then(res => {
        let koordinaten = res[1][0][5][0][1][0].slice(2);
        window.open(`https://www.google.com/maps/search/${koordinaten[0]},+${koordinaten[1]}`)

    })
};
tell_me_where_to_look()

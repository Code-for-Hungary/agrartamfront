if (typeof agrarloader !== "object") {
    agrarloader = {
        iFrameId: "agrartamfrontframe",
        params: "",
        BaseUrl: "",
        SetBaseUrl: function (Url) {
            if (agrarloader.BaseUrl != "") return;
            matches = String(Url)
                .toLowerCase()
                .match(/(http|https):\/\/(.[^\/]+)\//i);
            agrarloader.BaseUrl = matches[0];
        },
        IFrameOnLoad: function () {
            iFrameResize({}, "#" + agrarloader.iFrameId);
        },
        Init: function () {
            function _toConsumableArray(arr) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            console.log(window.location.search);

            let scripts = document.getElementsByTagName("script"),
                myScripts = []
                    .concat(_toConsumableArray(scripts))
                    .filter(function (x) {
                        return x.src.match(/iframeloader\.js/);
                    }),
                me = myScripts[myScripts.length - 1],
                src = me.src.split("?");

            agrarloader.SetBaseUrl(src[0]);
            agrarloader.params = window.location.search;

            var iframe = document.createElement("iframe");
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    agrarloader.IFrameOnLoad();
                });
            } else {
                iframe.addEventListener(
                    "load",
                    function () {
                        agrarloader.IFrameOnLoad();
                    },
                    false
                );
            }
            iframe.setAttribute(
                "src",
                agrarloader.BaseUrl + agrarloader.params
            );
            iframe.setAttribute("id", agrarloader.iFrameId);
            iframe.setAttribute("height", "100%");
            iframe.setAttribute("width", "100%");
            iframe.style.overflow = "hidden";
            iframe.style.border = "none";
            me.parentNode.appendChild(iframe);
            setTimeout(function () {}, 1e3);
        },
    };
}
agrarloader.Init();

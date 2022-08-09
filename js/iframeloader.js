if (typeof agrarloader !== "object") {
    agrarloader = {
        iFrameId : 'agrartamfrontframe',
        params: '',
        BaseUrl: '',
        SetBaseUrl: function(Url) {
            if (agrarloader.BaseUrl != '') return;
            matches = String(Url).toLowerCase().match(/(http|https):\/\/(.[^\/]+)\//i);
            agrarloader.BaseUrl = matches[0]
        },
        getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(agrarloader.params);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        IFrameOnLoad: function() {
            iFrameResize({}, '#' + agrarloader.iFrameId);
        },
        Init: function() {
            var scripts = document.getElementsByTagName("script");

            function _toConsumableArray(arr) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i]
                }
                return arr2
            }

            var myScripts = [].concat(_toConsumableArray(scripts)).filter(function (x) {
                return x.src.match(/iframeloader\.js/)
            });
            var me = myScripts[myScripts.length - 1];
            var src = me.src.split("?");
            agrarloader.params = '?' + src[1];
            agrarloader.SetBaseUrl(src[0]);

            var iframe = document.createElement("iframe");
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    agrarloader.IFrameOnLoad()
                })
            } else {
                iframe.addEventListener("load", function () {
                    agrarloader.IFrameOnLoad()
                }, false)
            }
            iframe.setAttribute('src', agrarloader.BaseUrl);
            iframe.setAttribute('id', agrarloader.iFrameId);
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('width', '100%');
            iframe.style.overflow = 'hidden';
            iframe.style.border = 'none';
            me.parentNode.appendChild(iframe);
            setTimeout(function () {
            }, 1e3)
        }
    };
}
agrarloader.Init();
